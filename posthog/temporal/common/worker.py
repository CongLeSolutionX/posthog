import asyncio
import signal
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta

from django.conf import settings
from temporalio.runtime import PrometheusConfig, Runtime, TelemetryConfig
from temporalio.worker import UnsandboxedWorkflowRunner, Worker

from posthog.temporal.common.client import connect
from posthog.temporal.common.posthog_client import PostHogClientInterceptor
from posthog.temporal.common.sentry import SentryInterceptor


def _debug_pyarrows():
    if settings.PYARROW_DEBUG_LOGGING:
        import pyarrow as pa

        pa.log_memory_allocations(enable=True)


async def start_worker(
    host,
    port,
    metrics_port,
    namespace,
    task_queue,
    workflows,
    activities,
    server_root_ca_cert=None,
    client_cert=None,
    client_key=None,
    max_concurrent_workflow_tasks=None,
    max_concurrent_activities=None,
):
    _debug_pyarrows()

    runtime = Runtime(telemetry=TelemetryConfig(metrics=PrometheusConfig(bind_address=f"0.0.0.0:{metrics_port:d}")))
    client = await connect(
        host,
        port,
        namespace,
        server_root_ca_cert,
        client_cert,
        client_key,
        runtime=runtime,
    )

    worker = Worker(
        client,
        task_queue=task_queue,
        workflows=workflows,
        activities=activities,
        workflow_runner=UnsandboxedWorkflowRunner(),
        graceful_shutdown_timeout=timedelta(minutes=5),
        interceptors=[SentryInterceptor(), PostHogClientInterceptor()],
        activity_executor=ThreadPoolExecutor(max_workers=max_concurrent_activities or 50),
        max_concurrent_activities=max_concurrent_activities or 50,
        max_concurrent_workflow_tasks=max_concurrent_workflow_tasks,
    )

    # catch the TERM signal, and stop the worker gracefully
    # https://github.com/temporalio/sdk-python#worker-shutdown
    async def shutdown_worker():
        await worker.shutdown()

    loop = asyncio.get_event_loop()
    loop.add_signal_handler(signal.SIGTERM, lambda: asyncio.create_task(shutdown_worker()))

    await worker.run()
