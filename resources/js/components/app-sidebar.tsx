import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    ClipboardList,
    FileBarChart,
    LayoutGrid,
    Shield,
    ShieldCheck,
    Tags,
    Target,
    Users,
    UsersRound,
} from 'lucide-react';
import AppLogo from './app-logo';

const platformNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: route('dashboard'),
        icon: LayoutGrid,
        permission: 'view dashboard',
    },
    {
        title: 'Volunteers',
        url: route('volunteers.index'),
        icon: UsersRound,
        permission: 'manage volunteers',
    },
    {
        title: 'Events',
        url: route('events.index'),
        icon: CalendarDays,
        permission: 'manage events',
    },
    {
        title: 'Purposes',
        url: route('purposes.index'),
        icon: Target,
        permission: 'manage purposes',
    },
    {
        title: 'Reports',
        url: route('reports.index'),
        icon: FileBarChart,
        permission: 'view reports',
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Squads',
        url: route('squads.index'),
        icon: Shield,
        permission: 'manage lookups',
    },
    {
        title: 'Masjids',
        url: route('masjids.index'),
        icon: Building2,
        permission: 'manage lookups',
    },
    {
        title: 'Volunteer Types',
        url: route('volunteer-types.index'),
        icon: Tags,
        permission: 'manage lookups',
    },
    {
        title: 'Activity Logs',
        url: route('activity-logs.index'),
        icon: ClipboardList,
        permission: 'view activity logs',
    },
    {
        title: 'Users',
        url: route('users.index'),
        icon: Users,
        permission: 'manage users',
    },
    {
        title: 'Roles',
        url: route('roles.index'),
        icon: ShieldCheck,
        permission: 'manage roles',
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const permissions = auth.permissions ?? [];

    const platformItems = platformNavItems.filter((item) => !item.permission || permissions.includes(item.permission));
    const adminItems = adminNavItems.filter((item) => !item.permission || permissions.includes(item.permission));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="h-16 justify-center py-2" asChild>
                            <Link href={route('dashboard')} prefetch className="flex w-full justify-center">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={platformItems} label="Platform" />
                <NavMain items={adminItems} label="Admin Setting" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
