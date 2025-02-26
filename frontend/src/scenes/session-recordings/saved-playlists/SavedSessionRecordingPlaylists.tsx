import { IconCalendar, IconPin, IconPinFilled } from '@posthog/icons'
import { LemonBadge, LemonButton, LemonDivider, LemonInput, LemonTable, Link, Tooltip } from '@posthog/lemon-ui'
import clsx from 'clsx'
import { useActions, useValues } from 'kea'
import { DateFilter } from 'lib/components/DateFilter/DateFilter'
import { MemberSelect } from 'lib/components/MemberSelect'
import { TZLabel } from 'lib/components/TZLabel'
import { useFeatureFlag } from 'lib/hooks/useFeatureFlag'
import { More } from 'lib/lemon-ui/LemonButton/More'
import { LemonTableColumn, LemonTableColumns } from 'lib/lemon-ui/LemonTable'
import { createdByColumn } from 'lib/lemon-ui/LemonTable/columnUtils'
import { isObject } from 'lib/utils'
import { SavedSessionRecordingPlaylistsEmptyState } from 'scenes/session-recordings/saved-playlists/SavedSessionRecordingPlaylistsEmptyState'
import { urls } from 'scenes/urls'

import { PlaylistRecordingsCounts, ReplayTabs, SessionRecordingPlaylistType } from '~/types'

import { PLAYLISTS_PER_PAGE, savedSessionRecordingPlaylistsLogic } from './savedSessionRecordingPlaylistsLogic'

export type SavedSessionRecordingPlaylistsProps = {
    tab: ReplayTabs.Playlists
}

function nameColumn(): LemonTableColumn<SessionRecordingPlaylistType, 'name'> {
    return {
        title: 'Name',
        dataIndex: 'name',
        render: function Render(name, { short_id, derived_name, description }) {
            return (
                <>
                    <Link className={clsx('font-semibold', !name && 'italic')} to={urls.replayPlaylist(short_id)}>
                        {name || derived_name || 'Unnamed'}
                    </Link>
                    {description ? <div className="truncate">{description}</div> : null}
                </>
            )
        },
    }
}

function isPlaylistRecordingsCounts(x: unknown): x is PlaylistRecordingsCounts {
    return isObject(x) && ('query_count' in x || 'pinned_count' in x)
}

