import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentCardProps {
  item: ImagePlaceholder;
}

export function ContentCard({ item }: ContentCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={item.description}
            fill
            className="object-cover"
            data-ai-hint={item.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Badge variant="secondary" className="mb-2">
          {item.id.startsWith("exclusive") ? "Exclusive" : "Early Access"}
        </Badge>
        <CardTitle className="font-headline text-xl mb-2">{item.description}</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
