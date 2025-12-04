import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ContentCard } from "@/components/content-card";

export default function ExclusiveContentPage() {
  const exclusiveContent = PlaceHolderImages.filter((img) =>
    img.id.startsWith("exclusive")
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-headline text-foreground tracking-tight">
          Exclusive Content
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Hand-picked articles, videos, and podcasts, just for our golden members.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {exclusiveContent.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
         {exclusiveContent.map((item) => (
          <ContentCard key={item.id + '-2'} item={{...item, imageUrl: item.imageUrl.replace('/seed/e', '/seed/ex')}} />
        ))}
      </div>
    </div>
  );
}
