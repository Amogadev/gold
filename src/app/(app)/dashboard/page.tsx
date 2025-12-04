import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content-card";
import { RecommendationsForm } from "@/components/recommendations-form";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const exclusiveContent = PlaceHolderImages.filter((img) =>
    img.id.startsWith("exclusive")
  ).slice(0, 3);
  const earlyAccessContent = PlaceHolderImages.filter((img) =>
    img.id.startsWith("early-access")
  ).slice(0, 3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <header>
          <h1 className="text-4xl font-bold font-headline text-foreground tracking-tight">
            Welcome, Golden Member
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Here's your exclusive access to a world of premium features.
          </p>
        </header>

        <RecommendationsForm />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold font-headline">
              Exclusive Content
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/exclusive-content">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exclusiveContent.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold font-headline">Early Access</h2>
            <Button variant="ghost" asChild>
              <Link href="/early-access">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {earlyAccessContent.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
