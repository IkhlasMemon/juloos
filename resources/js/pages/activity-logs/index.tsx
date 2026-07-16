import { DataPagination } from '@/components/data-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Activity, type BreadcrumbItem, type Paginated } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Activity Logs', href: route('activity-logs.index') }];

const eventVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    created: 'default',
    updated: 'secondary',
    deleted: 'destructive',
};

export default function ActivityLogsIndex({
    logs,
    logNames,
    filters,
}: {
    logs: Paginated<Activity>;
    logNames: string[];
    filters: { search?: string; log_name?: string };
}) {
    const { data, setData } = useForm({ search: filters.search ?? '', log_name: filters.log_name ?? 'all' });

    const applyFilters = (overrides: Partial<typeof data> = {}) => {
        const next = { ...data, ...overrides };
        router.get(
            route('activity-logs.index'),
            { search: next.search || undefined, log_name: next.log_name !== 'all' ? next.log_name : undefined },
            { preserveState: true, replace: true },
        );
    };

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Activity Logs</h1>
                    <p className="text-sm text-muted-foreground">Audit trail of changes made across the system.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <form onSubmit={search} className="flex items-center gap-2">
                        <Input
                            placeholder="Search description..."
                            className="w-64"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                        <Button type="submit" variant="secondary" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    <Select
                        value={data.log_name}
                        onValueChange={(value) => {
                            setData('log_name', value);
                            applyFilters({ log_name: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            {logNames.map((name) => (
                                <SelectItem key={name} value={name} className="capitalize">
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Causer</TableHead>
                                <TableHead>When</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No activity recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {logs.data.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.description}</TableCell>
                                    <TableCell className="capitalize">{log.log_name}</TableCell>
                                    <TableCell>
                                        {log.event && <Badge variant={eventVariant[log.event] ?? 'outline'}>{log.event}</Badge>}
                                    </TableCell>
                                    <TableCell>{log.causer?.name ?? 'System'}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DataPagination links={logs.links} from={logs.from} to={logs.to} total={logs.total} />
            </div>
        </AppLayout>
    );
}
