# This file contains all CREATE TABLE queries, used to sync and test schema
import re

from posthog.heatmaps.sql import (
    HEATMAPS_TABLE_SQL,
    WRITABLE_HEATMAPS_TABLE_SQL,
    DISTRIBUTED_HEATMAPS_TABLE_SQL,
    KAFKA_HEATMAPS_TABLE_SQL,
    HEATMAPS_TABLE_MV_SQL,
)

from posthog.clickhouse.dead_letter_queue import (
    DEAD_LETTER_QUEUE_TABLE_SQL,
    DEAD_LETTER_QUEUE_TABLE_MV_SQL,
    KAFKA_DEAD_LETTER_QUEUE_TABLE_SQL,
)
from posthog.clickhouse.log_entries import (
    LOG_ENTRIES_TABLE_SQL,
    LOG_ENTRIES_TABLE_MV_SQL,
    KAFKA_LOG_ENTRIES_TABLE_SQL,
)
from posthog.clickhouse.plugin_log_entries import (
    PLUGIN_LOG_ENTRIES_TABLE_SQL,
    PLUGIN_LOG_ENTRIES_TABLE_MV_SQL,
    KAFKA_PLUGIN_LOG_ENTRIES_TABLE_SQL,
)
from posthog.models.app_metrics.sql import (
    APP_METRICS_DATA_TABLE_SQL,
    APP_METRICS_MV_TABLE_SQL,
    KAFKA_APP_METRICS_TABLE_SQL,
    DISTRIBUTED_APP_METRICS_TABLE_SQL,
)
from posthog.models.app_metrics2.sql import (
    APP_METRICS2_DATA_TABLE_SQL,
    APP_METRICS2_MV_TABLE_SQL,
    KAFKA_APP_METRICS2_TABLE_SQL,
    DISTRIBUTED_APP_METRICS2_TABLE_SQL,
)
from posthog.models.channel_type.sql import (
    CHANNEL_DEFINITION_TABLE_SQL,
    CHANNEL_DEFINITION_DATA_SQL,
    CHANNEL_DEFINITION_DICTIONARY_SQL,
)
from posthog.models.cohort.sql import (
    CREATE_COHORTPEOPLE_TABLE_SQL,
)
from posthog.models.event.sql import (
    EVENTS_TABLE_SQL,
    EVENTS_TABLE_JSON_MV_SQL,
    EVENTS_RECENT_TABLE_SQL,
    EVENTS_RECENT_TABLE_JSON_MV_SQL,
    WRITABLE_EVENTS_TABLE_SQL,
    KAFKA_EVENTS_TABLE_JSON_SQL,
    KAFKA_EVENTS_RECENT_TABLE_JSON_SQL,
    DISTRIBUTED_EVENTS_TABLE_SQL,
    DISTRIBUTED_EVENTS_RECENT_TABLE_SQL,
)
from posthog.models.group.sql import (
    GROUPS_TABLE_SQL,
    GROUPS_TABLE_MV_SQL,
    KAFKA_GROUPS_TABLE_SQL,
)
from posthog.models.ingestion_warnings.sql import (
    INGESTION_WARNINGS_DATA_TABLE_SQL,
    INGESTION_WARNINGS_MV_TABLE_SQL,
    KAFKA_INGESTION_WARNINGS_TABLE_SQL,
    DISTRIBUTED_INGESTION_WARNINGS_TABLE_SQL,
)
from posthog.models.performance.sql import (
    DISTRIBUTED_PERFORMANCE_EVENTS_TABLE_SQL,
    KAFKA_PERFORMANCE_EVENTS_TABLE_SQL,
    PERFORMANCE_EVENTS_TABLE_MV_SQL,
    PERFORMANCE_EVENTS_TABLE_SQL,
    WRITABLE_PERFORMANCE_EVENTS_TABLE_SQL,
)
from posthog.models.person.sql import (
    PERSON_STATIC_COHORT_TABLE_SQL,
    PERSONS_TABLE_SQL,
    PERSONS_TABLE_MV_SQL,
    KAFKA_PERSONS_TABLE_SQL,
    PERSONS_DISTINCT_ID_TABLE_SQL,
    PERSONS_DISTINCT_ID_TABLE_MV_SQL,
    KAFKA_PERSONS_DISTINCT_ID_TABLE_SQL,
    PERSON_DISTINCT_ID2_TABLE_SQL,
    PERSON_DISTINCT_ID2_MV_SQL,
    KAFKA_PERSON_DISTINCT_ID2_TABLE_SQL,
    PERSON_DISTINCT_ID_OVERRIDES_TABLE_SQL,
    PERSON_DISTINCT_ID_OVERRIDES_MV_SQL,
    KAFKA_PERSON_DISTINCT_ID_OVERRIDES_TABLE_SQL,
)
from posthog.models.error_tracking.sql import (
    ERROR_TRACKING_ISSUE_FINGERPRINT_OVERRIDES_TABLE_SQL,
    ERROR_TRACKING_ISSUE_FINGERPRINT_OVERRIDES_MV_SQL,
    KAFKA_ERROR_TRACKING_ISSUE_FINGERPRINT_OVERRIDES_TABLE_SQL,
)
from posthog.models.person_overrides.sql import (
    PERSON_OVERRIDES_CREATE_TABLE_SQL,
    PERSON_OVERRIDES_CREATE_DICTIONARY_SQL,
    PERSON_OVERRIDES_CREATE_MATERIALIZED_VIEW_SQL,
    KAFKA_PERSON_OVERRIDES_TABLE_SQL,
)
from posthog.models.raw_sessions.sql import (
    RAW_SESSIONS_TABLE_SQL,
    DISTRIBUTED_RAW_SESSIONS_TABLE_SQL,
    WRITABLE_RAW_SESSIONS_TABLE_SQL,
    RAW_SESSIONS_TABLE_MV_SQL,
    RAW_SESSIONS_CREATE_OR_REPLACE_VIEW_SQL,
)
from posthog.models.sessions.sql import (
    SESSIONS_TABLE_SQL,
    SESSIONS_TABLE_MV_SQL,
    WRITABLE_SESSIONS_TABLE_SQL,
    DISTRIBUTED_SESSIONS_TABLE_SQL,
    SESSIONS_VIEW_SQL,
)
from posthog.session_recordings.sql.session_recording_event_sql import (
    SESSION_RECORDING_EVENTS_TABLE_SQL,
    SESSION_RECORDING_EVENTS_TABLE_MV_SQL,
    KAFKA_SESSION_RECORDING_EVENTS_TABLE_SQL,
    WRITABLE_SESSION_RECORDING_EVENTS_TABLE_SQL,
    DISTRIBUTED_SESSION_RECORDING_EVENTS_TABLE_SQL,
)
from posthog.session_recordings.sql.session_replay_event_sql import (
    SESSION_REPLAY_EVENTS_TABLE_SQL,
    SESSION_REPLAY_EVENTS_TABLE_MV_SQL,
    KAFKA_SESSION_REPLAY_EVENTS_TABLE_SQL,
    DISTRIBUTED_SESSION_REPLAY_EVENTS_TABLE_SQL,
)
from posthog.session_recordings.sql.session_replay_event_v2_test_sql import (
    SESSION_REPLAY_EVENTS_V2_TEST_DATA_TABLE_SQL,
    SESSION_REPLAY_EVENTS_V2_TEST_MV_SQL,
    SESSION_REPLAY_EVENTS_V2_TEST_KAFKA_TABLE_SQL,
    SESSION_REPLAY_EVENTS_V2_TEST_DISTRIBUTED_TABLE_SQL,
)

