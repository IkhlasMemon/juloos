import { DataPagination } from '@/components/data-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { REPORT_COLUMNS } from '@/lib/report-columns';
import {
    type AttendanceStatus,
    type BreadcrumbItem,
    type EventModel,
    type EventStatus,
    type Masjid,
    type Paginated,
    type Purpose,
    type Report,
    type ReportFilters,
    type ReportRegistration,
    type SharedData,
    type Squad,
    type VolunteerType,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, FileText, Pencil, RotateCcw } from 'lucide-react';
import { ReactNode } from 'react';

const attendanceVariant: Record<AttendanceStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    registered: 'outline',
    attended: 'default',
    no_show: 'destructive',
};

const eventStatusVariant: Record<EventStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    upcoming: 'default',
    ongoing: 'secondary',
    completed: 'outline',
    cancelled: 'destructive',
};

const columnRenderers: Record<string, { label: string; render: (registration: ReportRegistration) => ReactNode }> = {
    volunteer_name: { label: 'Name', render: (r) => r.volunteer.name },
    volunteer_father_name: { label: 'Father Name', render: (r) => r.volunteer.father_name },
    volunteer_phone: { label: 'Phone', render: (r) => r.volunteer.phone },
    volunteer_cnic: { label: 'CNIC', render: (r) => r.volunteer.cnic ?? '—' },
    volunteer_status: {
        label: 'Volunteer Status',
        render: (r) => <Badge variant={r.volunteer.status === 'active' ? 'default' : 'secondary'}>{r.volunteer.status}</Badge>,
    },
    volunteer_joined_date: { label: 'Joined Date', render: (r) => new Date(r.volunteer.joined_date).toLocaleDateString() },
    event_name: { label: 'Event', render: (r) => r.event.name },
    event_location: { label: 'Location', render: (r) => r.event.location ?? '—' },
    event_start_date: { label: 'Start Date', render: (r) => new Date(r.event.start_date).toLocaleString() },
    event_end_date: { label: 'End Date', render: (r) => (r.event.end_date ? new Date(r.event.end_date).toLocaleString() : '—') },
    event_status: { label: 'Event Status', render: (r) => <Badge variant={eventStatusVariant[r.event.status]}>{r.event.status}</Badge> },
    purpose_name: { label: 'Purpose', render: (r) => r.event.purpose?.name ?? '—' },
    squad_name: { label: 'Squad', render: (r) => r.squad?.name ?? '—' },
    masjid_name: { label: 'Masjid', render: (r) => r.masjid?.name ?? '—' },
    volunteer_type_name: { label: 'Volunteer Type', render: (r) => r.volunteer_type?.name ?? '—' },
    attendance_status: {
        label: 'Attendance',
        render: (r) => <Badge variant={attendanceVariant[r.attendance_status]}>{r.attendance_status.replace('_', ' ')}</Badge>,
    },
    attendance_registered_at: { label: 'Registered At', render: (r) => new Date(r.registered_at).toLocaleString() },
};

