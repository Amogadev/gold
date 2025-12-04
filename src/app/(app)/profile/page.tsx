import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Star, PaintBrush } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-headline text-foreground tracking-tight">
          Enhanced Profile
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Customize your presence and show off your premium status.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Golden Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                <AvatarFallback>GA</AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-2 -right-2 border-2 border-background bg-primary text-primary-foreground">
                <Award className="h-4 w-4" />
              </Badge>
            </div>
            <h2 className="mt-4 text-2xl font-bold">Golden Member</h2>
            <p className="text-muted-foreground">member@example.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unlocked Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Premium Badge</h3>
                <p className="text-muted-foreground text-sm">
                  Your profile is adorned with the Golden Access badge, visible to everyone.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <PaintBrush className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Profile Customization</h3>
                <p className="text-muted-foreground text-sm">
                  Unlock advanced options to personalize your profile's appearance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Featured Status</h3>
                <p className="text-muted-foreground text-sm">
                  Your content and comments get priority placement across the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
