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
  Bot,
} from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/assessment', icon: ClipboardCheck, label: 'InsightX Assessment' },
  { href: '/pathxplore', icon: Compass, label: 'PathXplore Career' },
  { href: '/goals', icon: Goal, label: 'GoalMint Planner' },
  { href: '/mentors', icon: Bot, label: 'MentorSuite AI' },
  { href: '/reports', icon: FileText, label: 'Reports' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="h-7 w-7" />
          <span className="font-headline text-xl font-semibold">Path-GeniX™</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
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
    </Sidebar>
  );
}
