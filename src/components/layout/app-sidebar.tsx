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
  LayoutDashboard,
  ClipboardList,
  Target,
  Users,
  LifeBuoy,
  Settings,
  Compass,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/assessment', icon: ClipboardList, label: 'Assessment' },
  { href: '/goals', icon: Target, label: 'Goal Planning' },
  { href: '/mentors', icon: Users, label: 'Mentor Suite' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/dashboard">
              <Compass className="text-primary" />
            </Link>
          </Button>
          <span className="font-headline text-lg font-semibold">CareerCompass</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Help', side: 'right' }}>
              <LifeBuoy />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Settings', side: 'right' }}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
