import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCnic, formatPhone } from '@/lib/format';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Volunteers', href: route('volunteers.index') },
    { title: 'New Volunteer', href: route('volunteers.create') },
];

export default function VolunteerCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        father_name: '',
        phone: '',
        cnic: '',
        photo: null as File | null,
        status: 'active',
        joined_date: new Date().toISOString().slice(0, 10),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('volunteers.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Volunteer" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">New Volunteer</h1>
                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="father_name">Father Name</Label>
                            <Input id="father_name" value={data.father_name} onChange={(e) => setData('father_name', e.target.value)} />
                            <InputError message={errors.father_name} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                placeholder="0333-3333333"
                                value={data.phone}
                                onChange={(e) => setData('phone', formatPhone(e.target.value))}
                            />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cnic">CNIC</Label>
                            <Input
                                id="cnic"
                                placeholder="99999-9999999-9"
                                value={data.cnic}
                                onChange={(e) => setData('cnic', formatCnic(e.target.value))}
                            />
                            <InputError message={errors.cnic} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="photo">Photo</Label>
                        <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
                        />
                        <InputError message={errors.photo} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="joined_date">Entry Date</Label>
                            <Input id="joined_date" type="date" value={data.joined_date} onChange={(e) => setData('joined_date', e.target.value)} />
                            <InputError message={errors.joined_date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create Volunteer
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