export default function ReportShow({
    report,
    registrations,
    filters,
    columns,
    purposes,
    events,
    squads,
    masjids,
    volunteerTypes,
}: {
    report: Report;
    registrations: Paginated<ReportRegistration>;
    filters: ReportFilters;
    columns: string[];
    purposes: Purpose[];
    events: EventModel[];
    squads: Squad[];
    masjids: Masjid[];
    volunteerTypes: VolunteerType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const canManage = (auth.permissions ?? []).includes('manage reports');
    const canExport = (auth.permissions ?? []).includes('export reports');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reports', href: route('reports.index') },
        { title: report.name, href: route('reports.show', report.id) },
    ];

    const exportParams = {
        report: report.id,
        purpose_id: filters.purpose_id ?? undefined,
        event_id: filters.event_id ?? undefined,
        squad_id: filters.squad_id ?? undefined,
        masjid_id: filters.masjid_id ?? undefined,
        volunteer_type_id: filters.volunteer_type_id ?? undefined,
    };

    const applyFilter = (key: keyof ReportFilters, value: string) => {
        const next = { ...filters, [key]: value !== 'none' ? Number(value) : null };
        router.get(
            route('reports.show', report.id),
            {
                purpose_id: next.purpose_id ?? undefined,
                event_id: next.event_id ?? undefined,
                squad_id: next.squad_id ?? undefined,
                masjid_id: next.masjid_id ?? undefined,
                volunteer_type_id: next.volunteer_type_id ?? undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetToSaved = () => {
        router.get(route('reports.show', report.id), {}, { preserveState: false, replace: true });
    };

    const visibleColumns = REPORT_COLUMNS.filter((column) => columns.includes(column.key));

    const savedFilters: ReportFilters = {
        purpose_id: report.purpose_id,
        event_id: report.event_id,
        squad_id: report.squad_id,
        masjid_id: report.masjid_id,
        volunteer_type_id: report.volunteer_type_id,
    };
    const isModified = (Object.keys(savedFilters) as (keyof ReportFilters)[]).some((key) => filters[key] !== savedFilters[key]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={report.name} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{report.name}</h1>
                        {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {canExport && (
                            <>
                                <Button size="sm" variant="outline" asChild>
                                    <a href={route('reports.export.csv', exportParams)}>
                                        <Download className="h-4 w-4" />
                                        Download CSV
                                    </a>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                    <a href={route('reports.export.pdf', exportParams)} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-4 w-4" />
                                        Download PDF
                                    </a>
                                </Button>
                            </>
                        )}
                        {canManage && (
                            <Button size="sm" variant="outline" asChild>
                                <Link href={route('reports.edit', report.id)}>
                                    <Pencil className="h-4 w-4" />
                                    Edit Report
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Filters</p>
                        {isModified && (
                            <Button size="sm" variant="ghost" onClick={resetToSaved}>
                                <RotateCcw className="h-4 w-4" />
                                Reset to saved filters
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        <div className="grid gap-2">
                            <Label htmlFor="purpose_id">Purpose</Label>
                            <Select value={filters.purpose_id ? String(filters.purpose_id) : 'none'} onValueChange={(value) => applyFilter('purpose_id', value)}>
                                <SelectTrigger id="purpose_id">
                                    <SelectValue placeholder="Any purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Any purpose</SelectItem>
                                    {purposes.map((purpose) => (
                                        <SelectItem key={purpose.id} value={String(purpose.id)}>
                                            {purpose.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="event_id">Event</Label>
                            <Combobox
                                id="event_id"
                                value={filters.event_id ? String(filters.event_id) : 'none'}
                                onValueChange={(value) => applyFilter('event_id', value)}
                                placeholder="Any event"
                                emptyText="No events found"
                                options={[{ value: 'none', label: 'Any event' }, ...events.map((event) => ({ value: String(event.id), label: event.name }))]}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="squad_id">Squad</Label>
                            <Select value={filters.squad_id ? String(filters.squad_id) : 'none'} onValueChange={(value) => applyFilter('squad_id', value)}>
                                <SelectTrigger id="squad_id">
                                    <SelectValue placeholder="Any squad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Any squad</SelectItem>
                                    {squads.map((squad) => (
                                        <SelectItem key={squad.id} value={String(squad.id)}>
                                            {squad.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="masjid_id">Masjid</Label>
                            <Select value={filters.masjid_id ? String(filters.masjid_id) : 'none'} onValueChange={(value) => applyFilter('masjid_id', value)}>
                                <SelectTrigger id="masjid_id">
                                    <SelectValue placeholder="Any masjid" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Any masjid</SelectItem>
                                    {masjids.map((masjid) => (
                                        <SelectItem key={masjid.id} value={String(masjid.id)}>
                                            {masjid.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="volunteer_type_id">Volunteer Type</Label>
                            <Select
                                value={filters.volunteer_type_id ? String(filters.volunteer_type_id) : 'none'}
                                onValueChange={(value) => applyFilter('volunteer_type_id', value)}
                            >
                                <SelectTrigger id="volunteer_type_id">
                                    <SelectValue placeholder="Any volunteer type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Any volunteer type</SelectItem>
                                    {volunteerTypes.map((volunteerType) => (
                                        <SelectItem key={volunteerType.id} value={String(volunteerType.id)}>
                                            {volunteerType.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {isModified && (
                        <p className="text-xs text-muted-foreground">
                            Showing live results with adjusted filters — this report's saved definition hasn't changed.
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {visibleColumns.map((column) => (
                                    <TableHead key={column.key}>{columnRenderers[column.key].label}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length} className="text-center text-muted-foreground">
                                        No registrations match these filters.
                                    </TableCell>
                                </TableRow>
                            )}
                            {registrations.data.map((registration) => (
                                <TableRow key={registration.id}>
                                    {visibleColumns.map((column) => (
                                        <TableCell key={column.key}>{columnRenderers[column.key].render(registration)}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination links={registrations.links} from={registrations.from} to={registrations.to} total={registrations.total} />
            </div>
        </AppLayout>
    );
}
