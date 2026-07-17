import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    permissions: string[];
    roles: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    permission?: string;
}

export interface Flash {
    success?: string;
    error?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: Flash;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    [key: string]: unknown;
}

export interface Purpose {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    events_count?: number;
    volunteers_count?: number;
    created_at: string;
    updated_at: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type AttendanceStatus = 'registered' | 'attended' | 'no_show';
export type VolunteerStatus = 'active' | 'inactive';

export interface EventVolunteerPivot {
    registered_at: string;
    attendance_status: AttendanceStatus;
    squad_id: number;
    masjid_id: number;
    volunteer_type_id: number;
    squad?: Squad;
    masjid?: Masjid;
    volunteer_type?: VolunteerType;
}

export interface Squad {
    id: number;
    name: string;
    is_active: boolean;
    volunteers_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Masjid {
    id: number;
    name: string;
    is_active: boolean;
    volunteers_count?: number;
    created_at: string;
    updated_at: string;
}

export interface VolunteerType {
    id: number;
    name: string;
    is_active: boolean;
    volunteers_count?: number;
    created_at: string;
    updated_at: string;
}

export interface EventModel {
    id: number;
    purpose_id: number;
    purpose?: Purpose;
    name: string;
    slug: string;
    description: string | null;
    location: string | null;
    start_date: string;
    end_date: string | null;
    status: EventStatus;
    volunteers_count?: number;
    volunteers?: (VolunteerListItem & { pivot: EventVolunteerPivot })[];
    created_at: string;
    updated_at: string;
}

export interface VolunteerListItem {
    id: number;
    name: string;
    phone: string;
}

export interface VolunteerImportSkippedRow {
    row: number;
    reason: string;
}

export interface VolunteerImportResults {
    total: number;
    imported: number;
    skipped: VolunteerImportSkippedRow[];
}

export interface LatestAssignment {
    squad: Squad | null;
    masjid: Masjid | null;
    volunteer_type: VolunteerType | null;
}

export interface Volunteer {
    id: number;
    name: string;
    father_name: string;
    phone: string;
    cnic: string | null;
    photo_path: string | null;
    status: VolunteerStatus;
    joined_date: string;
    events_count?: number;
    events?: (EventModel & { pivot: EventVolunteerPivot })[];
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    users_count?: number;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

export interface Activity {
    id: number;
    log_name: string;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    causer: { id: number; name: string } | null;
    event: string | null;
    properties: Record<string, unknown>;
    created_at: string;
}

export interface Report {
    id: number;
    name: string;
    description: string | null;
    purpose_id: number | null;
    event_id: number | null;
    squad_id: number | null;
    masjid_id: number | null;
    volunteer_type_id: number | null;
    columns: string[] | null;
    purpose?: Purpose | null;
    event?: EventModel | null;
    squad?: Squad | null;
    masjid?: Masjid | null;
    volunteer_type?: VolunteerType | null;
    creator?: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
}

export interface ReportFilters {
    purpose_id: number | null;
    event_id: number | null;
    squad_id: number | null;
    masjid_id: number | null;
    volunteer_type_id: number | null;
}

export interface ReportRegistration {
    id: number;
    registered_at: string;
    attendance_status: AttendanceStatus;
    volunteer: {
        id: number;
        name: string;
        father_name: string;
        phone: string;
        cnic: string | null;
        status: VolunteerStatus;
        joined_date: string;
    };
    event: {
        id: number;
        name: string;
        location: string | null;
        start_date: string;
        end_date: string | null;
        status: EventStatus;
        purpose?: { id: number; name: string } | null;
    };
    squad: Squad | null;
    masjid: Masjid | null;
    volunteer_type: VolunteerType | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}
