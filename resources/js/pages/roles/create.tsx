import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: route('roles.index') },
    { title: 'New Role', href: route('roles.create') },
];

export default function RoleCreate({ permissions }: { permissions: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const togglePermission = (permission: string, checked: boolean) => {
        setData('permissions', checked ? [...data.permissions, permission] : data.permissions.filter((p) => p !== permission));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Role" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">New Role</h1>
                <form onSubmit={submit} className="max-w-xl space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Permissions</Label>
                        <div className="grid gap-3 rounded-lg border p-4">
                            {permissions.map((permission) => (
                                <div key={permission} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`permission-${permission}`}
                                        checked={data.permissions.includes(permission)}
                                        onCheckedChange={(checked) => togglePermission(permission, checked === true)}
                                    />
                                    <Label htmlFor={`permission-${permission}`} className="font-normal capitalize">
                                        {permission}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.permissions} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create Role
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