export function SavedSessionRecordingPlaylists({ tab }: SavedSessionRecordingPlaylistsProps): JSX.Element {
    const logic = savedSessionRecordingPlaylistsLogic({ tab })
    const { playlists, playlistsLoading, filters, sorting, pagination } = useValues(logic)
    const { setSavedPlaylistsFilters, updatePlaylist, duplicatePlaylist, deletePlaylist } = useActions(logic)

    const showCountColumn = useFeatureFlag('SESSION_RECORDINGS_PLAYLIST_COUNT_COLUMN')

    const columns: LemonTableColumns<SessionRecordingPlaylistType> = [
        {
            width: 0,
            dataIndex: 'pinned',
            render: function Render(pinned, { short_id }) {
                return (
                    <LemonButton
                        size="small"
                        onClick={() => updatePlaylist(short_id, { pinned: !pinned })}
                        icon={pinned ? <IconPinFilled /> : <IconPin />}
                    />
                )
            },
        },
        {
            dataIndex: 'recordings_counts',
            title: 'Count',
            tooltip: 'Count of recordings in the playlist',
            isHidden: !showCountColumn,
            width: 0,
            render: function Render(recordings_counts) {
                if (!isPlaylistRecordingsCounts(recordings_counts)) {
                    return null
                }

                const count = (recordings_counts.pinned_count || 0) + (recordings_counts.query_count || 0)

                const tooltip = (
                    <div className="flex flex-col space-y-1 items-center">
                        <span>Playlist counts are recalculated once a day.</span>
                        {recordings_counts.pinned_count ? (
                            <span>Collection has {recordings_counts.pinned_count} pinned recordings</span>
                        ) : null}
                        {recordings_counts.query_count ? (
                            <span>
                                Saved filters match {recordings_counts.query_count}
                                {recordings_counts.has_more && '+'} recordings
                            </span>
                        ) : null}
                    </div>
                )

                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <Tooltip title={tooltip}>
                            <span>
                                {count ? (
                                    <LemonBadge.Number
                                        status={count ? 'primary' : 'muted'}
                                        className="text-xs cursor-pointer"
                                        count={count}
                                        maxDigits={3}
                                        forcePlus={recordings_counts.has_more}
                                    />
                                ) : (
                                    <LemonBadge status="muted" content="?" className="cursor-pointer" />
                                )}
                            </span>
                        </Tooltip>
                    </div>
                )
            },
        },
        nameColumn() as LemonTableColumn<SessionRecordingPlaylistType, keyof SessionRecordingPlaylistType | undefined>,
        {
            ...(createdByColumn<SessionRecordingPlaylistType>() as LemonTableColumn<
                SessionRecordingPlaylistType,
                keyof SessionRecordingPlaylistType | undefined
            >),
            width: 0,
        },
        {
            title: 'Last modified',
            sorter: true,
            dataIndex: 'last_modified_at',
            width: 0,
            render: function Render(last_modified_at) {
                return (
                    <div>
                        {last_modified_at && typeof last_modified_at === 'string' && (
                            <TZLabel time={last_modified_at} />
                        )}
                    </div>
                )
            },
        },

        {
            width: 0,
            render: function Render(_, playlist) {
                return (
                    <More
                        overlay={
                            <>
                                <LemonButton
                                    onClick={() => duplicatePlaylist(playlist)}
                                    fullWidth
                                    data-attr="duplicate-playlist"
                                    loading={playlistsLoading}
                                >
                                    Duplicate
                                </LemonButton>
                                <LemonDivider />

                                <LemonButton
                                    status="danger"
                                    onClick={() => deletePlaylist(playlist)}
                                    fullWidth
                                    loading={playlistsLoading}
                                >
                                    Delete playlist
                                </LemonButton>
                            </>
                        }
                    />
                )
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between gap-2 mb-2 items-center flex-wrap">
                <LemonInput
                    type="search"
                    placeholder="Search for playlists"
                    onChange={(value) => setSavedPlaylistsFilters({ search: value || undefined })}
                    value={filters.search || ''}
                />
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <LemonButton
                            data-attr="session-recording-playlist-pinned-filter"
                            active={filters.pinned}
                            size="small"
                            type="secondary"
                            status="alt"
                            center
                            onClick={() => setSavedPlaylistsFilters({ pinned: !filters.pinned })}
                            icon={filters.pinned ? <IconPinFilled /> : <IconPin />}
                        >
                            Pinned
                        </LemonButton>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Last modified:</span>
                        <DateFilter
                            disabled={false}
                            dateFrom={filters.dateFrom}
                            dateTo={filters.dateTo}
                            onChange={(fromDate, toDate) =>
                                setSavedPlaylistsFilters({ dateFrom: fromDate, dateTo: toDate ?? undefined })
                            }
                            makeLabel={(key) => (
                                <>
                                    <IconCalendar />
                                    <span className="hide-when-small"> {key}</span>
                                </>
                            )}
                            max={21}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Created by:</span>
                        <MemberSelect
                            value={filters.createdBy === 'All users' ? null : filters.createdBy}
                            onChange={(user) => setSavedPlaylistsFilters({ createdBy: user?.id || 'All users' })}
                        />
                    </div>
                </div>
            </div>

            {!playlistsLoading && playlists.count < 1 ? (
                <SavedSessionRecordingPlaylistsEmptyState />
            ) : (
                <LemonTable
                    loading={playlistsLoading}
                    columns={columns}
                    dataSource={playlists.results}
                    pagination={pagination}
                    noSortingCancellation
                    sorting={sorting}
                    onSort={(newSorting) =>
                        setSavedPlaylistsFilters({
                            order: newSorting
                                ? `${newSorting.order === -1 ? '-' : ''}${newSorting.columnKey}`
                                : undefined,
                        })
                    }
                    rowKey="id"
                    loadingSkeletonRows={PLAYLISTS_PER_PAGE}
                    nouns={['playlist', 'playlists']}
                />
            )}
        </div>
    )
}
