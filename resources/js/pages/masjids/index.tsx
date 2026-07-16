import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Masjid } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Masjids', href: route('masjids.index') }];

export default function MasjidsIndex({ masjids }: { masjids: Masjid[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Masjids" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Masjids</h1>
                        <p className="text-sm text-muted-foreground">Manage the masjid options volunteers can be assigned to.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('masjids.create')}>
                            <Plus className="h-4 w-4" />
                            New Masjid
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
                            {masjids.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No masjids found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {masjids.map((masjid) => (
                                <TableRow key={masjid.id}>
                                    <TableCell className="font-medium">{masjid.name}</TableCell>
                                    <TableCell>{masjid.volunteers_count}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={masjid.is_active}
                                                onCheckedChange={() =>
                                                    router.patch(route('masjids.toggle', masjid.id), {}, { preserveScroll: true })
                                                }
                                            />
                                            <Badge variant={masjid.is_active ? 'default' : 'secondary'}>
                                                {masjid.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('masjids.edit', masjid.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog
                                            title="Delete masjid?"
                                            description={`This will permanently delete "${masjid.name}". Masjids with volunteers assigned cannot be deleted.`}
                                            onConfirm={() => router.delete(route('masjids.destroy', masjid.id))}
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
