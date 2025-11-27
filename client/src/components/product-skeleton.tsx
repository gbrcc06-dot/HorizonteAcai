import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square w-full bg-white/10" />
      </CardHeader>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
        <Skeleton className="h-4 w-full mb-1 bg-white/10" />
        <Skeleton className="h-4 w-2/3 mb-3 bg-white/10" />
        <Skeleton className="h-8 w-24 bg-white/10" />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full bg-white/10" />
      </CardFooter>
    </Card>
  );
}
