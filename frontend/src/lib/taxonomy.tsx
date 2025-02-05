import { CoreFilterDefinition, PropertyFilterValue } from '~/types'

import { TaxonomicFilterGroupType } from './components/TaxonomicFilter/types'
import { Link } from './lemon-ui/Link'

/** Same as https://github.com/PostHog/posthog-js/blob/master/src/utils/event-utils.ts */
// Ideally this would be imported from posthog-js, we just need to start exporting the list there
export const CAMPAIGN_PROPERTIES: string[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid', // google ads
    'gad_source', // google ads
    'gclsrc', // google ads 360
    'dclid', // google display ads
    'gbraid', // google ads, web to app
    'wbraid', // google ads, app to web
    'fbclid', // facebook
    'msclkid', // microsoft
    'twclid', // twitter
    'li_fat_id', // linkedin
    'mc_cid', // mailchimp campaign id
    'igshid', // instagram
    'ttclid', // tiktok
    'rdt_cid', // reddit
    'irclid', // impact
    '_kx', // klaviyo
]

// copy from https://github.com/PostHog/posthog/blob/29ac8d6b2ba5de4b65a148136b681b8e52e20429/plugin-server/src/utils/db/utils.ts#L44
const PERSON_PROPERTIES_ADAPTED_FROM_EVENT = new Set([
    // mobile params
    '$app_build',
    '$app_name',
    '$app_namespace',
    '$app_version',
    // web params
    '$browser',
    '$browser_version',
    '$device_type',
    '$current_url',
    '$pathname',
    '$os',
    '$os_version',
    '$referring_domain',
    '$referrer',
    ...CAMPAIGN_PROPERTIES,
])

export const SESSION_INITIAL_PROPERTIES_ADAPTED_FROM_EVENTS = new Set([
    '$referring_domain',
    'utm_source',
    'utm_campaign',
    'utm_medium',
    'utm_content',
    'utm_term',
    'gclid',
    'gad_source',
    'gclsrc',
    'dclid',
    'gbraid',
    'wbraid',
    'fbclid',
    'msclkid',
    'twclid',
    'li_fat_id',
    'mc_cid',
    'igshid',
    'ttclid',
    'rdt_cid',
    'irclid',
    '_kx',
])

