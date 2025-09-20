import { SidebarTrigger } from '@/components/ui/sidebar';

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:h-16">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl md:text-2xl font-bold font-headline">{title}</h1>
    </header>
  );
}
