import { DataPagination } from '@/components/data-pagination';
import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Paginated, type Purpose } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Purposes', href: route('purposes.index') }];

export default function PurposesIndex({ purposes, filters }: { purposes: Paginated<Purpose>; filters: { search?: string } }) {
    const { data, setData } = useForm({ search: filters.search ?? '' });

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route('purposes.index'), { search: data.search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purposes" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Purposes</h1>
                        <p className="text-sm text-muted-foreground">Categories that group volunteer events together.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('purposes.create')}>
                            <Plus className="h-4 w-4" />
                            New Purpose
                        </Link>
                    </Button>
                </div>

                <form onSubmit={search} className="flex max-w-sm items-center gap-2">
                    <Input placeholder="Search purposes..." value={data.search} onChange={(e) => setData('search', e.target.value)} />
                    <Button type="submit" variant="secondary" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead>Volunteers</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purposes.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No purposes found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {purposes.data.map((purpose) => (
                                <TableRow key={purpose.id}>
                                    <TableCell>
                                        <div className="font-medium">{purpose.name}</div>
                                        {purpose.description && (
                                            <div className="max-w-md truncate text-sm text-muted-foreground">{purpose.description}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>{purpose.events_count}</TableCell>
                                    <TableCell>{purpose.volunteers_count}</TableCell>
                                    <TableCell>
                                        <Badge variant={purpose.is_active ? 'default' : 'secondary'}>
                                            {purpose.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('purposes.edit', purpose.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog
                                            title="Delete purpose?"
                                            description={`This will permanently delete "${purpose.name}". Events under this purpose must be removed first.`}
                                            onConfirm={() => router.delete(route('purposes.destroy', purpose.id))}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination links={purposes.links} from={purposes.from} to={purposes.to} total={purposes.total} />
            </div>
        </AppLayout>
    );
}
