import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Area, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Areas', href: route('areas.index') }];

export default function AreasIndex({ areas }: { areas: Area[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Areas" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Areas</h1>
                        <p className="text-sm text-muted-foreground">Manage the area options available on the volunteer form.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('areas.create')}>
                            <Plus className="h-4 w-4" />
                            New Area
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Volunteers</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areas.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No areas found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {areas.map((area) => (
                                <TableRow key={area.id}>
                                    <TableCell className="font-medium">{area.name}</TableCell>
                                    <TableCell>{area.volunteers_count}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={area.is_active}
                                                onCheckedChange={() => router.patch(route('areas.toggle', area.id), {}, { preserveScroll: true })}
                                            />
                                            <Badge variant={area.is_active ? 'default' : 'secondary'}>
                                                {area.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('areas.edit', area.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog
                                            title="Delete area?"
                                            description={`This will permanently delete "${area.name}". Areas with volunteers assigned cannot be deleted.`}
                                            onConfirm={() => router.delete(route('areas.destroy', area.id))}
                                        />
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
