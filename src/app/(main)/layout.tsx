
'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-1 flex-col">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