// changing values in here you need to sync to python posthog/posthog/taxonomy/taxonomy.py
export const CORE_FILTER_DEFINITIONS_BY_GROUP = {
    events: {
        '': {
            label: 'All events',
            description: 'This is a wildcard that matches all events.',
        },
        $pageview: {
            label: 'Pageview',
            description: 'When a user loads (or reloads) a page.',
        },
        $pageleave: {
            label: 'Pageleave',
            description: 'When a user leaves a page.',
        },
        $autocapture: {
            label: 'Autocapture',
            description: 'User interactions that were automatically captured.',
            examples: ['clicked button'],
        },
        $$heatmap: {
            label: 'Heatmap',
            description: 'Heatmap events carry heatmap data to the backend, they do not contribute to event counts.',
        },
        $copy_autocapture: {
            label: 'Clipboard autocapture',
            description: 'Selected text automatically captured when a user copies or cuts.',
        },
        $screen: {
            label: 'Screen',
            description: 'When a user loads a screen in a mobile app.',
        },
        $set: {
            label: 'Set',
            description: 'Setting person properties.',
        },
        $opt_in: {
            label: 'Opt In',
            description: 'When a user opts into analytics.',
        },
        $feature_flag_called: {
            label: 'Feature Flag Called',
            description: (
                <>
                    The feature flag that was called.
                    <br />
                    <br />
                    Warning! This only works in combination with the $feature_flag event. If you want to filter other
                    events, try "Active Feature Flags".
                </>
            ),
            examples: ['beta-feature'],
        },
        $feature_view: {
            label: 'Feature View',
            description: 'When a user views a feature.',
        },
        $feature_interaction: {
            label: 'Feature Interaction',
            description: 'When a user interacts with a feature.',
        },
        $feature_enrollment_update: {
            label: 'Feature Enrollment',
            description: 'When a user enrolls with a feature.',
        },
        $capture_metrics: {
            label: 'Capture Metrics',
            description: 'Metrics captured with values pertaining to your systems at a specific point in time',
        },
        $identify: {
            label: 'Identify',
            description: 'A user has been identified with properties',
        },
        $create_alias: {
            label: 'Alias',
            description: 'An alias ID has been added to a user',
        },
        $merge_dangerously: {
            label: 'Merge',
            description: 'An alias ID has been added to a user',
        },
        $groupidentify: {
            label: 'Group Identify',
            description: 'A group has been identified with properties',
        },
        $rageclick: {
            label: 'Rageclick',
            description: 'A user has rapidly and repeatedly clicked in a single place',
        },
        $dead_click: {
            label: 'Dead click',
            description: 'A user has clicked on something that is probably not clickable',
        },
        $exception: {
            label: 'Exception',
            description: 'Exceptions - an error or unexpected event in your application',
        },
        $web_vitals: {
            label: 'Web Vitals',
            description: 'Automatically captured web vitals data',
        },
        $ai_generation: {
            label: 'AI Generation',
            description: 'A call to a generative AI model (LLM)',
        },
        $ai_trace: {
            label: 'AI Trace',
            description:
                'A generative AI trace. Usually a trace tracks a single user interaction and contains one or more AI generation calls',
        },
        $ai_span: {
            label: 'AI Span',
            description:
                'A generative AI span. Usually a span tracks a unit of work for a trace of generative AI models (LLMs)',
        },
        $ai_metric: {
            label: 'AI Metric',
            description: 'An evaluation metric for a trace of generative AI models (LLMs)',
        },
        $ai_feedback: {
            label: 'AI Feedback',
            description: 'User-provided feedback for a trace of a generative AI model (LLM)',
        },
        // Mobile SDKs events
        'Application Opened': {
            label: 'Application Opened',
            description: 'When a user opens the mobile app either for the first time or from the foreground.',
        },
        'Application Backgrounded': {
            label: 'Application Backgrounded',
            description: 'When a user puts the mobile app in the background.',
        },
        'Application Updated': {
            label: 'Application Updated',
            description: 'When a user upgrades the mobile app.',
        },
        'Application Installed': {
            label: 'Application Installed',
            description: 'When a user installs the mobile app.',
        },
        'Application Became Active': {
            label: 'Application Became Active',
            description: 'When a user puts the mobile app in the foreground.',
        },
        'Deep Link Opened': {
            label: 'Deep Link Opened',
            description: 'When a user opens the mobile app via a deep link.',
        },
    },
    elements: {
        tag_name: {
            label: 'Tag Name',
            description: 'HTML tag name of the element which you want to filter.',
            examples: ['a', 'button', 'input'],
        },
        selector: {
            label: 'CSS Selector',
            description: 'Select any element by CSS selector.',
            examples: ['div > a', 'table td:nth-child(2)', '.my-class'],
        },
        text: {
            label: 'Text',
            description: 'Filter on the inner text of the HTML element.',
        },
        href: {
            label: 'Target (href)',
            description: (
                <span>
                    Filter on the <code>href</code> attribute of the element.
                </span>
            ),
            examples: ['https://posthog.com/about'],
        },
    },
    metadata: {
        distinct_id: {
            label: 'Distinct ID',
            description: 'The current distinct ID of the user.',
            examples: ['16ff262c4301e5-0aa346c03894bc-39667c0e-1aeaa0-16ff262c431767'],
        },
        timestamp: {
            label: 'Timestamp',
            description: 'Time the event happened.',
            examples: ['2023-05-20T15:30:00Z'],
            system: true,
        },
        event: {
            label: 'Event',
            description: 'The name of the event.',
            examples: ['$pageview'],
            system: true,
        },
    },
    event_properties: {
        $last_posthog_reset: {
            label: 'Timestamp of last call to `Reset` in the web sdk',
            description: 'The timestamp of the last call to `Reset` in the web SDK. This can be useful for debugging.',
            system: true,
        },
        distinct_id: {} as CoreFilterDefinition, // Copied from `metadata` down below
        $session_duration: {} as CoreFilterDefinition, // Copied from `sessions` down below
        $session_is_sampled: {
            label: 'Whether the session is sampled',
            description: 'Whether the session is sampled for session recording.',
            examples: ['true', 'false'],
            system: true,
        },
        $geoip_postal_code_confidence: {
            label: 'Postal Code identification confidence score',
            description: 'If provided by the licensed geoip database',
            examples: ['null', '0.1'],
            system: true,
        },
        $geoip_subdivision_2_confidence: {
            label: 'Subdivision 2 identification confidence score',
            description: 'If provided by the licensed geoip database',
            examples: ['null', '0.1'],
            system: true,
        },
        $browser_language_prefix: {
            label: 'Browser Language Prefix',
            description: 'Language prefix.',
            examples: ['en', 'ja'],
        },
        $prev_pageview_id: {
            label: 'Previous pageview ID',
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            examples: ['1'],
            system: true,
        },
        $copy_type: {
            label: 'Copy Type',
            description: 'Type of copy event.',
            examples: ['copy', 'cut'],
        },
        $selected_content: {
            label: 'Copied content',
            description: 'The content that was selected when the user copied or cut.',
        },
        $set: {
            label: 'Set',
            description: 'Person properties to be set',
        },
        $set_once: {
            label: 'Set Once',
            description: 'Person properties to be set if not set already (i.e. first-touch)',
        },
        $pageview_id: {
            label: 'Pageview ID',
            description: "PostHog's internal ID for matching events to a pageview.",
            system: true,
        },
        $autocapture_disabled_server_side: {
            label: 'Autocapture Disabled Server-Side',
            description: 'If autocapture has been disabled server-side.',
            system: true,
        },
        $feature_flag_payloads: {
            label: 'Feature Flag Payloads',
            description: 'Feature flag payloads active in the environment.',
        },
        $capture_failed_request: {
            label: 'Capture Failed Request',
            description: '',
        },
        $lib_rate_limit_remaining_tokens: {
            label: 'Clientside rate limit remaining tokens',
            description:
                'Remaining rate limit tokens for the posthog-js library client-side rate limiting implementation.',
            examples: ['100'],
        },
        token: {
            label: 'Token',
            description: 'Token used for authentication.',
            examples: ['ph_abcdefg'],
        },
        $ce_version: {
            label: '$ce_version',
            description: '',
            system: true,
        },
        $anon_distinct_id: {
            label: 'Anon Distinct ID',
            description: 'If the user was previously anonymous, their anonymous ID will be set here.',
            examples: ['16ff262c4301e5-0aa346c03894bc-39667c0e-1aeaa0-16ff262c431767'],
            system: true,
        },
        $event_type: {
            label: 'Event Type',
            description:
                'When the event is an $autocapture event, this specifies what the action was against the element.',
            examples: ['click', 'submit', 'change'],
        },
        $insert_id: {
            label: 'Insert ID',
            description: 'Unique insert ID for the event.',
            system: true,
        },
        $time: {
            label: '$time (deprecated)',
            description:
                'Use the HogQL field `timestamp` instead. This field was previously set on some client side events.',
            system: true,
            examples: ['1681211521.345'],
        },
        $device_id: {
            label: 'Device ID',
            description: 'Unique ID for that device, consistent even if users are logging in/out.',
            examples: ['16ff262c4301e5-0aa346c03894bc-39667c0e-1aeaa0-16ff262c431767'],
            system: true,
        },
        $browser_type: {
            label: 'Browser Type',
            description: 'This is only added when posthog-js config.opt_out_useragent_filter is true.',
            examples: ['browser', 'bot'],
        },

        // session recording
        $replay_minimum_duration: {
            label: 'Replay config - minimum duration',
            description: 'Config for minimum duration before emitting a session recording.',
            examples: ['1000'],
        },
        $replay_sample_rate: {
            label: 'Replay config - sample rate',
            description: 'Config for sampling rate of session recordings.',
            examples: ['0.1'],
        },
        $console_log_recording_enabled_server_side: {
            label: 'Console Log Recording Enabled Server-Side',
            description: 'If console log recording has been enabled server-side.',
            system: true,
        },
        $session_recording_recorder_version_server_side: {
            label: 'Session Recording Recorder Version Server-Side',
            description: 'The version of the session recording recorder that is enabled server-side.',
            examples: ['v2'],
            system: true,
        },
        $session_recording_start_reason: {
            label: 'Session recording start reason',
            description:
                'Reason for starting the session recording. Useful for e.g. if you have sampling enabled and want to see on batch exported events which sessions have recordings available.',
            examples: ['sampling_override', 'recording_initialized', 'linked_flag_match'],
        },
        $session_recording_canvas_recording: {
            label: 'Session recording canvas recording',
            description: 'Session recording canvas capture config.',
            examples: ['{"enabled": false}'],
        },
        $session_recording_network_payload_capture: {
            label: 'Session recording network payload capture',
            description: 'Session recording network payload capture config.',
            examples: ['{"recordHeaders": false}'],
        },
        $configured_session_timeout_ms: {
            label: 'Configured session timeout',
            description: 'Configured session timeout in milliseconds.',
            examples: ['1800000'],
        },
        $replay_script_config: {
            label: 'Replay script config',
            description: 'Sets an alternative recorder script for the web sdk.',
            examples: ['{"script": "recorder-next""}'],
        },
        $session_recording_url_trigger_activated_session: {
            label: 'Session recording URL trigger activated session',
            description:
                'Session recording URL trigger activated session config. Used by posthog-js to track URL activation of session replay.',
        },
        $session_recording_url_trigger_status: {
            label: 'Session recording URL trigger status',
            description:
                'Session recording URL trigger status. Used by posthog-js to track URL activation of session replay.',
        },
        $recording_status: {
            label: 'Session recording status',
            description: 'The status of session recording at the time the event was captured',
        },
        // exception tracking
        $cymbal_errors: {
            label: 'Exception processing errors',
            description: 'Errors encountered while trying to process exceptions',
            system: true,
        },
        $exception_list: {
            label: 'Exception list',
            description: 'List of one or more associated exceptions',
        },
        // TODO - most of the rest of these are legacy, I think?
        $sentry_exception: {
            label: 'Sentry exception',
            description: 'Raw Sentry exception data',
            system: true,
        },
        $sentry_exception_message: {
            label: 'Sentry exception message',
        },
        $sentry_exception_type: {
            label: 'Sentry exception type',
            description: 'Class name of the exception object',
        },
        $sentry_tags: {
            label: 'Sentry tags',
            description: 'Tags sent to Sentry along with the exception',
        },
        $exception_type: {
            label: 'Exception type',
            description: 'Exception categorized into types. E.g. "Error"',
        },
        $exception_message: {
            label: 'Exception Message',
            description: 'The message detected on the error.',
        },
        $exception_source: {
            label: 'Exception source',
            description: 'The source of the exception. E.g. JS file.',
        },
        $exception_lineno: {
            label: 'Exception source line number',
            description: 'Which line in the exception source that caused the exception.',
        },
        $exception_colno: {
            label: 'Exception source column number',
            description: 'Which column of the line in the exception source that caused the exception.',
        },
        $exception_DOMException_code: {
            label: 'DOMException code',
            description: 'If a DOMException was thrown, it also has a DOMException code.',
        },
        $exception_is_synthetic: {
            label: 'Exception is synthetic',
            description: 'Whether this was detected as a synthetic exception',
        },
        $exception_stack_trace_raw: {
            label: 'Exception raw stack trace',
            description: "The exception's stack trace, as a string.",
        },
        $exception_handled: {
            label: 'Exception was handled',
            description: 'Whether this was a handled or unhandled exception',
        },
        $exception_personURL: {
            label: 'Exception person URL',
            description: 'The PostHog person that experienced the exception',
        },
        $exception_capture_endpoint: {
            label: 'Exception capture endpoint',
            description: 'Endpoint used by posthog-js exception autocapture.',
            examples: ['/e/'],
        },
        $exception_capture_endpoint_suffix: {
            label: 'Exception capture endpoint',
            description: 'Endpoint used by posthog-js exception autocapture.',
            examples: ['/e/'],
        },
        $exception_capture_enabled_server_side: {
            label: 'Exception capture enabled server side',
            description: 'Whether exception autocapture was enabled in remote config.',
        },

        // GeoIP
        $geoip_city_name: {
            label: 'City Name',
            description: `Name of the city matched to this event's IP address.`,
            examples: ['Sydney', 'Chennai', 'Brooklyn'],
        },
        $geoip_country_name: {
            label: 'Country Name',
            description: `Name of the country matched to this event's IP address.`,
            examples: ['Australia', 'India', 'United States'],
        },
        $geoip_country_code: {
            label: 'Country Code',
            description: `Code of the country matched to this event's IP address.`,
            examples: ['AU', 'IN', 'US'],
        },
        $geoip_continent_name: {
            label: 'Continent Name',
            description: `Name of the continent matched to this event's IP address.`,
            examples: ['Oceania', 'Asia', 'North America'],
        },
        $geoip_continent_code: {
            label: 'Continent Code',
            description: `Code of the continent matched to this event's IP address.`,
            examples: ['OC', 'AS', ' NA'],
        },
        $geoip_postal_code: {
            label: 'Postal Code',
            description: `Approximated postal code matched to this event's IP address.`,
            examples: ['2000', '600004', '11211'],
        },
        $geoip_latitude: {
            label: 'Latitude',
            description: `Approximated latitude matched to this event's IP address.`,
            examples: ['-33.8591', '13.1337', '40.7'],
        },
        $geoip_longitude: {
            label: 'Longitude',
            description: `Approximated longitude matched to this event's IP address.`,
            examples: ['151.2', '80.8008', '-73.9'],
        },
        $geoip_time_zone: {
            label: 'Timezone',
            description: `Timezone matched to this event's IP address.`,
            examples: ['Australia/Sydney', 'Asia/Kolkata', 'America/New_York'],
        },
        $geoip_subdivision_1_name: {
            label: 'Subdivision 1 Name',
            description: `Name of the subdivision matched to this event's IP address.`,
            examples: ['New South Wales', 'Tamil Nadu', 'New York'],
        },
        $geoip_subdivision_1_code: {
            label: 'Subdivision 1 Code',
            description: `Code of the subdivision matched to this event's IP address.`,
            examples: ['NSW', 'TN', 'NY'],
        },
        $geoip_subdivision_2_name: {
            label: 'Subdivision 2 Name',
            description: `Name of the second subdivision matched to this event's IP address.`,
        },
        $geoip_subdivision_2_code: {
            label: 'Subdivision 2 Code',
            description: `Code of the second subdivision matched to this event's IP address.`,
        },
        $geoip_subdivision_3_name: {
            label: 'Subdivision 3 Name',
            description: `Name of the third subdivision matched to this event's IP address.`,
        },
        $geoip_subdivision_3_code: {
            label: 'Subdivision 3 Code',
            description: `Code of the third subdivision matched to this event's IP address.`,
        },
        $geoip_disable: {
            label: 'GeoIP Disabled',
            description: `Whether to skip GeoIP processing for the event.`,
        },
        $geoip_city_confidence: {
            label: 'GeoIP detection city confidence',
            description: "Confidence level of the city matched to this event's IP address.",
            examples: ['0.5'],
        },
        $geoip_country_confidence: {
            label: 'GeoIP detection country confidence',
            description: "Confidence level of the country matched to this event's IP address.",
            examples: ['0.5'],
        },
        $geoip_accuracy_radius: {
            label: 'GeoIP detection accuracy radius',
            description: "Accuracy radius of the location matched to this event's IP address (in kilometers).",
            examples: ['50'],
        },
        $geoip_subdivision_1_confidence: {
            label: 'GeoIP detection subdivision 1 confidence',
            description: "Confidence level of the first subdivision matched to this event's IP address.",
            examples: ['0.5'],
        },

        $el_text: {
            label: 'Element Text',
            description: `The text of the element that was clicked. Only sent with Autocapture events.`,
            examples: ['Click here!'],
        },
        $app_build: {
            label: 'App Build',
            description: 'The build number for the app.',
        },
        $app_name: {
            label: 'App Name',
            description: 'The name of the app.',
        },
        $app_namespace: {
            label: 'App Namespace',
            description: 'The namespace of the app as identified in the app store.',
            examples: ['com.posthog.app'],
        },
        $app_version: {
            label: 'App Version',
            description: 'The version of the app.',
        },
        $device_manufacturer: {
            label: 'Device Manufacturer',
            description: 'The manufacturer of the device',
            examples: ['Apple', 'Samsung'],
        },
        $is_emulator: {
            label: 'Is Emulator',
            description: 'Indicates whether the app is running on an emulator or a physical device',
            examples: ['true', 'false'],
        },
        $is_mac_catalyst_app: {
            label: 'Is Mac Catalyst App',
            description: 'Indicates whether the app is a Mac Catalyst app running on macOS',
            examples: ['true', 'false'],
        },
        $is_ios_running_on_mac: {
            label: 'Is iOS App Running on Mac',
            description: 'Indicates whether the app is an iOS app running on macOS (Apple Silicon)',
            examples: ['true', 'false'],
        },
        $device_name: {
            label: 'Device Name',
            description: 'Name of the device',
            examples: ['iPhone 12 Pro', 'Samsung Galaxy 10'],
        },
        $locale: {
            label: 'Locale',
            description: 'The locale of the device',
            examples: ['en-US', 'de-DE'],
        },
        $os_name: {
            label: 'OS Name',
            description: 'The Operating System name',
            examples: ['iOS', 'Android'],
        },
        $os_version: {
            label: 'OS Version',
            description: 'The Operating System version.',
            examples: ['15.5'],
        },
        $timezone: {
            label: 'Timezone',
            description: 'The timezone as reported by the device',
        },

        $touch_x: {
            label: 'Touch X',
            description: 'The location of a Touch event on the X axis',
        },
        $touch_y: {
            label: 'Touch Y',
            description: 'The location of a Touch event on the Y axis',
        },
        $plugins_succeeded: {
            label: 'Plugins Succeeded',
            description: (
                <>
                    Plugins that successfully processed the event, e.g. edited properties (plugin method{' '}
                    <code>processEvent</code>).
                </>
            ),
        },
        $groups: {
            label: 'Groups',
            description: 'Relevant groups',
        },
        // There are at most 5 group types per project, so indexes 0, 1, 2, 3, and 4
        $group_0: {
            label: 'Group 1',
            system: true,
        },
        $group_1: {
            label: 'Group 2',
            system: true,
        },
        $group_2: {
            label: 'Group 3',
            system: true,
        },
        $group_3: {
            label: 'Group 4',
            system: true,
        },
        $group_4: {
            label: 'Group 5',
            system: true,
        },
        $group_set: {
            label: 'Group Set',
            description: 'Group properties to be set',
        },
        $group_key: {
            label: 'Group Key',
            description: 'Specified group key',
        },
        $group_type: {
            label: 'Group Type',
            description: 'Specified group type',
        },
        $window_id: {
            label: 'Window ID',
            description: 'Unique window ID for session recording disambiguation',
            system: true,
        },
        $session_id: {
            label: 'Session ID',
            description: 'Unique session ID for session recording disambiguation',
            system: true,
        },
        $plugins_failed: {
            label: 'Plugins Failed',
            description: (
                <>
                    Plugins that failed to process the event (plugin method <code>processEvent</code>).
                </>
            ),
        },
        $plugins_deferred: {
            label: 'Plugins Deferred',
            description: (
                <>
                    Plugins to which the event was handed off post-ingestion, e.g. for export (plugin method{' '}
                    <code>onEvent</code>).
                </>
            ),
        },
        $$plugin_metrics: {
            label: 'Plugin Metric',
            description: 'Performance metrics for a given plugin.',
        },
        $creator_event_uuid: {
            label: 'Creator Event ID',
            description: 'Unique ID for the event, which created this person.',
            examples: ['16ff262c4301e5-0aa346c03894bc-39667c0e-1aeaa0-16ff262c431767'],
        },

        // UTM tags
        utm_source: {
            label: 'UTM Source',
            description: 'UTM source tag.',
            examples: ['Google', 'Bing', 'Twitter', 'Facebook'],
        },
        $initial_utm_source: {
            label: 'Initial UTM Source',
            description: 'UTM source tag.',
            examples: ['Google', 'Bing', 'Twitter', 'Facebook'],
        },
        utm_medium: {
            label: 'UTM Medium',
            description: 'UTM medium tag.',
            examples: ['Social', 'Organic', 'Paid', 'Email'],
        },
        utm_campaign: {
            label: 'UTM Campaign',
            description: 'UTM campaign tag.',
            examples: ['feature launch', 'discount'],
        },
        utm_name: {
            label: 'UTM Name',
            description: 'UTM campaign tag, sent via Segment.',
            examples: ['feature launch', 'discount'],
        },
        utm_content: {
            label: 'UTM Content',
            description: 'UTM content tag.',
            examples: ['bottom link', 'second button'],
        },
        utm_term: {
            label: 'UTM Term',
            description: 'UTM term tag.',
            examples: ['free goodies'],
        },
        $performance_page_loaded: {
            label: 'Page Loaded',
            description: "The time taken until the browser's page load event in milliseconds.",
        },
        $performance_raw: {
            label: 'Browser Performance',
            description:
                'The browser performance entries for navigation (the page), paint, and resources. That were available when the page view event fired',
            system: true,
        },
        $had_persisted_distinct_id: {
            label: '$had_persisted_distinct_id',
            description: '',
            system: true,
        },
        $sentry_event_id: {
            label: 'Sentry Event ID',
            description: 'This is the Sentry key for an event.',
            examples: ['byroc2ar9ee4ijqp'],
            system: true,
        },
        $timestamp: {
            label: 'Timestamp (deprecated)',
            description:
                'Use the HogQL field `timestamp` instead. This field was previously set on some client side events.',
            examples: ['2023-05-20T15:30:00Z'],
            system: true,
        },
        $sent_at: {
            label: 'Sent At',
            description:
                'Time the event was sent to PostHog. Used for correcting the event timestamp when the device clock is off.',
            examples: [new Date().toISOString()],
        },
        $browser: {
            label: 'Browser',
            description: 'Name of the browser the user has used.',
            examples: ['Chrome', 'Firefox'],
        },
        $os: {
            label: 'OS',
            description: 'The operating system of the user.',
            examples: ['Windows', 'Mac OS X'],
        },
        $browser_language: {
            label: 'Browser Language',
            description: 'Language.',
            examples: ['en', 'en-US', 'cn', 'pl-PL'],
        },
        $current_url: {
            label: 'Current URL',
            description: 'The URL visited at the time of the event.',
            examples: ['https://example.com/interesting-article?parameter=true'],
        },
        $browser_version: {
            label: 'Browser Version',
            description: 'The version of the browser that was used. Used in combination with Browser.',
            examples: ['70', '79'],
        },
        $raw_user_agent: {
            label: 'Raw User Agent',
            description:
                'PostHog process information like browser, OS, and device type from the user agent string. This is the raw user agent string.',
            examples: ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)'],
        },
        $user_agent: {
            label: 'Raw User Agent',
            description: 'Some SDKs (like Android) send the raw user agent as $user_agent.',
            examples: ['Dalvik/2.1.0 (Linux; U; Android 11; Pixel 3 Build/RQ2A.210505.002)'],
        },
        $screen_height: {
            label: 'Screen Height',
            description: "The height of the user's entire screen (in pixels).",
            examples: ['2160', '1050'],
        },
        $screen_width: {
            label: 'Screen Width',
            description: "The width of the user's entire screen (in pixels).",
            examples: ['1440', '1920'],
        },
        $screen_name: {
            label: 'Screen Name',
            description: 'The name of the active screen.',
        },
        $viewport_height: {
            label: 'Viewport Height',
            description: "The height of the user's actual browser window (in pixels).",
            examples: ['2094', '1031'],
        },
        $viewport_width: {
            label: 'Viewport Width',
            description: "The width of the user's actual browser window (in pixels).",
            examples: ['1439', '1915'],
        },
        $lib: {
            label: 'Library',
            description: 'What library was used to send the event.',
            examples: ['web', 'posthog-ios'],
        },
        $lib_custom_api_host: {
            label: 'Library Custom API Host',
            description: 'The custom API host used to send the event.',
            examples: ['https://ph.example.com'],
        },
        $lib_version: {
            label: 'Library Version',
            description: 'Version of the library used to send the event. Used in combination with Library.',
            examples: ['1.0.3'],
        },
        $lib_version__major: {
            label: 'Library Version (Major)',
            description: 'Major version of the library used to send the event.',
            examples: [1],
        },
        $lib_version__minor: {
            label: 'Library Version (Minor)',
            description: 'Minor version of the library used to send the event.',
            examples: [0],
        },
        $lib_version__patch: {
            label: 'Library Version (Patch)',
            description: 'Patch version of the library used to send the event.',
            examples: [3],
        },
        $referrer: {
            label: 'Referrer URL',
            description: 'URL of where the user came from.',
            examples: ['https://google.com/search?q=posthog&rlz=1C...'],
        },
        $referring_domain: {
            label: 'Referring Domain',
            description: 'Domain of where the user came from.',
            examples: ['google.com', 'facebook.com'],
        },
        $user_id: {
            label: 'User ID',
            description: (
                <span>
                    This variable will be set to the distinct ID if you've called{' '}
                    <pre className="inline">posthog.identify('distinct id')</pre>. If the user is anonymous, it'll be
                    empty.
                </span>
            ),
        },
        $ip: {
            label: 'IP Address',
            description: 'IP address for this user when the event was sent.',
            examples: ['203.0.113.0'],
        },
        $host: {
            label: 'Host',
            description: 'The hostname of the Current URL.',
            examples: ['example.com', 'localhost:8000'],
        },
        $pathname: {
            label: 'Path Name',
            description: 'The path of the Current URL, which means everything in the url after the domain.',
            examples: ['/pricing', '/about-us/team'],
        },
        $search_engine: {
            label: 'Search Engine',
            description: 'The search engine the user came in from (if any).',
            examples: ['Google', 'DuckDuckGo'],
        },
        $active_feature_flags: {
            label: 'Active Feature Flags',
            description: 'Keys of the feature flags that were active while this event was sent.',
            examples: ["['beta-feature']"],
        },
        $enabled_feature_flags: {
            label: 'Enabled Feature Flags',
            description:
                'Keys and multivariate values of the feature flags that were active while this event was sent.',
            examples: ['{"flag": "value"}'],
        },
        $feature_flag_response: {
            label: 'Feature Flag Response',
            description: 'What the call to feature flag responded with.',
            examples: ['true', 'false'],
        },
        $feature_flag_payload: {
            label: 'Feature Flag Response Payload',
            description: 'The JSON payload that the call to feature flag responded with (if any)',
            examples: ['{"variant": "test"}'],
        },
        $feature_flag: {
            label: 'Feature Flag',
            description: (
                <>
                    The feature flag that was called.
                    <br />
                    <br />
                    Warning! This only works in combination with the $feature_flag_called event. If you want to filter
                    other events, try "Active Feature Flags".
                </>
            ),
            examples: ['beta-feature'],
        },
        $survey_response: {
            label: 'Survey Response',
            description: 'The response value for the first question in the survey.',
            examples: ['I love it!', 5, "['choice 1', 'choice 3']"],
        },
        $survey_name: {
            label: 'Survey Name',
            description: 'The name of the survey.',
            examples: ['Product Feedback for New Product', 'Home page NPS'],
        },
        $survey_questions: {
            label: 'Survey Questions',
            description: 'The questions asked in the survey.',
        },
        $survey_id: {
            label: 'Survey ID',
            description: 'The unique identifier for the survey.',
        },
        $survey_iteration: {
            label: 'Survey Iteration Number',
            description: 'The iteration number for the survey.',
        },
        $survey_iteration_start_date: {
            label: 'Survey Iteration Start Date',
            description: 'The start date for the current iteration of the survey.',
        },
        $device: {
            label: 'Device',
            description: 'The mobile device that was used.',
            examples: ['iPad', 'iPhone', 'Android'],
        },
        $sentry_url: {
            label: 'Sentry URL',
            description: 'Direct link to the exception in Sentry',
            examples: ['https://sentry.io/...'],
        },
        $device_type: {
            label: 'Device Type',
            description: 'The type of device that was used.',
            examples: ['Mobile', 'Tablet', 'Desktop'],
        },
        $screen_density: {
            label: 'Screen density',
            description:
                'The logical density of the display. This is a scaling factor for the Density Independent Pixel unit, where one DIP is one pixel on an approximately 160 dpi screen (for example a 240x320, 1.5"x2" screen), providing the baseline of the system\'s display. Thus on a 160dpi screen this density value will be 1; on a 120 dpi screen it would be .75; etc.',
            examples: [2.75],
        },
        $device_model: {
            label: 'Device Model',
            description: 'The model of the device that was used.',
            examples: ['iPhone9,3', 'SM-G965W'],
        },
        $network_wifi: {
            label: 'Network WiFi',
            description: 'Whether the user was on WiFi when the event was sent.',
            examples: ['true', 'false'],
        },
        $network_bluetooth: {
            label: 'Network Bluetooth',
            description: 'Whether the user was on Bluetooth when the event was sent.',
            examples: ['true', 'false'],
        },
        $network_cellular: {
            label: 'Network Cellular',
            description: 'Whether the user was on cellular when the event was sent.',
            examples: ['true', 'false'],
        },
        $client_session_initial_referring_host: {
            label: 'Referrer Host',
            description: 'Host that the user came from. (First-touch, session-scoped)',
            examples: ['google.com', 'facebook.com'],
        },
        $client_session_initial_pathname: {
            label: 'Initial Path',
            description: 'Path that the user started their session on. (First-touch, session-scoped)',
            examples: ['/register', '/some/landing/page'],
        },
        $client_session_initial_utm_source: {
            label: 'Initial UTM Source',
            description: 'UTM Source. (First-touch, session-scoped)',
            examples: ['Google', 'Bing', 'Twitter', 'Facebook'],
        },
        $client_session_initial_utm_campaign: {
            label: 'Initial UTM Campaign',
            description: 'UTM Campaign. (First-touch, session-scoped)',
            examples: ['feature launch', 'discount'],
        },
        $client_session_initial_utm_medium: {
            label: 'Initial UTM Medium',
            description: 'UTM Medium. (First-touch, session-scoped)',
            examples: ['Social', 'Organic', 'Paid', 'Email'],
        },
        $client_session_initial_utm_content: {
            label: 'Initial UTM Source',
            description: 'UTM Source. (First-touch, session-scoped)',
            examples: ['bottom link', 'second button'],
        },
        $client_session_initial_utm_term: {
            label: 'Initial UTM Source',
            description: 'UTM Source. (First-touch, session-scoped)',
            examples: ['free goodies'],
        },
        $network_carrier: {
            label: 'Network Carrier',
            description: 'The network carrier that the user is on.',
            examples: ['cricket', 'telecom'],
        },
        // set by the Application Opened event
        from_background: {
            label: 'From Background',
            description: 'Whether the app was opened for the first time or from the background.',
            examples: ['true', 'false'],
        },
        // set by the Application Opened/Deep Link Opened event
        url: {
            label: 'URL',
            description: 'The deep link URL that the app was opened from.',
            examples: ['https://open.my.app'],
        },
        referring_application: {
            label: 'Referrer Application',
            description: 'The namespace of the app that made the request.',
            examples: ['com.posthog.app'],
        },
        // set by the Application Installed/Application Updated/Application Opened events
        // similar to $app_version
        version: {
            label: 'App Version',
            description: 'The version of the app',
            examples: ['1.0.0'],
        },
        previous_version: {
            label: 'App Previous Version',
            description: 'The previous version of the app',
            examples: ['1.0.0'],
        },
        // similar to $app_build
        build: {
            label: 'App Build',
            description: 'The build number for the app',
            examples: ['1'],
        },
        previous_build: {
            label: 'App Previous Build',
            description: 'The previous build number for the app',
            examples: ['1'],
        },
        gclid: {
            label: 'gclid',
            description: 'Google Click ID',
        },
        rdt_cid: {
            label: 'rdt_cid',
            description: 'Reddit Click ID',
        },
        irclid: {
            label: 'irclid',
            description: 'Impact Click ID',
        },
        _kx: {
            label: '_kx',
            description: 'Klaviyo Tracking ID',
        },
        gad_source: {
            label: 'gad_source',
            description: 'Google Ads Source',
        },
        gclsrc: {
            label: 'gclsrc',
            description: 'Google Click Source',
        },
        dclid: {
            label: 'dclid',
            description: 'DoubleClick ID',
        },
        gbraid: {
            label: 'gbraid',
            description: 'Google Ads, web to app',
        },
        wbraid: {
            label: 'wbraid',
            description: 'Google Ads, app to web',
        },
        fbclid: {
            label: 'fbclid',
            description: 'Facebook Click ID',
        },
        msclkid: {
            label: 'msclkid',
            description: 'Microsoft Click ID',
        },
        twclid: {
            label: 'twclid',
            description: 'Twitter Click ID',
        },
        li_fat_id: {
            label: 'li_fat_id',
            description: 'LinkedIn First-Party Ad Tracking ID',
        },
        mc_cid: {
            label: 'mc_cid',
            description: 'Mailchimp Campaign ID',
        },
        igshid: {
            label: 'igshid',
            description: 'Instagram Share ID',
        },
        ttclid: {
            label: 'ttclid',
            description: 'TikTok Click ID',
        },
        $is_identified: {
            label: 'Is Identified',
            description: 'When the person was identified',
        },
        $initial_person_info: {
            label: 'Initial Person Info',
            description: 'posthog-js initial person information. used in the $set_once flow',
        },
        revenue: {
            label: 'Revenue',
            description:
                'The revenue associated with the event. By default, this is in USD, but the currency property can be used to specify a different currency.',
            examples: [10.0],
        },
        currency: {
            label: 'Currency',
            description: 'The currency code associated with the event.',
            examples: ['USD', 'EUR', 'GBP', 'CAD'],
        },
        // web vitals properties
        $web_vitals_enabled_server_side: {
            label: 'Web vitals enabled server side',
            description: 'Whether web vitals was enabled in remote config',
        },
        $web_vitals_FCP_event: {
            label: 'Web vitals FCP measure event details',
        },
        $web_vitals_FCP_value: {
            label: 'Web vitals FCP value',
        },
        $web_vitals_LCP_event: {
            label: 'Web vitals LCP measure event details',
        },
        $web_vitals_LCP_value: {
            label: 'Web vitals LCP value',
        },
        $web_vitals_INP_event: {
            label: 'Web vitals INP measure event details',
        },
        $web_vitals_INP_value: {
            label: 'Web vitals INP value',
        },
        $web_vitals_CLS_event: {
            label: 'Web vitals CLS measure event details',
        },
        $web_vitals_CLS_value: {
            label: 'Web vitals CLS value',
        },
        $web_vitals_allowed_metrics: {
            label: 'Web vitals allowed metrics',
            description: 'Allowed web vitals metrics config.',
            examples: ['["LCP", "CLS"]'],
        },

        // page leave properties
        $prev_pageview_last_scroll: {
            label: 'Previous pageview last scroll',
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            examples: [0],
        },
        $prev_pageview_last_scroll_percentage: {
            label: 'Previous pageview last scroll percentage',
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            examples: [0],
        },
        $prev_pageview_max_scroll: {
            examples: [0],
            label: 'Previous pageview max scroll',
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
        },
        $prev_pageview_max_scroll_percentage: {
            examples: [0],
            label: 'Previous pageview max scroll percentage',
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
        },
        $prev_pageview_last_content: {
            examples: [0],
            label: 'Previous pageview last content',
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
        },
        $prev_pageview_last_content_percentage: {
            examples: [0],
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            label: 'Previous pageview last content percentage',
        },
        $prev_pageview_max_content: {
            examples: [0],
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            label: 'Previous pageview max content',
        },
        $prev_pageview_max_content_percentage: {
            examples: [0],
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            label: 'Previous pageview max content percentage',
        },
        $prev_pageview_pathname: {
            examples: ['/pricing', '/about-us/team'],
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            label: 'Previous pageview pathname',
        },
        $prev_pageview_duration: {
            examples: [0],
            description: 'posthog-js adds these to the page leave event, they are used in web analytics calculations',
            label: 'Previous pageview duration',
        },
        $surveys_activated: {
            label: 'Surveys Activated',
            description: 'The surveys that were activated for this event.',
        },
        $process_person_profile: {
            label: 'Person Profile processing flag',
            description: 'The setting from an SDK to control whether an event has person processing enabled',
        },
        $dead_clicks_enabled_server_side: {
            label: 'Dead clicks enabled server side',
            description: 'Whether dead clicks were enabled in remote config',
        },
        $dead_click_scroll_delay_ms: {
            label: 'Dead click scroll delay in milliseconds',
            description: 'The delay between a click and the next scroll event',
        },
        $dead_click_mutation_delay_ms: {
            label: 'Dead click mutation delay in milliseconds',
            description: 'The delay between a click and the next mutation event',
        },
        $dead_click_absolute_delay_ms: {
            label: 'Dead click absolute delay in milliseconds',
            description: 'The delay between a click and having seen no activity at all',
        },
        $dead_click_selection_changed_delay_ms: {
            label: 'Dead click selection changed delay in milliseconds',
            description: 'The delay between a click and the next text selection change event',
        },
        $dead_click_last_mutation_timestamp: {
            label: 'Dead click last mutation timestamp',
            description: 'debug signal time of the last mutation seen by dead click autocapture',
        },
        $dead_click_event_timestamp: {
            label: 'Dead click event timestamp',
            description: 'debug signal time of the event that triggered dead click autocapture',
        },
        $dead_click_scroll_timeout: {
            label: 'Dead click scroll timeout',
            description: 'whether the dead click autocapture passed the threshold for waiting for a scroll event',
        },
        $dead_click_mutation_timeout: {
            label: 'Dead click mutation timeout',
            description: 'whether the dead click autocapture passed the threshold for waiting for a mutation event',
        },
        $dead_click_absolute_timeout: {
            label: 'Dead click absolute timeout',
            description: 'whether the dead click autocapture passed the threshold for waiting for any activity',
        },
        $dead_click_selection_changed_timeout: {
            label: 'Dead click selection changed timeout',
            description:
                'whether the dead click autocapture passed the threshold for waiting for a text selection change event',
        },
        // AI
        $ai_base_url: {
            label: 'AI Base URL (LLM)',
            description: 'The base URL of the request made to the LLM API',
            examples: ['https://api.openai.com/v1/'],
        },
        $ai_http_status: {
            label: 'AI HTTP Status (LLM)',
            description: 'The HTTP status code of the request made to the LLM API',
            examples: [200, 429],
        },
        $ai_input: {
            label: 'AI Input (LLM)',
            description: 'The input JSON that was sent to the LLM API',
            examples: ['{"content": "Explain quantum computing in simple terms.", "role": "user"}'],
        },
        $ai_input_tokens: {
            label: 'AI Input Tokens (LLM)',
            description: 'The number of tokens in the input prmopt that was sent to the LLM API',
            examples: [23],
        },
        $ai_output_choices: {
            label: 'AI Output (LLM)',
            description: 'The output message choices JSON that was received from the LLM API',
            examples: [
                '{"choices": [{"text": "Quantum computing is a type of computing that harnesses the power of quantum mechanics to perform operations on data."}]}',
            ],
        },
        $ai_output_tokens: {
            label: 'AI Output Tokens (LLM)',
            description: 'The number of tokens in the output from the LLM API',
            examples: [23],
        },
        $ai_input_cost_usd: {
            label: 'AI Input Cost USD (LLM)',
            description: 'The cost in USD of the input tokens sent to the LLM API',
            examples: [0.0017],
        },
        $ai_output_cost_usd: {
            label: 'AI Output Cost USD (LLM)',
            description: 'The cost in USD of the output tokens received from the LLM API',
            examples: [0.0024],
        },
        $ai_total_cost_usd: {
            label: 'AI Total Cost USD (LLM)',
            description: 'The total cost in USD of the request made to the LLM API (input + output costs)',
            examples: [0.0041],
        },
        $ai_latency: {
            label: 'AI Latency (LLM)',
            description: 'The latency of the request made to the LLM API, in seconds',
            examples: [0.361],
        },
        $ai_model: {
            label: 'AI Model (LLM)',
            description: 'The model used to generate the output from the LLM API',
            examples: ['gpt-4o-mini'],
        },
        $ai_model_parameters: {
            label: 'AI Model Parameters (LLM)',
            description: 'The parameters used to configure the model in the LLM API, in JSON',
            examples: ['{"temperature": 0.5, "max_tokens": 50}'],
        },
        $ai_stream: {
            label: 'AI Stream (LLM)',
            description: 'Whether the response from the LLM API was streamed',
            examples: ['true', 'false'],
        },
        $ai_temperature: {
            label: 'AI Temperature (LLM)',
            description: 'The temperature parameter used in the request to the LLM API',
            examples: [0.7, 1.0],
        },
        $ai_input_state: {
            label: 'AI Input State (LLM)',
            description: 'Input state of the LLM agent',
        },
        $ai_output_state: {
            label: 'AI Output State (LLM)',
            description: 'Output state of the LLM agent',
        },
        $ai_provider: {
            label: 'AI Provider (LLM)',
            description: 'The provider of the AI model used to generate the output from the LLM API',
            examples: ['openai'],
        },
        $ai_trace_id: {
            label: 'AI Trace ID (LLM)',
            description:
                'The trace ID of the request made to the LLM API. Used to group together multiple generations into a single trace',
            examples: ['c9222e05-8708-41b8-98ea-d4a21849e761'],
        },
        $ai_request_url: {
            label: 'AI Request URL (LLM)',
            description: 'The full URL of the request made to the LLM API',
            examples: ['https://api.openai.com/v1/chat/completions'],
        },
        $ai_metric_name: {
            label: 'AI Metric Name (LLM)',
            description: 'The name assigned to the metric used to evaluate the LLM trace',
            examples: ['rating', 'accuracy'],
        },
        $ai_metric_value: {
            label: 'AI Metric Value (LLM)',
            description: 'The value assigned to the metric used to evaluate the LLM trace',
            examples: ['"negative"', '95'],
        },
        $ai_feedback_text: {
            label: 'AI Feedback Text (LLM)',
            description: 'The text provided by the user for feedback on the LLM trace',
            examples: ['"The response was helpful, but it did not use the provided context."'],
        },
        $ai_parent_id: {
            label: 'AI Parent ID (LLM)',
            description: 'The parent span ID of a span or generation, used to group a trace into a tree view',
            examples: ['bdf42359-9364-4db7-8958-c001f28c9255'],
        },
        $ai_span_id: {
            label: 'AI Span ID (LLM)',
            description: 'The unique identifier for a LLM trace, generation, or span.',
            examples: ['bdf42359-9364-4db7-8958-c001f28c9255'],
        },
        $ai_span_name: {
            label: 'AI Span Name (LLM)',
            description: 'The name given to this LLM trace, generation, or span.',
            examples: ['summarize_text'],
        },
    },
    numerical_event_properties: {}, // Same as event properties, see assignment below
    person_properties: {}, // Currently person properties are the same as event properties, see assignment below
    session_properties: {
        $session_duration: {
            label: 'Session duration',
            description: (
                <span>
                    The duration of the session being tracked. Learn more about how PostHog tracks sessions in{' '}
                    <Link to="https://posthog.com/docs/user-guides/sessions">our documentation.</Link>
                    <br /> <br />
                    Note, if the duration is formatted as a single number (not 'HH:MM:SS'), it's in seconds.
                </span>
            ),
            examples: ['01:04:12'],
        },
        $start_timestamp: {
            label: 'Start timestamp',
            description: 'The timestamp of the first event from this session.',
            examples: [new Date().toISOString()],
        },
        $end_timestamp: {
            label: 'End timestamp',
            description: 'The timestamp of the last event from this session',
            examples: [new Date().toISOString()],
        },
        $entry_current_url: {
            label: 'Entry URL',
            description: 'The first URL visited in this session.',
            examples: ['https://example.com/interesting-article?parameter=true'],
        },
        $entry_pathname: {
            label: 'Entry pathname',
            description: 'The first pathname visited in this session.',
            examples: ['/interesting-article?parameter=true'],
        },
        $end_current_url: {
            label: 'Entry URL',
            description: 'The last URL visited in this session.',
            examples: ['https://example.com/interesting-article?parameter=true'],
        },
        $end_pathname: {
            label: 'Entry pathname',
            description: 'The last pathname visited in this session.',
            examples: ['/interesting-article'],
        },
        $exit_current_url: {
            label: 'Exit URL',
            description: 'The last URL visited in this session. (deprecated, use $end_current_url)',
            examples: ['https://example.com/interesting-article?parameter=true'],
        },
        $exit_pathname: {
            label: 'Exit pathname',
            description: 'The last pathname visited in this session. (deprecated, use $end_pathname)',
            examples: ['/interesting-article'],
        },
        $pageview_count: {
            label: 'Pageview count',
            description: 'The number of page view events in this session.',
            examples: ['123'],
        },
        $autocapture_count: {
            label: 'Autocapture count',
            description: 'The number of autocapture events in this session.',
            examples: ['123'],
        },
        $screen_count: {
            label: 'Screen count',
            description: 'The number of screen events in this session.',
            examples: ['123'],
        },
        $channel_type: {
            label: 'Channel type',
            description: 'What type of acquisition channel this traffic came from.',
            examples: ['Paid Search', 'Organic Video', 'Direct'],
        },
        $is_bounce: {
            label: 'Is bounce',
            description: 'Whether the session was a bounce.',
            examples: ['true', 'false'],
        },
        $last_external_click_url: {
            label: 'Last external click URL',
            description: 'The last external URL clicked in this session.',
            examples: ['https://example.com/interesting-article?parameter=true'],
        },
        $vitals_lcp: {
            label: 'Web vitals LCP',
            description: (
                <span>
                    The time it took for the Largest Contentful Paint on the page. This captures the perceived load time
                    of the page, and measure how long it took for the main content of the page to be visible to users.
                </span>
            ),
            examples: ['2.2'],
        },
    },
    groups: {
        $group_key: {
            label: 'Group Key',
            description: 'Specified group key',
        },
    },
    replay: {
        snapshot_source: {
            label: 'Platform',
            description: 'Platform the session was recorded on',
            examples: ['web', 'mobile'],
        },
        console_log_level: {
            label: 'Log level',
            description: 'Level of console logs captured',
            examples: ['info', 'warn', 'error'],
        },
        console_log_query: {
            label: 'Console log',
            description: 'Text of console logs captured',
        },
        visited_page: {
            label: 'Visited page',
            description: 'URL a user visited during their session',
        },
        click_count: {
            label: 'Clicks',
            description: 'Number of clicks during the session',
        },
        keypress_count: {
            label: 'Key presses',
            description: 'Number of key presses during the session',
        },
        console_error_count: {
            label: 'Errors',
            description: 'Number of console errors during the session',
        },
    },
    log_entries: {
        level: {
            label: 'Console log level',
            description: 'Level of the ',
            examples: ['info', 'warn', 'error'],
        },
        message: {
            label: 'Console log message',
            description: 'The contents of the log message',
        },
    },
} satisfies Partial<Record<TaxonomicFilterGroupType, Record<string, CoreFilterDefinition>>>

