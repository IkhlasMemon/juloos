import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { storageUrl } from '@/lib/storage-url';
import { type AttendanceStatus, type BreadcrumbItem, type EventModel, type EventVolunteerPivot, type Volunteer } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { IdCard, Pencil } from 'lucide-react';

const attendanceVariant: Record<AttendanceStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    registered: 'outline',
    attended: 'default',
    no_show: 'destructive',
};

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function VolunteerShow({
    volunteer,
    eventsAttended,
}: {
    volunteer: Volunteer & { events: (EventModel & { pivot: EventVolunteerPivot })[] };
    eventsAttended: number;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Volunteers', href: route('volunteers.index') },
        { title: volunteer.name, href: route('volunteers.show', volunteer.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={volunteer.name} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            {volunteer.photo_path && <AvatarImage src={storageUrl(volunteer.photo_path)} />}
                            <AvatarFallback className="text-lg">{initials(volunteer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold">{volunteer.name}</h1>
                                <Badge variant={volunteer.status === 'active' ? 'default' : 'secondary'}>{volunteer.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">S/O {volunteer.father_name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('volunteers.card', volunteer.id)}>
                                <IdCard className="h-4 w-4" />
                                Recognition Card
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('volunteers.edit', volunteer.id)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{volunteer.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">CNIC</p>
                        <p className="font-medium">{volunteer.cnic}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Entry Date</p>
                        <p className="font-medium">{new Date(volunteer.joined_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Events Attended</p>
                        <p className="font-medium">{eventsAttended}</p>
                    </div>
                </div>

                <h2 className="text-lg font-semibold">Event History</h2>
                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Squad</TableHead>
                                <TableHead>Masjid</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Attendance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {volunteer.events.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No events yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {volunteer.events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <Link href={route('events.show', event.id)} className="hover:underline">
                                            {event.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{event.purpose?.name}</TableCell>
                                    <TableCell>{new Date(event.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{event.pivot.squad?.name}</TableCell>
                                    <TableCell>{event.pivot.masjid?.name}</TableCell>
                                    <TableCell>{event.pivot.volunteer_type?.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={attendanceVariant[event.pivot.attendance_status]}>
                                            {event.pivot.attendance_status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
