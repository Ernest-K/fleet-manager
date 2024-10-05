import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import NoData from "./no-data";

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface TypeChartProps<T> {
  title: string;
  description: string;
  data: T[];
  typeKey: keyof T;
  config: ChartConfig;
  labelTotal: string;
  unit: string;
}

export function TypeChart<T>({ title, description, data, typeKey, config, labelTotal, unit }: TypeChartProps<T>) {
  const chartData = React.useMemo(() => {
    const typeCounts = data.reduce((acc, item) => {
      const type = item[typeKey] as string;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      fill: config[type]?.color || "hsl(var(--chart-default))",
    }));
  }, [data, typeKey, config]);

  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col sm:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!data.length ? (
          <NoData title="No data found" />
        ) : (
          <ChartContainer className="mx-auto aspect-square max-h-[250px]" config={config}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {totalCount.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            {labelTotal}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {chartData.find((d) => d.type === Object.keys(config)[0])?.count || 0} {config[Object.keys(config)[0]]?.label}
        </div>
        <div className="leading-none text-muted-foreground">Showing total {unit} for all time</div>
      </CardFooter>
    </Card>
  );
}
