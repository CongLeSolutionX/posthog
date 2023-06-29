import { Card, Col, Row } from 'antd'
import { LegacyInsightDisplayConfig } from 'scenes/insights/LegacyInsightDisplayConfig'
import { ComputationTimeWithRefresh } from 'scenes/insights/ComputationTimeWithRefresh'
import { ChartDisplayType, ExporterFormat, InsightType, ItemMode } from '~/types'
import { TrendInsight } from 'scenes/trends/Trends'
import { BindLogic, useValues } from 'kea'
import { trendsLogic } from 'scenes/trends/trendsLogic'
import { InsightsTable } from 'scenes/insights/views/InsightsTable/InsightsTable'
import { insightLogic } from 'scenes/insights/insightLogic'
import { InsightErrorState, InsightTimeoutState } from 'scenes/insights/EmptyStates'
import { InsightLegend } from 'lib/components/InsightLegend/InsightLegend'
import { InsightLegendButton } from 'lib/components/InsightLegend/InsightLegendButton'
import { Tooltip } from 'lib/lemon-ui/Tooltip'
import { Animation } from 'lib/components/Animation/Animation'
import { AnimationType } from 'lib/animations/animations'
import { ExportButton } from 'lib/components/ExportButton/ExportButton'
import { LemonBanner } from 'lib/lemon-ui/LemonBanner'
import { isFilterWithDisplay, isTrendsFilter } from 'scenes/insights/sharedUtils'
import { insightNavLogic } from 'scenes/insights/InsightNav/insightNavLogic'

export function LegacyInsightContainer({
    disableHeader,
    disableTable,
    disableLastComputation,
    insightMode,
}: {
    disableHeader?: boolean
    disableTable?: boolean
    disableLastComputation?: boolean
    insightMode?: ItemMode
}): JSX.Element {
    const {
        insightProps,
        canEditInsight,
        insightLoading,
        filters,
        timedOutQueryId,
        erroredQueryId,
        exporterResourceParams,
        isUsingSessionAnalysis,
    } = useValues(insightLogic)

    const { activeView } = useValues(insightNavLogic(insightProps))

    // Empty states that completely replace the graph
    const BlockingEmptyState = (() => {
        if (insightLoading && timedOutQueryId === null) {
            return (
                <div className="text-center">
                    <Animation type={AnimationType.LaptopHog} />
                </div>
            )
        }

        // Insight agnostic empty states
        if (!!erroredQueryId) {
            return <InsightErrorState queryId={erroredQueryId} />
        }
        if (!!timedOutQueryId) {
            return (
                <InsightTimeoutState isLoading={insightLoading} queryId={timedOutQueryId} insightProps={insightProps} />
            )
        }

        return null
    })()

    function renderTable(): JSX.Element | null {
        // InsightsTable is loaded for all trend views (except below), plus the sessions view.
        // Exclusions:
        // 1. Table view. Because table is already loaded anyway in `Trends.tsx` as the main component.
        // 2. Bar value chart. Because this view displays data in completely different dimensions.
        if (
            isTrendsFilter(filters) &&
            (!filters.display ||
                (filters?.display !== ChartDisplayType.ActionsTable &&
                    filters?.display !== ChartDisplayType.ActionsBarValue)) &&
            !disableTable
        ) {
            return (
                <>
                    {exporterResourceParams && (
                        <div className="flex items-center justify-between my-4 mx-0">
                            <h2 className="m-0">Detailed results</h2>
                            <Tooltip title="Export this table in CSV format" placement="left">
                                <ExportButton
                                    type="secondary"
                                    status="primary"
                                    items={[
                                        {
                                            export_format: ExporterFormat.CSV,
                                            export_context: exporterResourceParams,
                                        },
                                    ]}
                                />
                            </Tooltip>
                        </div>
                    )}
                    <BindLogic logic={trendsLogic} props={insightProps}>
                        <InsightsTable
                            isLegend
                            filterKey={isTrendsFilter(filters) ? `trends_${activeView}` : ''}
                            canEditSeriesNameInline={
                                isTrendsFilter(filters) && !filters.formula && insightMode === ItemMode.Edit
                            }
                            canCheckUncheckSeries={canEditInsight}
                        />
                    </BindLogic>
                </>
            )
        }

        return null
    }

    if (!isTrendsFilter(filters)) {
        // This legacy component is being removed, don't use it
        throw new Error('Unsupported insight type')
    }

    return (
        <>
            {isUsingSessionAnalysis ? (
                <div className="mb-4">
                    <LemonBanner type="info">
                        When using sessions and session properties, events without session IDs will be excluded from the
                        set of results.{' '}
                        <a href="https://posthog.com/docs/user-guides/sessions">Learn more about sessions.</a>
                    </LemonBanner>
                </div>
            ) : null}
            {/* These are filters that are reused between insight features. They each have generic logic that updates the url */}
            <Card
                title={
                    disableHeader ? null : (
                        <LegacyInsightDisplayConfig
                            activeView={activeView as InsightType}
                            insightMode={insightMode || ItemMode.View}
                            filters={filters}
                            disableTable={!!disableTable}
                        />
                    )
                }
                data-attr="insights-graph"
                className="insights-graph-container"
            >
                <div>
                    {!disableLastComputation || !!filters.sampling_factor ? (
                        <Row
                            className="insights-graph-header computation-time-and-sampling-notice"
                            align="middle"
                            justify="space-between"
                        >
                            {/*Don't add more than two columns in this row.*/}
                            <Col className="flex items-center gap-1">
                                {!disableLastComputation && <ComputationTimeWithRefresh />}
                                {!!filters.sampling_factor ? (
                                    <span className="text-muted-alt">
                                        {!disableLastComputation ? '• ' : ' '}
                                        Results calculated from {filters.sampling_factor * 100}% of users
                                    </span>
                                ) : null}
                            </Col>

                            <Col>
                                <InsightLegendButton />
                            </Col>
                        </Row>
                    ) : null}

                    {!!BlockingEmptyState ? (
                        BlockingEmptyState
                    ) : isFilterWithDisplay(filters) && filters.show_legend ? (
                        <Row className="insights-graph-container-row" wrap={false}>
                            <Col className="insights-graph-container-row-left">
                                <TrendInsight view={InsightType.TRENDS} />
                            </Col>
                            <Col className="insights-graph-container-row-right">
                                <InsightLegend />
                            </Col>
                        </Row>
                    ) : (
                        <TrendInsight view={InsightType.TRENDS} />
                    )}
                </div>
            </Card>
            {renderTable()}
        </>
    )
}
