import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, Phone, MessageSquare } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <LifeBuoy className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline text-foreground tracking-tight">
          Priority Support
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          As a Golden Access member, you're our top priority. Get expedited help from our dedicated support team.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <Mail className="mx-auto h-10 w-10 text-accent" />
            <CardTitle className="mt-4">Email Us</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Get a response within 2 business hours.
            </CardDescription>
            <Button variant="link" className="text-primary" asChild>
              <a href="mailto:gold-support@example.com">gold-support@example.com</a>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <Phone className="mx-auto h-10 w-10 text-accent" />
            <CardTitle className="mt-4">Call Us</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Available 9 AM - 5 PM on business days.
            </CardDescription>
            <Button variant="link" className="text-primary" asChild>
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <MessageSquare className="mx-auto h-10 w-10 text-accent" />
            <CardTitle className="mt-4">Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Connect with an agent instantly.
            </CardDescription>
            <Button className="mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">Start Chat</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
