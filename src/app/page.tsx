import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');

  return (
    <main className="flex min-h-screen flex-col">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="h-7 w-7" />
          <h1 className="text-2xl font-bold font-headline">Path-GeniX™</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="#">Log In</Link>
            </Button>
            <Button asChild>
                <Link href="#">Sign Up</Link>
            </Button>
        </div>
      </header>
      <section className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
            Find Your Future, Today.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Path-GeniX™ guides you through a structured career discovery journey. Uncover your strengths, explore paths, and build a plan for success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Start Your Journey <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="#">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-96 lg:h-auto lg:aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
      </section>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Path-GeniX™. All rights reserved.</p>
      </footer>
    </main>
  );
}
