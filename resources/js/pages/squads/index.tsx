import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Squad } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Squads', href: route('squads.index') }];

export default function SquadsIndex({ squads }: { squads: Squad[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Squads" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Squads</h1>
                        <p className="text-sm text-muted-foreground">Manage the squad options volunteers can be assigned to.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('squads.create')}>
                            <Plus className="h-4 w-4" />
                            New Squad
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
                            {squads.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No squads found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {squads.map((squad) => (
                                <TableRow key={squad.id}>
                                    <TableCell className="font-medium">{squad.name}</TableCell>
                                    <TableCell>{squad.volunteers_count}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={squad.is_active}
                                                onCheckedChange={() => router.patch(route('squads.toggle', squad.id), {}, { preserveScroll: true })}
                                            />
                                            <Badge variant={squad.is_active ? 'default' : 'secondary'}>
                                                {squad.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('squads.edit', squad.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog
                                            title="Delete squad?"
                                            description={`This will permanently delete "${squad.name}". Squads with volunteers assigned cannot be deleted.`}
                                            onConfirm={() => router.delete(route('squads.destroy', squad.id))}
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
