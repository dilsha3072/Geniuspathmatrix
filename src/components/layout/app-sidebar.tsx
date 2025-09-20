'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardCheck,
  Compass,
  Goal,
  Users,
  FileText,
  GraduationCap,
  Settings,
  CircleHelp,
} from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/assessment', icon: ClipboardCheck, label: 'Assessment' },
  { href: '/goals', icon: Goal, label: 'Goal Plan' },
  { href: '/mentors', icon: Users, label: 'Mentors' },
  { href: '/reports', icon: FileText, label: 'Reports' },
];

const bottomNavItems = [
    { href: '/help', icon: CircleHelp, label: 'Help' },
    { href: '/settings', icon: Settings, label: 'Settings' },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-7 w-7" />
              <span className="font-headline text-lg font-semibold">Path-GeniX</span>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