CORE_FILTER_DEFINITIONS_BY_GROUP.numerical_event_properties = CORE_FILTER_DEFINITIONS_BY_GROUP.event_properties
// add distinct_id to event properties before copying to person properties so it exists in person properties as well
CORE_FILTER_DEFINITIONS_BY_GROUP.event_properties.distinct_id = CORE_FILTER_DEFINITIONS_BY_GROUP.metadata.distinct_id

for (const [key, value] of Object.entries(CORE_FILTER_DEFINITIONS_BY_GROUP.event_properties)) {
    if (PERSON_PROPERTIES_ADAPTED_FROM_EVENT.has(key) || key.startsWith('$geoip_')) {
        CORE_FILTER_DEFINITIONS_BY_GROUP.person_properties[key] = {
            ...value,
            label: `Latest ${value.label}`,
            description:
                'description' in value
                    ? `${value.description} Data from the last time this user was seen.`
                    : 'Data from the last time this user was seen.',
        }

        CORE_FILTER_DEFINITIONS_BY_GROUP.person_properties[`$initial_${key.replace(/^\$/, '')}`] = {
            ...value,
            label: `Initial ${value.label}`,
            description:
                'description' in value
                    ? `${value.description} Data from the first time this user was seen.`
                    : 'Data from the first time this user was seen.',
        }
    } else {
        CORE_FILTER_DEFINITIONS_BY_GROUP.person_properties[key] = value
    }
    if (SESSION_INITIAL_PROPERTIES_ADAPTED_FROM_EVENTS.has(key)) {
        CORE_FILTER_DEFINITIONS_BY_GROUP.session_properties[`$entry_${key.replace(/^\$/, '')}`] = {
            ...value,
            label: `Entry ${value.label}`,
            description:
                'description' in value
                    ? `${value.description} Data from the first event in this session.`
                    : 'Data from the first event in this session.',
        }
    }
}

