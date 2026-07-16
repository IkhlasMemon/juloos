import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type VolunteerType } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Volunteer Types', href: route('volunteer-types.index') }];

export default function VolunteerTypesIndex({ volunteerTypes }: { volunteerTypes: VolunteerType[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Volunteer Types" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Volunteer Types</h1>
                        <p className="text-sm text-muted-foreground">Manage the volunteer type options available on the volunteer form.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('volunteer-types.create')}>
                            <Plus className="h-4 w-4" />
                            New Type
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
                            {volunteerTypes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No volunteer types found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {volunteerTypes.map((volunteerType) => (
                                <TableRow key={volunteerType.id}>
                                    <TableCell className="font-medium">{volunteerType.name}</TableCell>
                                    <TableCell>{volunteerType.volunteers_count}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={volunteerType.is_active}
                                                onCheckedChange={() =>
                                                    router.patch(route('volunteer-types.toggle', volunteerType.id), {}, { preserveScroll: true })
                                                }
                                            />
                                            <Badge variant={volunteerType.is_active ? 'default' : 'secondary'}>
                                                {volunteerType.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('volunteer-types.edit', volunteerType.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog
                                            title="Delete volunteer type?"
                                            description={`This will permanently delete "${volunteerType.name}". Types with volunteers assigned cannot be deleted.`}
                                            onConfirm={() => router.delete(route('volunteer-types.destroy', volunteerType.id))}
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
