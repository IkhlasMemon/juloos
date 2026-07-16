import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { storageUrl } from '@/lib/storage-url';
import { type BreadcrumbItem, type LatestAssignment, type Volunteer } from '@/types';
import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function VolunteerCard({
    volunteer,
    eventsAttended,
    latestAssignment,
}: {
    volunteer: Volunteer;
    eventsAttended: number;
    latestAssignment: LatestAssignment | null;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Volunteers', href: route('volunteers.index') },
        { title: volunteer.name, href: route('volunteers.show', volunteer.id) },
        { title: 'Recognition Card', href: route('volunteers.card', volunteer.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${volunteer.name} — Recognition Card`} />
            <div className="flex flex-1 flex-col items-center gap-6 p-4">
                <div className="flex w-full max-w-sm items-center justify-between">
                    <h1 className="text-xl font-semibold">Recognition Card</h1>
                    <Button asChild>
                        <a href={route('volunteers.card.download', volunteer.id)}>
                            <Download className="h-4 w-4" />
                            Download PDF
                        </a>
                    </Button>
                </div>

                <div className="w-full max-w-sm overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background shadow-lg">
                    <div className="bg-primary px-6 py-4 text-primary-foreground">
                        <p className="text-xs uppercase tracking-widest opacity-80">Volunteer Recognition</p>
                        <p className="text-lg font-semibold">Juloos Volunteer Program</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                        <Avatar className="h-24 w-24 border-4 border-background shadow">
                            {volunteer.photo_path && <AvatarImage src={storageUrl(volunteer.photo_path)} />}
                            <AvatarFallback className="text-2xl">{initials(volunteer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xl font-bold">{volunteer.name}</p>
                            <p className="text-sm text-muted-foreground">S/O {volunteer.father_name}</p>
                        </div>

                        <div className="mt-4 grid w-full grid-cols-2 gap-4 border-t pt-4 text-left">
                            <div>
                                <p className="text-xs text-muted-foreground">Squad</p>
                                <p className="font-medium">{latestAssignment?.squad?.name ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Masjid</p>
                                <p className="font-medium">{latestAssignment?.masjid?.name ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Type</p>
                                <p className="font-medium">{latestAssignment?.volunteer_type?.name ?? '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">CNIC</p>
                                <p className="font-medium">{volunteer.cnic}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Events Attended</p>
                                <p className="font-medium">{eventsAttended}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted px-6 py-3 text-center text-xs text-muted-foreground">Volunteer ID #{volunteer.id}</div>
                </div>
            </div>
        </AppLayout>
    );
}
