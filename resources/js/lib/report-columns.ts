export interface ReportColumnDefinition {
    key: string;
    label: string;
}

export interface ReportColumnGroup {
    group: string;
    columns: ReportColumnDefinition[];
}

export const REPORT_COLUMN_GROUPS: ReportColumnGroup[] = [
    {
        group: 'Volunteer',
        columns: [
            { key: 'volunteer_name', label: 'Name' },
            { key: 'volunteer_father_name', label: 'Father Name' },
            { key: 'volunteer_phone', label: 'Phone' },
            { key: 'volunteer_cnic', label: 'CNIC' },
            { key: 'volunteer_status', label: 'Volunteer Status' },
            { key: 'volunteer_joined_date', label: 'Joined Date' },
        ],
    },
    {
        group: 'Event',
        columns: [
            { key: 'event_name', label: 'Name' },
            { key: 'event_location', label: 'Location' },
            { key: 'event_start_date', label: 'Start Date' },
            { key: 'event_end_date', label: 'End Date' },
            { key: 'event_status', label: 'Event Status' },
        ],
    },
    {
        group: 'Registration',
        columns: [
            { key: 'purpose_name', label: 'Purpose' },
            { key: 'squad_name', label: 'Squad' },
            { key: 'masjid_name', label: 'Masjid' },
            { key: 'volunteer_type_name', label: 'Volunteer Type' },
            { key: 'attendance_status', label: 'Attendance Status' },
            { key: 'attendance_registered_at', label: 'Registered At' },
        ],
    },
];

export const REPORT_COLUMNS: ReportColumnDefinition[] = REPORT_COLUMN_GROUPS.flatMap((group) => group.columns);

export const ALL_REPORT_COLUMN_KEYS = REPORT_COLUMNS.map((column) => column.key);
