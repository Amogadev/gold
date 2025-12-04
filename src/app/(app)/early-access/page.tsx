import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ContentCard } from "@/components/content-card";

export default function EarlyAccessPage() {
  const earlyAccessContent = PlaceHolderImages.filter((img) =>
    img.id.startsWith("early-access")
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-headline text-foreground tracking-tight">
          Early Access
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Be the first to experience our newest features before they're released to the public.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {earlyAccessContent.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
        {earlyAccessContent.map((item) => (
          <ContentCard key={item.id + '-2'} item={{...item, imageUrl: item.imageUrl.replace('/seed/ea', '/seed/eax')}} />
        ))}
      </div>
    </div>
  );
}
