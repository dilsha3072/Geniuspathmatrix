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
  Bot,
  FileText,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
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
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-7 w-7" />
              <span className="font-headline text-lg font-semibold">Path-GeniX™</span>
            </div>
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
      </SidebarFooter>
    </Sidebar>
  );
}
