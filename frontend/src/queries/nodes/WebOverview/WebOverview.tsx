import { IconGear, IconTrending } from '@posthog/icons'
import { LemonButton, LemonSkeleton } from '@posthog/lemon-ui'
import { useValues } from 'kea'
import { getColorVar } from 'lib/colors'
import { useFeatureFlag } from 'lib/hooks/useFeatureFlag'
import { IconTrendingDown, IconTrendingFlat } from 'lib/lemon-ui/icons'
import { LemonBanner } from 'lib/lemon-ui/LemonBanner'
import { Tooltip } from 'lib/lemon-ui/Tooltip'
import { humanFriendlyDuration, humanFriendlyLargeNumber, isNotNil, range } from 'lib/utils'
import { useState } from 'react'
import { revenueEventsSettingsLogic } from 'scenes/data-management/revenue/revenueEventsSettingsLogic'
import { urls } from 'scenes/urls'

import { EvenlyDistributedRows } from '~/queries/nodes/WebOverview/EvenlyDistributedRows'
import {
    AnyResponseType,
    WebOverviewItem,
    WebOverviewItemKind,
    WebOverviewQuery,
    WebOverviewQueryResponse,
} from '~/queries/schema/schema-general'
import { QueryContext } from '~/queries/types'

import { dataNodeLogic } from '../DataNode/dataNodeLogic'

const OVERVIEW_ITEM_CELL_MIN_WIDTH_REMS = 10

// Keep min-w-[10rem] in sync with OVERVIEW_ITEM_CELL_MIN_WIDTH_REMS
const OVERVIEW_ITEM_CELL_CLASSES = `flex-1 border p-2 bg-surface-primary rounded min-w-[10rem] h-30 flex flex-col items-center text-center justify-between`

let uniqueNode = 0
export function WebOverview(props: {
    query: WebOverviewQuery
    cachedResults?: AnyResponseType
    context: QueryContext
}): JSX.Element | null {
    const { onData, loadPriority, dataNodeCollectionId } = props.context.insightProps ?? {}
    const [key] = useState(() => `WebOverview.${uniqueNode++}`)
    const logic = dataNodeLogic({
        query: props.query,
        key,
        cachedResults: props.cachedResults,
        loadPriority,
        onData,
        dataNodeCollectionId: dataNodeCollectionId ?? key,
    })
    const { response, responseLoading } = useValues(logic)

    const webOverviewQueryResponse = response as WebOverviewQueryResponse | undefined

    const samplingRate = webOverviewQueryResponse?.samplingRate

    let numSkeletons = props.query.conversionGoal ? 4 : 5
    if (useFeatureFlag('WEB_REVENUE_TRACKING')) {
        numSkeletons += 1
    }

    return (
        <>
            <EvenlyDistributedRows
                className="flex justify-center items-center flex-wrap w-full gap-2"
                minWidthRems={OVERVIEW_ITEM_CELL_MIN_WIDTH_REMS + 2}
            >
                {responseLoading
                    ? range(numSkeletons).map((i) => <WebOverviewItemCellSkeleton key={i} />)
                    : webOverviewQueryResponse?.results?.map((item) => (
                          <WebOverviewItemCell key={item.key} item={item} />
                      )) || []}
            </EvenlyDistributedRows>
            {samplingRate && !(samplingRate.numerator === 1 && (samplingRate.denominator ?? 1) === 1) ? (
                <LemonBanner type="info" className="my-4">
                    These results are using a sampling factor of {samplingRate.numerator}
                    {samplingRate.denominator ?? 1 !== 1 ? `/${samplingRate.denominator}` : ''}. Sampling is currently
                    in beta.
                </LemonBanner>
            ) : null}
        </>
    )
}

const WebOverviewItemCellSkeleton = (): JSX.Element => {
    return (
        <div className={OVERVIEW_ITEM_CELL_CLASSES}>
            <LemonSkeleton className="h-2 w-10" />
            <LemonSkeleton className="h-6 w-20" />
            <LemonSkeleton className="h-2 w-10" />
        </div>
    )
}

