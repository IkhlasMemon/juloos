import { DataPagination } from '@/components/data-pagination';
import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type EventModel, type EventStatus, type Paginated, type Purpose } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Events', href: route('events.index') }];

const statusVariant: Record<EventStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    upcoming: 'default',
    ongoing: 'secondary',
    completed: 'outline',
    cancelled: 'destructive',
};

export default function EventsIndex({
    events,
    purposes,
    filters,
}: {
    events: Paginated<EventModel>;
    purposes: Purpose[];
    filters: { search?: string; status?: string; purpose_id?: string };
}) {
    const { data, setData } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? 'all',
        purpose_id: filters.purpose_id ?? 'all',
    });

    const applyFilters = (overrides: Partial<typeof data> = {}) => {
        const next = { ...data, ...overrides };
        router.get(
            route('events.index'),
            {
                search: next.search || undefined,
                status: next.status !== 'all' ? next.status : undefined,
                purpose_id: next.purpose_id !== 'all' ? next.purpose_id : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Events</h1>
                        <p className="text-sm text-muted-foreground">Manage volunteer events and their rosters.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('events.create')}>
                            <Plus className="h-4 w-4" />
                            New Event
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <form onSubmit={search} className="flex items-center gap-2">
                        <Input
                            placeholder="Search events..."
                            className="w-56"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                        <Button type="submit" variant="secondary" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    <Select
                        value={data.status}
                        onValueChange={(value) => {
                            setData('status', value);
                            applyFilters({ status: value });
                        }}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={data.purpose_id}
                        onValueChange={(value) => {
                            setData('purpose_id', value);
                            applyFilters({ purpose_id: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Purpose" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All purposes</SelectItem>
                            {purposes.map((purpose) => (
                                <SelectItem key={purpose.id} value={String(purpose.id)}>
                                    {purpose.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>Volunteers</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No events found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {events.data.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div className="font-medium">{event.name}</div>
                                        {event.location && <div className="text-sm text-muted-foreground">{event.location}</div>}
                                    </TableCell>
                                    <TableCell>{event.purpose?.name}</TableCell>
                                    <TableCell>{new Date(event.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{event.volunteers_count}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[event.status]}>{event.status}</Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('events.show', event.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('events.edit', event.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog
                                            title="Delete event?"
                                            description={`This will permanently delete "${event.name}" and all its volunteer registrations.`}
                                            onConfirm={() => router.delete(route('events.destroy', event.id))}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination links={events.links} from={events.from} to={events.to} total={events.total} />
            </div>
        </AppLayout>
    );
}
