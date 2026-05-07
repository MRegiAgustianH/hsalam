import { Link, usePage } from '@inertiajs/react';
import {
    BookOpenCheck,
    CalendarDays,
    GraduationCap,
    LayoutGrid,
    School,
    Target,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Tahun Ajaran',
        href: '/admin/tahun-ajaran',
        icon: CalendarDays,
    },
    {
        title: 'Kelas',
        href: '/admin/kelas',
        icon: School,
    },
    {
        title: 'Siswa',
        href: '/admin/siswa',
        icon: GraduationCap,
    },
    {
        title: 'Guru',
        href: '/admin/guru',
        icon: Users,
    },
    {
        title: 'Target Hafalan',
        href: '/target-hafalan',
        icon: Target,
    },
    {
        title: 'Setoran Hafalan',
        href: '/setoran',
        icon: BookOpenCheck,
    },
];

const guruNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Target Hafalan',
        href: '/target-hafalan',
        icon: Target,
    },
    {
        title: 'Setoran Hafalan',
        href: '/setoran',
        icon: BookOpenCheck,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const navItems = auth.user.role === 'admin' ? adminNavItems : guruNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
