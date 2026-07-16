import { DataPagination } from '@/components/data-pagination';
import { DeleteDialog } from '@/components/delete-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { storageUrl } from '@/lib/storage-url';
import { type BreadcrumbItem, type Paginated, type Volunteer } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Eye, IdCard, Pencil, Plus, Search } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Volunteers', href: route('volunteers.index') }];

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function VolunteersIndex({
    volunteers,
    filters,
}: {
    volunteers: Paginated<Volunteer>;
    filters: { search?: string; status?: string };
}) {
    const { data, setData } = useForm({ search: filters.search ?? '', status: filters.status ?? 'all' });

    const applyFilters = (overrides: Partial<typeof data> = {}) => {
        const next = { ...data, ...overrides };
        router.get(
            route('volunteers.index'),
            { search: next.search || undefined, status: next.status !== 'all' ? next.status : undefined },
            { preserveState: true, replace: true },
        );
    };

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Volunteers" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Volunteers</h1>
                        <p className="text-sm text-muted-foreground">Track and manage your volunteer roster.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('volunteers.create')}>
                            <Plus className="h-4 w-4" />
                            New Volunteer
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <form onSubmit={search} className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name, phone, or CNIC..."
                            className="w-64"
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Volunteer</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>CNIC</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {volunteers.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No volunteers found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {volunteers.data.map((volunteer) => (
                                <TableRow key={volunteer.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                {volunteer.photo_path && <AvatarImage src={storageUrl(volunteer.photo_path)} />}
                                                <AvatarFallback>{initials(volunteer.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{volunteer.name}</div>
                                                <div className="text-sm text-muted-foreground">{volunteer.father_name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{volunteer.phone}</TableCell>
                                    <TableCell>{volunteer.cnic}</TableCell>
                                    <TableCell>{volunteer.events_count}</TableCell>
                                    <TableCell>
                                        <Badge variant={volunteer.status === 'active' ? 'default' : 'secondary'}>{volunteer.status}</Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('volunteers.show', volunteer.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('volunteers.card', volunteer.id)}>
                                                <IdCard className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('volunteers.edit', volunteer.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog
                                            title="Delete volunteer?"
                                            description={`This will permanently delete ${volunteer.name} and their event history.`}
                                            onConfirm={() => router.delete(route('volunteers.destroy', volunteer.id))}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination links={volunteers.links} from={volunteers.from} to={volunteers.to} total={volunteers.total} />
            </div>
        </AppLayout>
    );
}
