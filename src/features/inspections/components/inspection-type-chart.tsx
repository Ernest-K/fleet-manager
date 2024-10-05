import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Inspection } from "../types";

interface InspectionTypeChartProps {
  inspections: Inspection[];
}

const chartConfig: ChartConfig = {
  count: {
    label: "Count",
  },
  regular: {
    label: "Regular",
    color: "hsl(var(--chart-1))",
  },
  "pre-trip": {
    label: "Pre-trip",
    color: "hsl(var(--chart-2))",
  },
  "post-trip": {
    label: "Post-trip",
    color: "hsl(var(--chart-3))",
  },
  specific: {
    label: "Specific",
    color: "hsl(var(--chart-4))",
  },
};

export function InspectionTypeChart({ inspections }: InspectionTypeChartProps) {
  const chartData = React.useMemo(() => {
    const typeCounts = inspections.reduce((acc, inspection) => {
      acc[inspection.type] = (acc[inspection.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      fill: chartConfig[type as keyof typeof chartConfig]?.color || "hsl(var(--chart-5))",
    }));
  }, [inspections]);

  const totalInspections = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col sm:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inspection Type</CardTitle>
        <CardDescription>Overview of Inspection Types</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalInspections.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Inspections
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {chartData.find((d) => d.type === "regular")?.count || 0} Regular Inspections <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total inspections for all time</div>
      </CardFooter>
    </Card>
  );
}
