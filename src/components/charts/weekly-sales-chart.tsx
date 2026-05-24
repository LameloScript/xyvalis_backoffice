"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Données pour la vue "Semaine" (7 derniers jours)
const weeklyData = [
  { date: "2026-01-07", week: 245000 },
  { date: "2026-01-08", week: 320000 },
  { date: "2026-01-09", week: 280000 },
  { date: "2026-01-10", week: 390000 },
  { date: "2026-01-11", week: 435000 },
  { date: "2026-01-12", week: 410000 },
  { date: "2026-01-13", week: 485000 },
];

// Données pour la vue "Mois" (12 derniers mois)
const monthlyData = [
  { date: "2025-02-01", month: 2100000 },
  { date: "2025-03-01", month: 2350000 },
  { date: "2025-04-01", month: 2180000 },
  { date: "2025-05-01", month: 2520000 },
  { date: "2025-06-01", month: 2780000 },
  { date: "2025-07-01", month: 2640000 },
  { date: "2025-08-01", month: 2890000 },
  { date: "2025-09-01", month: 3120000 },
  { date: "2025-10-01", month: 3350000 },
  { date: "2025-11-01", month: 3680000 },
  { date: "2025-12-01", month: 4120000 },
  { date: "2026-01-01", month: 4240000 },
];

const chartConfig = {
  views: {
    label: "Commandes",
  },
  week: {
    label: "Semaine",
    color: "var(--chart-1)",
  },
  month: {
    label: "Mois",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function WeeklySalesChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("month");

  const chartData = activeChart === "week" ? weeklyData : monthlyData;
  const dataKey = activeChart;

  const total = React.useMemo(
    () => ({
      week: weeklyData.reduce((acc, curr) => acc + curr.week, 0),
      month: monthlyData.reduce((acc, curr) => acc + curr.month, 0),
    }),
    [],
  );

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Commandes</CardTitle>
          <CardDescription>
            {activeChart === "week"
              ? "Commandes des 7 derniers jours"
              : "Commandes des 12 derniers mois"}
          </CardDescription>
        </div>
        <div className="flex">
          {["week", "month"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left event:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-base leading-none font-bold sm:text-xl">
                  {total[key as keyof typeof total].toLocaleString()} FCFA
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (activeChart === "week") {
                  return date.toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                  });
                } else {
                  return date.toLocaleDateString("fr-FR", {
                    month: "short",
                    year: "numeric",
                  });
                }
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={dataKey} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
