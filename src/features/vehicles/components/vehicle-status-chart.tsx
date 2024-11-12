import * as React from "react";
import { LabelList, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Vehicle } from "@/features/vehicles/types";
import NoData from "@/components/no-data";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleStatusChartProps {
  vehicles: Vehicle[];
}

const statusColors = {
  active: "hsl(var(--chart-1))",
  inactive: "hsl(var(--chart-2))",
  "on inspection": "hsl(var(--chart-3))",
  "in service": "hsl(var(--chart-4))",
  "needs repair": "hsl(var(--chart-5))",
  "on trip": "hsl(var(--chart-6))",
};

export default function VehicleStatusChart({ vehicles }: VehicleStatusChartProps) {
  const chartData = React.useMemo(() => {
    const statusCounts = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: statusColors[status as keyof typeof statusColors] || "hsl(var(--chart-7))",
    }));
  }, [vehicles]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Count",
      },
    };
    chartData.forEach(({ status, fill }) => {
      config[status] = {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: fill,
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col sm:col-span-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Vehicle Status</CardTitle>
        <CardDescription>Vehicle status overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!vehicles.length ? (
          <NoData title="No data found" icon={<Skeleton className="h-20 w-20" />} />
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="count" nameKey="status" stroke="0">
                <LabelList dataKey="status" className="fill-background" stroke="none" fontSize={12} />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">{chartData.find((d) => d.status === "active")?.count || 0} Active Vehicles</div>
        <div className="leading-none text-muted-foreground">Showing current status distribution for all vehicles</div>
      </CardFooter>
    </Card>
  );
}