const WebOverviewItemCell = ({ item }: { item: WebOverviewItem }): JSX.Element => {
    const { baseCurrency } = useValues(revenueEventsSettingsLogic)

    const label = labelFromKey(item.key)
    const trend = isNotNil(item.changeFromPreviousPct)
        ? item.changeFromPreviousPct === 0
            ? { Icon: IconTrendingFlat, color: getColorVar('muted') }
            : item.changeFromPreviousPct > 0
            ? {
                  Icon: IconTrending,
                  color: !item.isIncreaseBad ? getColorVar('success') : getColorVar('danger'),
              }
            : {
                  Icon: IconTrendingDown,
                  color: !item.isIncreaseBad ? getColorVar('danger') : getColorVar('success'),
              }
        : undefined

    const docsUrl = settingsLinkFromKey(item.key)

    // If current === previous, say "increased by 0%"
    const tooltip =
        isNotNil(item.value) && isNotNil(item.previous) && isNotNil(item.changeFromPreviousPct)
            ? `${label}: ${item.value >= item.previous ? 'increased' : 'decreased'} by ${formatPercentage(
                  Math.abs(item.changeFromPreviousPct),
                  { precise: true }
              )}, to ${formatItem(item.value, item.kind, { precise: true, currency: baseCurrency })} from ${formatItem(
                  item.previous,
                  item.kind,
                  { precise: true, currency: baseCurrency }
              )}`
            : isNotNil(item.value)
            ? `${label}: ${formatItem(item.value, item.kind, { precise: true, currency: baseCurrency })}`
            : 'No data'

    return (
        <Tooltip title={tooltip}>
            <div className={OVERVIEW_ITEM_CELL_CLASSES}>
                <div className="flex flex-row w-full">
                    <div className="flex-1" />
                    <div className="font-bold uppercase text-xs py-1">{label}</div>
                    <div className="flex flex-1 flex-row justify-end items-start">
                        {docsUrl && <LemonButton to={docsUrl} icon={<IconGear />} size="xsmall" />}
                    </div>
                </div>
                <div className="w-full flex-1 flex items-center justify-center">
                    <div className="text-2xl">{formatItem(item.value, item.kind, { currency: baseCurrency })}</div>
                </div>
                {trend && isNotNil(item.changeFromPreviousPct) ? (
                    // eslint-disable-next-line react/forbid-dom-props
                    <div style={{ color: trend.color }}>
                        <trend.Icon color={trend.color} /> {formatPercentage(item.changeFromPreviousPct)}
                    </div>
                ) : (
                    <div />
                )}
            </div>
        </Tooltip>
    )
}

const formatPercentage = (x: number, options?: { precise?: boolean }): string => {
    if (options?.precise) {
        return (x / 100).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 1 })
    } else if (x >= 1000) {
        return humanFriendlyLargeNumber(x) + '%'
    }
    return (x / 100).toLocaleString(undefined, { style: 'percent', maximumSignificantDigits: 2 })
}

const formatUnit = (x: number, options?: { precise?: boolean }): string => {
    if (options?.precise) {
        return x.toLocaleString()
    }
    return humanFriendlyLargeNumber(x)
}

const getCurrencySymbol = (currency: string): { symbol: string; isPrefix: boolean } => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    })
    const parts = formatter.formatToParts(0)
    const symbol = parts.find((part) => part.type === 'currency')?.value

    const isPrefix = symbol ? parts[0].type === 'currency' : true

    return { symbol: symbol ?? currency, isPrefix }
}

const formatItem = (
    value: number | undefined,
    kind: WebOverviewItemKind,
    options?: { precise?: boolean; currency?: string }
): string => {
    if (value == null) {
        return '-'
    } else if (kind === 'percentage') {
        return formatPercentage(value, { precise: options?.precise })
    } else if (kind === 'duration_s') {
        return humanFriendlyDuration(value, { secondsPrecision: 3 })
    } else if (kind === 'currency') {
        const { symbol, isPrefix } = getCurrencySymbol(options?.currency ?? 'USD')
        return `${isPrefix ? symbol : ''}${formatUnit(value, { precise: options?.precise })}${
            isPrefix ? '' : ' ' + symbol
        }`
    }
    return formatUnit(value, options)
}

const labelFromKey = (key: string): string => {
    switch (key) {
        case 'visitors':
            return 'Visitors'
        case 'views':
            return 'Page views'
        case 'sessions':
            return 'Sessions'
        case 'session duration':
            return 'Session duration'
        case 'bounce rate':
            return 'Bounce rate'
        case 'lcp score':
            return 'LCP Score'
        case 'conversion rate':
            return 'Conversion rate'
        case 'total conversions':
            return 'Total conversions'
        case 'unique conversions':
            return 'Unique conversions'
        default:
            return key
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
    }
}

const settingsLinkFromKey = (key: string): string | null => {
    switch (key) {
        case 'revenue':
        case 'conversion revenue':
            return urls.revenue()
        default:
            return null
    }
}