// We treat `$session_duration` as an event property in the context of series `math`, but it's fake in a sense
CORE_FILTER_DEFINITIONS_BY_GROUP.event_properties.$session_duration =
    CORE_FILTER_DEFINITIONS_BY_GROUP.session_properties.$session_duration

export const PROPERTY_KEYS = Object.keys(CORE_FILTER_DEFINITIONS_BY_GROUP.event_properties)

/**
 * these are properties that PostHog add to events they track for their own purposes
 * not part of the general taxonomy
 * but often more numerous than actual properties set on events and useful to hide
 * to make those properties discoverable
 */
export const CLOUD_INTERNAL_POSTHOG_PROPERTY_KEYS = [
    'billing_period_end',
    'billing_period_start',
    'current_amount_usd.data_warehouse',
    'current_amount_usd.feature_flags',
    'current_amount_usd.integrations',
    'current_amount_usd.platform_and_support',
    'current_amount_usd.product_analytics',
    'current_amount_usd.session_replay',
    'current_amount_usd.surveys',
    'current_total_amount_usd',
    'current_usage.data_warehouse',
    'current_usage.feature_flags',
    'current_usage.integrations',
    'current_usage.platform_and_support',
    'current_usage.product_analytics',
    'current_usage.session_replay',
    'current_usage.surveys',
    'customer_deactivated',
    'custom_limits.data_warehouse',
    'custom_limits.feature_flags',
    'custom_limits.integrations',
    'custom_limits.platform_and_support',
    'custom_limits.product_analytics',
    'custom_limits.session_replay',
    'custom_limits.surveys',
    'custom_limits_usd.data_warehouse',
    'custom_limits_usd.feature_flags',
    'custom_limits_usd.integrations',
    'custom_limits_usd.platform_and_support',
    'custom_limits_usd.product_analytics',
    'custom_limits_usd.session_replay',
    'custom_limits_usd.surveys',
    'free_allocation.data_warehouse',
    'free_allocation.feature_flags',
    'free_allocation.integrations',
    'free_allocation.platform_and_support',
    'free_allocation.product_analytics',
    'free_allocation.session_replay',
    'free_allocation.surveys',
    'has_billing_plan',
    'percentage_usage.data_warehouse',
    'percentage_usage.feature_flags',
    'percentage_usage.integrations',
    'percentage_usage.platform_and_support',
    'percentage_usage.product_analytics',
    'percentage_usage.session_replay',
    'percentage_usage.surveys',
    'projected_usage.data_warehouse',
    'projected_usage.feature_flags',
    'projected_usage.integrations',
    'projected_usage.platform_and_support',
    'projected_usage.product_analytics',
    'projected_usage.session_replay',
    'projected_usage.surveys',
    'unit_amount_usd.data_warehouse',
    'unit_amount_usd.feature_flags',
    'unit_amount_usd.integrations',
    'unit_amount_usd.platform_and_support',
    'unit_amount_usd.product_analytics',
    'unit_amount_usd.session_replay',
    'unit_amount_usd.surveys',
    'usage_limit.data_warehouse',
    'usage_limit.feature_flags',
    'usage_limit.integrations',
    'usage_limit.platform_and_support',
    'usage_limit.product_analytics',
    'usage_limit.session_replay',
    'usage_limit.surveys',
    'is_demo_project',
    'realm',
    'email_service_available',
    'slack_service_available',
    'commit_sha',
]

