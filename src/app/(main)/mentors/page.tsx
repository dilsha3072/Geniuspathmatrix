'use client';

import * as React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mentors } from '@/lib/data';
import type { Mentor } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

function BookingDialog({ mentor }: { mentor: Mentor }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState<string | undefined>();
  const { toast } = useToast();

  const handleBooking = () => {
    if (date && time) {
      toast({
        title: 'Session Booked!',
        description: `Your session with ${mentor.name} is confirmed for ${date.toLocaleDateString()} at ${time}.`,
        action: <CheckCircle className="text-green-500" />,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Incomplete Information',
        description: 'Please select a date and time for your session.',
      });
    }
  };

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Book Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Book a session with {mentor.name}</DialogTitle>
          <DialogDescription>{mentor.title}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div>
            <h4 className="font-semibold mb-4 text-center">Select a Date</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mx-auto"
              disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
            />
          </div>
          <div>
            <h4 className="font-semibold mb-4">Select a Time</h4>
            {date ? (
              <RadioGroup value={time} onValueChange={setTime} className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <div key={slot}>
                    <RadioGroupItem value={slot} id={slot} className="peer sr-only" />
                    <Label
                      htmlFor={slot}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      {slot}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="text-sm text-muted-foreground">Please select a date first.</p>
            )}
          </div>
        </div>
        <CardFooter className="mt-6 p-0">
          <Button className="w-full" size="lg" onClick={handleBooking} disabled={!date || !time}>Confirm Booking</Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  const image = PlaceHolderImages.find((img) => img.id === mentor.imageId);
  const fallback = mentor.name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
          {image ? (
            <Image src={image.imageUrl} alt={mentor.name} width={96} height={96} data-ai-hint={image.imageHint} />
          ) : (
            <AvatarFallback>{fallback}</AvatarFallback>
          )}
        </Avatar>
        <CardTitle className="font-headline">{mentor.name}</CardTitle>
        <CardDescription>{mentor.title}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm font-semibold mb-2">Specialties:</p>
        <div className="flex flex-wrap gap-2">
          {mentor.specialties.map(spec => (
            <Badge key={spec} variant="secondary">{spec}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <BookingDialog mentor={mentor} />
      </CardFooter>
    </Card>
  );
}

export default function MentorsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Mentor Suite" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="space-y-1 mb-8">
                <h2 className="text-3xl font-bold font-headline tracking-tight">Find Your Mentor</h2>
                <p className="text-muted-foreground">Connect with industry experts to guide you on your journey.</p>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
