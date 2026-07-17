import { DataPagination } from '@/components/data-pagination';
import { DeleteDialog } from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Paginated, type Report, type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reports', href: route('reports.index') }];

export default function ReportsIndex({ reports, filters }: { reports: Paginated<Report>; filters: { search?: string } }) {
    const { auth } = usePage<SharedData>().props;
    const canManage = (auth.permissions ?? []).includes('manage reports');

    const { data, setData } = useForm({ search: filters.search ?? '' });

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route('reports.index'), { search: data.search || undefined }, { preserveState: true, replace: true });
    };

    const filterBadges = (report: Report) =>
        [report.purpose?.name, report.event?.name, report.squad?.name, report.masjid?.name, report.volunteer_type?.name].filter(Boolean);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Reports</h1>
                        <p className="text-sm text-muted-foreground">Saved volunteer reports filtered by purpose, event, squad, masjid, or type.</p>
                    </div>
                    {canManage && (
                        <Button asChild>
                            <Link href={route('reports.create')}>
                                <Plus className="h-4 w-4" />
                                New Report
                            </Link>
                        </Button>
                    )}
                </div>

                <form onSubmit={search} className="flex items-center gap-2">
                    <Input placeholder="Search reports..." className="w-56" value={data.search} onChange={(e) => setData('search', e.target.value)} />
                    <Button type="submit" variant="secondary" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Filters</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No reports found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {reports.data.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <div className="font-medium">{report.name}</div>
                                        {report.description && <div className="text-sm text-muted-foreground">{report.description}</div>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {filterBadges(report).length === 0 ? (
                                                <span className="text-sm text-muted-foreground">All registrations</span>
                                            ) : (
                                                filterBadges(report).map((label) => (
                                                    <Badge key={label} variant="secondary">
                                                        {label}
                                                    </Badge>
                                                ))
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{report.creator?.name ?? '—'}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('reports.show', report.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {canManage && (
                                            <>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('reports.edit', report.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteDialog
                                                    title="Delete report?"
                                                    description={`This will permanently delete "${report.name}".`}
                                                    onConfirm={() => router.delete(route('reports.destroy', report.id))}
                                                />
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination links={reports.links} from={reports.from} to={reports.to} total={reports.total} />
            </div>
        </AppLayout>
    );
}
