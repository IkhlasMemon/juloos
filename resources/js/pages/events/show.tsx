import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { IdCard, LoaderCircle, Plus, Printer, UserX } from 'lucide-react';
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
    const registerForm = useForm({ volunteer_id: '', squad_id: '', masjid_id: '', volunteer_type_id: '' });

    const register: FormEventHandler = (e) => {
        e.preventDefault();
        registerForm.post(route('events.register', event.id), {
            preserveScroll: true,
            onSuccess: () => {
                setRegisterOpen(false);
                registerForm.reset();
            },
        });
    };

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
                                <a href={route('events.badges', event.id)}>
                                    <Printer className="h-4 w-4" />
                                    Print All Badges
                                </a>
                            </Button>
                        )}
                        <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4" />
                                    Register Volunteer
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Register a volunteer</DialogTitle>
                                <form onSubmit={register} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="volunteer_id">Volunteer</Label>
                                        <Select
                                            value={registerForm.data.volunteer_id}
                                            onValueChange={(value) => registerForm.setData('volunteer_id', value)}
                                        >
                                            <SelectTrigger id="volunteer_id">
                                                <SelectValue placeholder="Select a volunteer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableVolunteers.length === 0 && (
                                                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No available volunteers</div>
                                                )}
                                                {availableVolunteers.map((volunteer) => (
                                                    <SelectItem key={volunteer.id} value={String(volunteer.id)}>
                                                        {volunteer.name} ({volunteer.phone})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={
                                                registerForm.processing ||
                                                !registerForm.data.volunteer_id ||
                                                !registerForm.data.squad_id ||
                                                !registerForm.data.masjid_id ||
                                                !registerForm.data.volunteer_type_id
                                            }
                                        >
                                            {registerForm.processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Register
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
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
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
}: {
    eventId: number;
    volunteer: VolunteerListItem & { pivot: EventVolunteerPivot };
    squads: Squad[];
    masjids: Masjid[];
    volunteerTypes: VolunteerType[];
}) {
    const { data, setData } = useForm({
        attendance_status: volunteer.pivot.attendance_status,
        squad_id: String(volunteer.pivot.squad_id),
        masjid_id: String(volunteer.pivot.masjid_id),
        volunteer_type_id: String(volunteer.pivot.volunteer_type_id),
    });

    const update = (changes: Partial<typeof data>) => {
        const next = { ...data, ...changes };
        setData(next);
        router.patch(route('events.registration.update', [eventId, volunteer.id]), next, { preserveScroll: true });
    };

    return (
        <TableRow>
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
                    <a href={route('events.badge', [eventId, volunteer.id])}>
                        <IdCard className="h-4 w-4" />
                    </a>
                </Button>
                <DeleteDialog
                    title="Remove volunteer?"
                    description={`Remove ${volunteer.name} from this event's roster.`}
                    onConfirm={() => router.delete(route('events.unregister', [eventId, volunteer.id]), { preserveScroll: true })}
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
