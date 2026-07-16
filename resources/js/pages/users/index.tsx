import { DataPagination } from '@/components/data-pagination';
import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Paginated, type SharedData, type User } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: route('users.index') }];

export default function UsersIndex({ users, filters }: { users: Paginated<User>; filters: { search?: string } }) {
    const { data, setData } = useForm({ search: filters.search ?? '' });
    const currentUser = usePage<SharedData>().props.auth.user;

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route('users.index'), { search: data.search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Users</h1>
                        <p className="text-sm text-muted-foreground">Manage staff accounts that can access this system.</p>
                    </div>
                    <Button asChild>
                        <Link href={route('users.create')}>
                            <Plus className="h-4 w-4" />
                            New User
                        </Link>
                    </Button>
                </div>

                <form onSubmit={search} className="flex max-w-sm items-center gap-2">
                    <Input placeholder="Search users..." value={data.search} onChange={(e) => setData('search', e.target.value)} />
                    <Button type="submit" variant="secondary" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.roles?.map((role) => (
                                            <Badge key={role.id} variant="outline">
                                                {role.name}
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('users.edit', user.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {user.id !== currentUser.id && (
                                            <DeleteDialog
                                                title="Delete user?"
                                                description={`This will permanently delete ${user.name}'s account.`}
                                                onConfirm={() => router.delete(route('users.destroy', user.id))}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination links={users.links} from={users.from} to={users.to} total={users.total} />
            </div>
        </AppLayout>
    );
}
