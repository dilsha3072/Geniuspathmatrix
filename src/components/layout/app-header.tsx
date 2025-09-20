import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AppHeaderProps = {
  title: string;
  showAuthButtons?: boolean;
};

export function AppHeader({ title, showAuthButtons = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:h-16">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl md:text-2xl font-bold font-headline">{title}</h1>
      {showAuthButtons && (
        <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="#">Log In</Link>
            </Button>
            <Button asChild>
                <Link href="#">Sign Up</Link>
            </Button>
        </div>
      )}
    </header>
  );
}