CREATE_MERGETREE_TABLE_QUERIES = (
    LOG_ENTRIES_TABLE_SQL,
    CREATE_COHORTPEOPLE_TABLE_SQL,
    PERSON_STATIC_COHORT_TABLE_SQL,
    DEAD_LETTER_QUEUE_TABLE_SQL,
    EVENTS_TABLE_SQL,
    EVENTS_RECENT_TABLE_SQL,
    GROUPS_TABLE_SQL,
    PERSONS_TABLE_SQL,
    PERSON_OVERRIDES_CREATE_TABLE_SQL,
    PERSONS_DISTINCT_ID_TABLE_SQL,
    PERSON_DISTINCT_ID2_TABLE_SQL,
    PERSON_DISTINCT_ID_OVERRIDES_TABLE_SQL,
    ERROR_TRACKING_ISSUE_FINGERPRINT_OVERRIDES_TABLE_SQL,
    PLUGIN_LOG_ENTRIES_TABLE_SQL,
    SESSION_RECORDING_EVENTS_TABLE_SQL,
    INGESTION_WARNINGS_DATA_TABLE_SQL,
    APP_METRICS_DATA_TABLE_SQL,
    APP_METRICS2_DATA_TABLE_SQL,
    PERFORMANCE_EVENTS_TABLE_SQL,
    SESSION_REPLAY_EVENTS_TABLE_SQL,
    SESSION_REPLAY_EVENTS_V2_TEST_DATA_TABLE_SQL,
    CHANNEL_DEFINITION_TABLE_SQL,
    SESSIONS_TABLE_SQL,
    RAW_SESSIONS_TABLE_SQL,
    HEATMAPS_TABLE_SQL,
)
CREATE_DISTRIBUTED_TABLE_QUERIES = (
    WRITABLE_EVENTS_TABLE_SQL,
    DISTRIBUTED_EVENTS_TABLE_SQL,
    DISTRIBUTED_EVENTS_RECENT_TABLE_SQL,
    WRITABLE_SESSION_RECORDING_EVENTS_TABLE_SQL,
    DISTRIBUTED_SESSION_RECORDING_EVENTS_TABLE_SQL,
    DISTRIBUTED_INGESTION_WARNINGS_TABLE_SQL,
    DISTRIBUTED_APP_METRICS_TABLE_SQL,
    DISTRIBUTED_APP_METRICS2_TABLE_SQL,
    WRITABLE_PERFORMANCE_EVENTS_TABLE_SQL,
    DISTRIBUTED_PERFORMANCE_EVENTS_TABLE_SQL,
    DISTRIBUTED_SESSION_REPLAY_EVENTS_TABLE_SQL,
    SESSION_REPLAY_EVENTS_V2_TEST_DISTRIBUTED_TABLE_SQL,
    WRITABLE_SESSIONS_TABLE_SQL,
    WRITABLE_RAW_SESSIONS_TABLE_SQL,
    DISTRIBUTED_SESSIONS_TABLE_SQL,
    DISTRIBUTED_RAW_SESSIONS_TABLE_SQL,
    WRITABLE_HEATMAPS_TABLE_SQL,
    DISTRIBUTED_HEATMAPS_TABLE_SQL,
)
CREATE_KAFKA_TABLE_QUERIES = (
    KAFKA_LOG_ENTRIES_TABLE_SQL,
    KAFKA_DEAD_LETTER_QUEUE_TABLE_SQL,
    KAFKA_EVENTS_TABLE_JSON_SQL,
    KAFKA_EVENTS_RECENT_TABLE_JSON_SQL,
    KAFKA_GROUPS_TABLE_SQL,
    KAFKA_PERSONS_TABLE_SQL,
    KAFKA_PERSON_OVERRIDES_TABLE_SQL,
    KAFKA_PERSONS_DISTINCT_ID_TABLE_SQL,
    KAFKA_PERSON_DISTINCT_ID2_TABLE_SQL,
    KAFKA_PERSON_DISTINCT_ID_OVERRIDES_TABLE_SQL,
    KAFKA_ERROR_TRACKING_ISSUE_FINGERPRINT_OVERRIDES_TABLE_SQL,
    KAFKA_PLUGIN_LOG_ENTRIES_TABLE_SQL,
    KAFKA_SESSION_RECORDING_EVENTS_TABLE_SQL,
    KAFKA_INGESTION_WARNINGS_TABLE_SQL,
    KAFKA_APP_METRICS_TABLE_SQL,
    KAFKA_APP_METRICS2_TABLE_SQL,
    KAFKA_PERFORMANCE_EVENTS_TABLE_SQL,
    KAFKA_SESSION_REPLAY_EVENTS_TABLE_SQL,
    SESSION_REPLAY_EVENTS_V2_TEST_KAFKA_TABLE_SQL,
    KAFKA_HEATMAPS_TABLE_SQL,
)
CREATE_MV_TABLE_QUERIES = (
    LOG_ENTRIES_TABLE_MV_SQL,
    DEAD_LETTER_QUEUE_TABLE_MV_SQL,
    EVENTS_TABLE_JSON_MV_SQL,
    EVENTS_RECENT_TABLE_JSON_MV_SQL,
    GROUPS_TABLE_MV_SQL,
    PERSONS_TABLE_MV_SQL,
    PERSON_OVERRIDES_CREATE_MATERIALIZED_VIEW_SQL,
    PERSONS_DISTINCT_ID_TABLE_MV_SQL,
    PERSON_DISTINCT_ID2_MV_SQL,
    PERSON_DISTINCT_ID_OVERRIDES_MV_SQL,
    ERROR_TRACKING_ISSUE_FINGERPRINT_OVERRIDES_MV_SQL,
    PLUGIN_LOG_ENTRIES_TABLE_MV_SQL,
    SESSION_RECORDING_EVENTS_TABLE_MV_SQL,
    INGESTION_WARNINGS_MV_TABLE_SQL,
    APP_METRICS_MV_TABLE_SQL,
    APP_METRICS2_MV_TABLE_SQL,
    PERFORMANCE_EVENTS_TABLE_MV_SQL,
    SESSION_REPLAY_EVENTS_TABLE_MV_SQL,
    SESSION_REPLAY_EVENTS_V2_TEST_MV_SQL,
    SESSIONS_TABLE_MV_SQL,
    RAW_SESSIONS_TABLE_MV_SQL,
    HEATMAPS_TABLE_MV_SQL,
)

CREATE_TABLE_QUERIES = (
    CREATE_MERGETREE_TABLE_QUERIES
    + CREATE_DISTRIBUTED_TABLE_QUERIES
    + CREATE_KAFKA_TABLE_QUERIES
    + CREATE_MV_TABLE_QUERIES
)

CREATE_DICTIONARY_QUERIES = (PERSON_OVERRIDES_CREATE_DICTIONARY_SQL, CHANNEL_DEFINITION_DICTIONARY_SQL)

CREATE_DATA_QUERIES = (CHANNEL_DEFINITION_DATA_SQL(),)

CREATE_VIEW_QUERIES = (SESSIONS_VIEW_SQL, RAW_SESSIONS_CREATE_OR_REPLACE_VIEW_SQL)

build_query = lambda query: query if isinstance(query, str) else query()
get_table_name = lambda query: re.findall(r"[\.\s]`?([a-z0-9_]+)`?\s+ON CLUSTER", build_query(query))[0]
