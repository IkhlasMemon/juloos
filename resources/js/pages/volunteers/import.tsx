import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type VolunteerImportResults } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Download, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Volunteers', href: route('volunteers.index') },
    { title: 'Import', href: route('volunteers.import') },
];

export default function VolunteerImport({ results }: { results?: VolunteerImportResults }) {
    const { data, setData, post, processing, errors } = useForm({ file: null as File | null });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('volunteers.import.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Volunteers" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Import Volunteers</h1>
                    <p className="text-sm text-muted-foreground">Bulk-create volunteers from a CSV file.</p>
                </div>

                <div className="max-w-2xl space-y-4 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <p>The CSV must include these column headers in the first row:</p>
                        <p className="font-mono text-xs">name, father_name, phone, cnic, status, joined_date</p>
                        <ul className="list-disc space-y-0.5 pl-5">
                            <li>Phone must be formatted like 0333-3333333.</li>
                            <li>CNIC is optional; if provided it must be formatted like 99999-9999999-9 and be unique.</li>
                            <li>Status must be "active" or "inactive".</li>
                            <li>Joined date must be a valid date (e.g. 2026-07-18).</li>
                        </ul>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                        <a href={route('volunteers.import.template')}>
                            <Download className="h-4 w-4" />
                            Download Template
                        </a>
                    </Button>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="file">CSV File</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.file} />
                        </div>

                        <Button type="submit" disabled={processing || !data.file}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Import
                        </Button>
                    </form>
                </div>

                {results && (
                    <div className="max-w-2xl space-y-4 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Import Results</h2>
                            <Badge variant={results.skipped.length === 0 ? 'default' : 'secondary'}>
                                {results.imported} of {results.total} imported
                            </Badge>
                        </div>

                        {results.skipped.length > 0 && (
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Row</TableHead>
                                            <TableHead>Reason Skipped</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.skipped.map((skipped) => (
                                            <TableRow key={skipped.row}>
                                                <TableCell>{skipped.row}</TableCell>
                                                <TableCell className="text-destructive">{skipped.reason}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
