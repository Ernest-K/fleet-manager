import React from "react";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonChartProps = {
  className?: string;
};

export function SkeletonChart({ className }: SkeletonChartProps) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-1 p-3 ">
        <div className="mx-auto aspect-square max-h-[180px] relative">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardFooter>
    </Card>
  );
}
