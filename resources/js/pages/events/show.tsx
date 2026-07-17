import { DeleteDialog } from '@/components/delete-dialog';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    type AttendanceStatus,
    type BreadcrumbItem,
    type EventModel,
    type EventVolunteerPivot,
    type Masjid,
    type Squad,
    type VolunteerListItem,
    type VolunteerType,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Eye, IdCard, LoaderCircle, Plus, UserX } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    upcoming: 'default',
    ongoing: 'secondary',
    completed: 'outline',
    cancelled: 'destructive',
};

const attendanceVariant: Record<AttendanceStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    registered: 'outline',
    attended: 'default',
    no_show: 'destructive',
};

export default function EventShow({
    event,
    availableVolunteers,
    squads,
    masjids,
    volunteerTypes,
}: {
    event: EventModel;
    availableVolunteers: VolunteerListItem[];
    squads: Squad[];
    masjids: Masjid[];
    volunteerTypes: VolunteerType[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Events', href: route('events.index') },
        { title: event.name, href: route('events.show', event.id) },
    ];

    const [registerOpen, setRegisterOpen] = useState(false);
    const [volunteerSearch, setVolunteerSearch] = useState('');
    const registerForm = useForm({ volunteer_ids: [] as number[], squad_id: '', masjid_id: '', volunteer_type_id: '' });

    const toggleVolunteer = (volunteerId: number) => {
        registerForm.setData(
            'volunteer_ids',
            registerForm.data.volunteer_ids.includes(volunteerId)
                ? registerForm.data.volunteer_ids.filter((id) => id !== volunteerId)
                : [...registerForm.data.volunteer_ids, volunteerId],
        );
    };

    const filteredVolunteers = volunteerSearch.trim()
        ? availableVolunteers.filter((volunteer) =>
              `${volunteer.name} ${volunteer.phone}`.toLowerCase().includes(volunteerSearch.trim().toLowerCase()),
          )
        : availableVolunteers;

    const register: FormEventHandler = (e) => {
        e.preventDefault();
        registerForm.post(route('events.register.bulk', event.id), {
            preserveScroll: true,
            onSuccess: () => {
                setRegisterOpen(false);
                setVolunteerSearch('');
                registerForm.reset();
                registerForm.clearErrors();
            },
        });
    };

    const [selectedVolunteerIds, setSelectedVolunteerIds] = useState<number[]>([]);

    const toggleVolunteerSelection = (volunteerId: number) => {
        setSelectedVolunteerIds((previous) =>
            previous.includes(volunteerId) ? previous.filter((id) => id !== volunteerId) : [...previous, volunteerId],
        );
    };

    const registeredIds = event.volunteers?.map((volunteer) => volunteer.id) ?? [];
    const allSelected = registeredIds.length > 0 && registeredIds.every((id) => selectedVolunteerIds.includes(id));

    const toggleSelectAll = () => {
        setSelectedVolunteerIds(allSelected ? [] : registeredIds);
    };

    const badgesHref =
        selectedVolunteerIds.length > 0
            ? route('events.badges', { event: event.id, volunteer_ids: selectedVolunteerIds })
            : route('events.badges', event.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={event.name} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold">{event.name}</h1>
                            <Badge variant={statusVariant[event.status]}>{event.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.purpose?.name}</p>
                    </div>
                </div>

                <div className="grid gap-4 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium">{event.location ?? '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Start</p>
                        <p className="font-medium">{new Date(event.start_date).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">End</p>
                        <p className="font-medium">{event.end_date ? new Date(event.end_date).toLocaleString() : '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Registered</p>
                        <p className="font-medium">{event.volunteers?.length ?? 0}</p>
                    </div>
                </div>

                {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Volunteer Roster</h2>
                    <div className="flex items-center gap-2">
                        {event.volunteers && event.volunteers.length > 0 && (
                            <Button size="sm" variant="outline" asChild>
                                <a href={badgesHref} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4" />
                                    {selectedVolunteerIds.length > 0
                                        ? `View Selected Badges (${selectedVolunteerIds.length})`
                                        : 'View All Badges'}
                                </a>
                            </Button>
                        )}
                        <Dialog
                            open={registerOpen}
                            onOpenChange={(open) => {
                                setRegisterOpen(open);
                                if (!open) {
                                    setVolunteerSearch('');
                                    registerForm.reset();
                                    registerForm.clearErrors();
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4" />
                                    Register Volunteers
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Register volunteers</DialogTitle>
                                <form onSubmit={register} className="space-y-4">
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="volunteer_search">Volunteers</Label>
                                            <span className="text-xs text-muted-foreground">{registerForm.data.volunteer_ids.length} selected</span>
                                        </div>
                                        <Input
                                            id="volunteer_search"
                                            placeholder="Search by name or phone..."
                                            value={volunteerSearch}
                                            onChange={(e) => setVolunteerSearch(e.target.value)}
                                        />
                                        <div className="max-h-48 overflow-y-auto rounded-md border">
                                            {filteredVolunteers.length === 0 && (
                                                <div className="px-3 py-2 text-sm text-muted-foreground">No available volunteers</div>
                                            )}
                                            {filteredVolunteers.map((volunteer) => (
                                                <label
                                                    key={volunteer.id}
                                                    htmlFor={`volunteer-${volunteer.id}`}
                                                    className="flex cursor-pointer items-center gap-2 border-b px-3 py-2 text-sm last:border-b-0 hover:bg-accent"
                                                >
                                                    <Checkbox
                                                        id={`volunteer-${volunteer.id}`}
                                                        checked={registerForm.data.volunteer_ids.includes(volunteer.id)}
                                                        onCheckedChange={() => toggleVolunteer(volunteer.id)}
                                                    />
                                                    <span>
                                                        {volunteer.name} <span className="text-muted-foreground">({volunteer.phone})</span>
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        <InputError message={registerForm.errors.volunteer_ids} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="squad_id">Squad</Label>
                                            <Select
                                                value={registerForm.data.squad_id}
                                                onValueChange={(value) => registerForm.setData('squad_id', value)}
                                            >
                                                <SelectTrigger id="squad_id">
                                                    <SelectValue placeholder="Select a squad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {squads.map((squad) => (
                                                        <SelectItem key={squad.id} value={String(squad.id)}>
                                                            {squad.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={registerForm.errors.squad_id} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="masjid_id">Masjid</Label>
                                            <Select
                                                value={registerForm.data.masjid_id}
                                                onValueChange={(value) => registerForm.setData('masjid_id', value)}
                                            >
                                                <SelectTrigger id="masjid_id">
                                                    <SelectValue placeholder="Select a masjid" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {masjids.map((masjid) => (
                                                        <SelectItem key={masjid.id} value={String(masjid.id)}>
                                                            {masjid.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={registerForm.errors.masjid_id} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="volunteer_type_id">Volunteer Type</Label>
                                        <Select
                                            value={registerForm.data.volunteer_type_id}
                                            onValueChange={(value) => registerForm.setData('volunteer_type_id', value)}
                                        >
                                            <SelectTrigger id="volunteer_type_id">
                                                <SelectValue placeholder="Select a volunteer type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {volunteerTypes.map((volunteerType) => (
                                                    <SelectItem key={volunteerType.id} value={String(volunteerType.id)}>
                                                        {volunteerType.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={registerForm.errors.volunteer_type_id} />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={
                                                registerForm.processing ||
                                                registerForm.data.volunteer_ids.length === 0 ||
                                                !registerForm.data.squad_id ||
                                                !registerForm.data.masjid_id ||
                                                !registerForm.data.volunteer_type_id
                                            }
                                        >
                                            {registerForm.processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Register {registerForm.data.volunteer_ids.length > 0 ? registerForm.data.volunteer_ids.length : ''}{' '}
                                            Volunteer{registerForm.data.volunteer_ids.length === 1 ? '' : 's'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={toggleSelectAll}
                                        aria-label="Select all volunteers"
                                        disabled={registeredIds.length === 0}
                                    />
                                </TableHead>
                                <TableHead>Volunteer</TableHead>
                                <TableHead>Squad</TableHead>
                                <TableHead>Masjid</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(!event.volunteers || event.volunteers.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No volunteers registered yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {event.volunteers?.map((volunteer) => (
                                <RosterRow
                                    key={volunteer.id}
                                    eventId={event.id}
                                    volunteer={volunteer}
                                    squads={squads}
                                    masjids={masjids}
                                    volunteerTypes={volunteerTypes}
                                    selected={selectedVolunteerIds.includes(volunteer.id)}
                                    onToggleSelect={() => toggleVolunteerSelection(volunteer.id)}
                                    onRemoved={() => setSelectedVolunteerIds((previous) => previous.filter((id) => id !== volunteer.id))}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}

function withCurrent<T extends { id: number; name: string }>(list: T[], current?: T): T[] {
    if (!current || list.some((item) => item.id === current.id)) {
        return list;
    }
    return [...list, current];
}

function RosterRow({
    eventId,
    volunteer,
    squads,
    masjids,
    volunteerTypes,
    selected,
    onToggleSelect,
    onRemoved,
}: {
    eventId: number;
    volunteer: VolunteerListItem & { pivot: EventVolunteerPivot };
    squads: Squad[];
    masjids: Masjid[];
    volunteerTypes: VolunteerType[];
    selected: boolean;
    onToggleSelect: () => void;
    onRemoved: () => void;
}) {
    const { data, setData } = useForm({
        attendance_status: volunteer.pivot.attendance_status,
        squad_id: String(volunteer.pivot.squad_id),
        masjid_id: String(volunteer.pivot.masjid_id),
        volunteer_type_id: String(volunteer.pivot.volunteer_type_id),
    });

    const update = (changes: Partial<typeof data>) => {
        const previous = data;
        const next = { ...data, ...changes };
        setData(next);
        router.patch(route('events.registration.update', [eventId, volunteer.id]), next, {
            preserveScroll: true,
            onError: () => setData(previous),
        });
    };

    return (
        <TableRow>
            <TableCell>
                <Checkbox checked={selected} onCheckedChange={onToggleSelect} aria-label={`Select ${volunteer.name}`} />
            </TableCell>
            <TableCell>
                <div className="font-medium">{volunteer.name}</div>
                <div className="text-sm text-muted-foreground">{volunteer.phone}</div>
            </TableCell>
            <TableCell>
                <Select value={data.squad_id} onValueChange={(value) => update({ squad_id: value })}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {withCurrent(squads, volunteer.pivot.squad).map((squad) => (
                            <SelectItem key={squad.id} value={String(squad.id)}>
                                {squad.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Select value={data.masjid_id} onValueChange={(value) => update({ masjid_id: value })}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {withCurrent(masjids, volunteer.pivot.masjid).map((masjid) => (
                            <SelectItem key={masjid.id} value={String(masjid.id)}>
                                {masjid.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Select value={data.volunteer_type_id} onValueChange={(value) => update({ volunteer_type_id: value })}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {withCurrent(volunteerTypes, volunteer.pivot.volunteer_type).map((volunteerType) => (
                            <SelectItem key={volunteerType.id} value={String(volunteerType.id)}>
                                {volunteerType.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Select
                    value={data.attendance_status}
                    onValueChange={(value) => update({ attendance_status: value as AttendanceStatus })}
                >
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="attended">Attended</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                </Select>
                <Badge variant={attendanceVariant[data.attendance_status]} className="mt-1">
                    {data.attendance_status.replace('_', ' ')}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                    <a href={route('events.badge', [eventId, volunteer.id])} target="_blank" rel="noopener noreferrer">
                        <IdCard className="h-4 w-4" />
                    </a>
                </Button>
                <DeleteDialog
                    title="Remove volunteer?"
                    description={`Remove ${volunteer.name} from this event's roster.`}
                    onConfirm={() => {
                        onRemoved();
                        router.delete(route('events.unregister', [eventId, volunteer.id]), { preserveScroll: true });
                    }}
                    trigger={
                        <Button variant="ghost" size="icon">
                            <UserX className="h-4 w-4 text-destructive" />
                        </Button>
                    }
                />
            </TableCell>
        </TableRow>
    );
}
