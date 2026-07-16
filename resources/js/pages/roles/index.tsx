import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: route('roles.index') }];

export default function RolesIndex({ roles }: { roles: Role[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Roles</h1>
                        <p className="text-sm text-muted-foreground">Define what each role is allowed to do.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('roles.create')}>
                            <Plus className="h-4 w-4" />
                            New Role
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Users</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.name}</TableCell>
                                    <TableCell className="max-w-md">
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions?.map((permission) => (
                                                <Badge key={permission.id} variant="outline">
                                                    {permission.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{role.users_count}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        {role.name !== 'Super Admin' && (
                                            <>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('roles.edit', role.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteDialog
                                                    title="Delete role?"
                                                    description={`This will permanently delete the "${role.name}" role. Users with this role will lose its permissions.`}
                                                    onConfirm={() => router.delete(route('roles.destroy', role.id))}
                                                />
                                            </>
                                        )}
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