export const POSTHOG_EVENT_PROMOTED_PROPERTIES = {
    $pageview: ['$current_url', 'title', '$referrer'],
    $pageleave: ['$current_url', 'title', '$referrer'],
    $groupidentify: ['$group_type', '$group_key', '$group_set'],
    $screen: ['$screen_name'],
    $web_vitals: [
        '$web_vitals_FCP_value',
        '$web_vitals_CLS_value',
        '$web_vitals_INP_value',
        '$web_vitals_LCP_value',
        '$web_vitals_FCP_event',
        '$web_vitals_CLS_event',
        '$web_vitals_INP_event',
        '$web_vitals_LCP_event',
    ],
    $set: ['$set', '$set_once'],
}
export type KNOWN_PROMOTED_PROPERTY_PARENTS = keyof typeof POSTHOG_EVENT_PROMOTED_PROPERTIES

/** Return whether a given filter key is part of PostHog's core (marked by the PostHog logo). */
export function isCoreFilter(key: string): boolean {
    return Object.values(CORE_FILTER_DEFINITIONS_BY_GROUP).some((mapping) => Object.keys(mapping).includes(key))
}

export type PropertyKey = string | null | undefined

export function getCoreFilterDefinition(
    value: string | PropertyFilterValue | undefined,
    type: TaxonomicFilterGroupType
): CoreFilterDefinition | null {
    if (value == undefined) {
        return null
    }

    value = value.toString()
    const isGroupTaxonomicFilterType = type.startsWith('groups_')
    if (type in CORE_FILTER_DEFINITIONS_BY_GROUP && value in CORE_FILTER_DEFINITIONS_BY_GROUP[type]) {
        return { ...CORE_FILTER_DEFINITIONS_BY_GROUP[type][value] }
    } else if (
        isGroupTaxonomicFilterType &&
        value in CORE_FILTER_DEFINITIONS_BY_GROUP[TaxonomicFilterGroupType.GroupsPrefix]
    ) {
        return { ...CORE_FILTER_DEFINITIONS_BY_GROUP[TaxonomicFilterGroupType.GroupsPrefix][value] }
    } else if (value.startsWith('$survey_responded/')) {
        const surveyId = value.replace(/^\$survey_responded\//, '')
        if (surveyId) {
            return {
                label: `Survey Responded: ${surveyId}`,
                description: `Whether the user responded to survey with ID: "${surveyId}".`,
            }
        }
    } else if (value.startsWith('$survey_dismissed/')) {
        const surveyId = value.replace(/^\$survey_dismissed\//, '')
        if (surveyId) {
            return {
                label: `Survey Dismissed: ${surveyId}`,
                description: `Whether the user dismissed survey with ID: "${surveyId}".`,
            }
        }
    } else if (value.startsWith('$survey_response_')) {
        const surveyIndex = value.replace(/^\$survey_response_/, '')
        if (surveyIndex) {
            const index = Number(surveyIndex) + 1
            // yes this will return 21th, but I'm applying the domain logic of
            // it being very unlikely that someone will have more than 20 questions,
            // rather than hyper optimising the suffix.
            const suffix = index === 1 ? 'st' : index === 2 ? 'nd' : index === 3 ? 'rd' : 'th'
            return {
                label: `Survey Response Question ID: ${surveyIndex}`,
                description: `The response value for the ${index}${suffix} question in the survey.`,
            }
        }
    } else if (value.startsWith('$feature/')) {
        const featureFlagKey = value.replace(/^\$feature\//, '')
        if (featureFlagKey) {
            return {
                label: `Feature: ${featureFlagKey}`,
                description: `Value for the feature flag "${featureFlagKey}" when this event was sent.`,
                examples: ['true', 'variant-1a'],
            }
        }
    } else if (value.startsWith('$feature_enrollment/')) {
        const featureFlagKey = value.replace(/^\$feature_enrollment\//, '')
        if (featureFlagKey) {
            return {
                label: `Feature Enrollment: ${featureFlagKey}`,
                description: `Whether the user has opted into the "${featureFlagKey}" beta program.`,
                examples: ['true', 'false'],
            }
        }
    } else if (value.startsWith('$feature_interaction/')) {
        const featureFlagKey = value.replace(/^\$feature_interaction\//, '')
        if (featureFlagKey) {
            return {
                label: `Feature Interaction: ${featureFlagKey}`,
                description: `Whether the user has interacted with "${featureFlagKey}".`,
                examples: ['true', 'false'],
            }
        }
    }
    return null
}

export function getFilterLabel(key: PropertyKey, type: TaxonomicFilterGroupType): string {
    const data = getCoreFilterDefinition(key, type)
    return (data ? data.label : key)?.trim() ?? '(empty string)'
}

export function getPropertyKey(value: string, type: TaxonomicFilterGroupType): string {
    // Find the key by looking through the mapping
    const group = CORE_FILTER_DEFINITIONS_BY_GROUP[type]
    if (group) {
        const foundKey = Object.entries(group).find(([_, def]) => (def as any).label === value || _ === value)?.[0]
        return foundKey || value
    }
    return value
}
