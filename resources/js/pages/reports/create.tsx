import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { ALL_REPORT_COLUMN_KEYS, REPORT_COLUMN_GROUPS } from '@/lib/report-columns';
import { type BreadcrumbItem, type EventModel, type Masjid, type Purpose, type Squad, type VolunteerType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: route('reports.index') },
    { title: 'New Report', href: route('reports.create') },
];

export default function ReportCreate({
    purposes,
    events,
    squads,
    masjids,
    volunteerTypes,
}: {
    purposes: Purpose[];
    events: EventModel[];
    squads: Squad[];
    masjids: Masjid[];
    volunteerTypes: VolunteerType[];
}) {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        description: '',
        purpose_id: 'none',
        event_id: 'none',
        squad_id: 'none',
        masjid_id: 'none',
        volunteer_type_id: 'none',
        columns: ALL_REPORT_COLUMN_KEYS as string[],
    });

    transform((data) => ({
        ...data,
        purpose_id: data.purpose_id !== 'none' ? data.purpose_id : null,
        event_id: data.event_id !== 'none' ? data.event_id : null,
        squad_id: data.squad_id !== 'none' ? data.squad_id : null,
        masjid_id: data.masjid_id !== 'none' ? data.masjid_id : null,
        volunteer_type_id: data.volunteer_type_id !== 'none' ? data.volunteer_type_id : null,
    }));

    const toggleColumn = (key: string) => {
        setData('columns', data.columns.includes(key) ? data.columns.filter((existing) => existing !== key) : [...data.columns, key]);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('reports.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Report" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">New Report</h1>
                    <p className="text-sm text-muted-foreground">
                        Reports list volunteer registrations. Leave a filter as "Any" to include every value for that field.
                    </p>
                </div>
                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="purpose_id">Purpose</Label>
                            <Select value={data.purpose_id} onValueChange={(value) => setData('purpose_id', value)}>
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
                            <InputError message={errors.purpose_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="event_id">Event</Label>
                            <Combobox
                                id="event_id"
                                value={data.event_id}
                                onValueChange={(value) => setData('event_id', value)}
                                placeholder="Any event"
                                emptyText="No events found"
                                options={[{ value: 'none', label: 'Any event' }, ...events.map((event) => ({ value: String(event.id), label: event.name }))]}
                            />
                            <InputError message={errors.event_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="squad_id">Squad</Label>
                            <Select value={data.squad_id} onValueChange={(value) => setData('squad_id', value)}>
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
                            <InputError message={errors.squad_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="masjid_id">Masjid</Label>
                            <Select value={data.masjid_id} onValueChange={(value) => setData('masjid_id', value)}>
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
                            <InputError message={errors.masjid_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="volunteer_type_id">Volunteer Type</Label>
                            <Select value={data.volunteer_type_id} onValueChange={(value) => setData('volunteer_type_id', value)}>
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
                            <InputError message={errors.volunteer_type_id} />
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div>
                            <Label>Columns</Label>
                            <p className="text-sm text-muted-foreground">Choose which fields show when this report is viewed or exported.</p>
                        </div>
                        {REPORT_COLUMN_GROUPS.map((group) => (
                            <div key={group.group} className="grid gap-2">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{group.group}</p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {group.columns.map((column) => (
                                        <label
                                            key={column.key}
                                            htmlFor={`column-${column.key}`}
                                            className="flex cursor-pointer items-center gap-2 text-sm"
                                        >
                                            <Checkbox
                                                id={`column-${column.key}`}
                                                checked={data.columns.includes(column.key)}
                                                onCheckedChange={() => toggleColumn(column.key)}
                                            />
                                            {column.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <InputError message={errors.columns} />
                    </div>

                    <Button type="submit" disabled={processing || data.columns.length === 0}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create Report
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
