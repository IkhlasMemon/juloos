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
import { type BreadcrumbItem, type Paginated, type SharedData, type Volunteer } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, IdCard, Pencil, Plus, Search, Upload } from 'lucide-react';
import { FormEventHandler, useEffect, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Volunteers', href: route('volunteers.index') }];

const sortableColumns = [
    { key: 'name', label: 'Volunteer' },
    { key: 'phone', label: 'Phone' },
    { key: 'cnic', label: 'CNIC' },
    { key: 'events_count', label: 'Events' },
    { key: 'status', label: 'Status' },
] as const;

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
    sort,
    direction,
}: {
    volunteers: Paginated<Volunteer>;
    filters: { search?: string; status?: string };
    sort: string;
    direction: 'asc' | 'desc';
}) {
    const { auth } = usePage<SharedData>().props;
    const canImport = (auth.permissions ?? []).includes('import volunteers');

    const { data, setData } = useForm({ search: filters.search ?? '', status: filters.status ?? 'all' });

    const applyFilters = (overrides: Partial<typeof data> = {}) => {
        const next = { ...data, ...overrides };
        router.get(
            route('volunteers.index'),
            {
                search: next.search || undefined,
                status: next.status !== 'all' ? next.status : undefined,
                sort,
                direction,
            },
            { preserveState: true, replace: true },
        );
    };

    const toggleSort = (column: string) => {
        router.get(
            route('volunteers.index'),
            {
                search: data.search || undefined,
                status: data.status !== 'all' ? data.status : undefined,
                sort: column,
                direction: sort === column && direction === 'asc' ? 'desc' : 'asc',
            },
            { preserveState: true, replace: true },
        );
    };

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        searchTimeout.current = setTimeout(() => applyFilters(), 400);

        return () => clearTimeout(searchTimeout.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.search]);

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        clearTimeout(searchTimeout.current);
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
                    <div className="flex items-center gap-2">
                        {canImport && (
                            <Button variant="outline" asChild>
                                <Link href={route('volunteers.import')}>
                                    <Upload className="h-4 w-4" />
                                    Import
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={route('volunteers.create')}>
                                <Plus className="h-4 w-4" />
                                New Volunteer
                            </Link>
                        </Button>
                    </div>
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
                                {sortableColumns.map((column) => (
                                    <TableHead key={column.key}>
                                        <button
                                            type="button"
                                            onClick={() => toggleSort(column.key)}
                                            className="flex items-center gap-1 hover:text-foreground"
                                        >
                                            {column.label}
                                            {sort === column.key ? (
                                                direction === 'asc' ? (
                                                    <ArrowUp className="h-3.5 w-3.5" />
                                                ) : (
                                                    <ArrowDown className="h-3.5 w-3.5" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                                            )}
                                        </button>
                                    </TableHead>
                                ))}
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
                                    <TableCell>{volunteer.cnic ?? '—'}</TableCell>
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
