import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type Activity, type BreadcrumbItem, type EventModel } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarClock, ClipboardCheck, ClipboardList, Target, UserCheck, UsersRound } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Stats {
    totalVolunteers: number;
    activeVolunteers: number;
    totalEvents: number;
    upcomingEvents: number;
    totalPurposes: number;
    totalRegistrations: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: route('dashboard') }];

export default function Dashboard({
    stats,
    volunteersPerPurpose,
    recentActivity,
    upcomingEventsList,
}: {
    stats: Stats;
    volunteersPerPurpose: { name: string; volunteers_count: number }[];
    recentActivity: Activity[];
    upcomingEventsList: EventModel[];
}) {
    const cards = [
        { label: 'Total Volunteers', value: stats.totalVolunteers, icon: UsersRound, sub: `${stats.activeVolunteers} active` },
        { label: 'Total Events', value: stats.totalEvents, icon: CalendarClock, sub: `${stats.upcomingEvents} upcoming` },
        { label: 'Purposes', value: stats.totalPurposes, icon: Target },
        { label: 'Event Registrations', value: stats.totalRegistrations, icon: ClipboardCheck },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Card key={card.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                                <card.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                                {card.sub && <p className="text-xs text-muted-foreground">{card.sub}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Volunteers per Purpose</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {volunteersPerPurpose.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No data yet.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={volunteersPerPurpose}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="volunteers_count" name="Volunteers" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4" />
                                Upcoming Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingEventsList.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events.</p>}
                            {upcomingEventsList.map((event) => (
                                <Link
                                    key={event.id}
                                    href={route('events.show', event.id)}
                                    className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-accent"
                                >
                                    <div>
                                        <p className="font-medium">{event.name}</p>
                                        <p className="text-xs text-muted-foreground">{event.purpose?.name}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{new Date(event.start_date).toLocaleDateString()}</span>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentActivity.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet.</p>}
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between border-b pb-2 text-sm last:border-0 last:pb-0">
                                <div className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                                    <span>{activity.description}</span>
                                    {activity.event && (
                                        <Badge variant="outline" className="capitalize">
                                            {activity.event}
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {activity.causer?.name ?? 'System'} · {new Date(activity.created_at).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
