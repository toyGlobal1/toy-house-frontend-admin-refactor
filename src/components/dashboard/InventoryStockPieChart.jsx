import { Pie, PieChart } from "recharts";

import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  count: {
    label: "Inventory",
  },
  inStock: {
    label: "In Stock",
    color: "hsl(var(--heroui-success))",
  },
  outOfStock: {
    label: "Out of Stock",
    color: "hsl(var(--heroui-danger))",
  },
};

export function InventoryStockPieChart({ inStock, outOfStock }) {
  const chartData = [
    { status: "inStock", count: inStock, fill: "var(--color-inStock)" },
    { status: "outOfStock", count: outOfStock, fill: "var(--color-outOfStock)" },
  ];

  return (
    <Card className="p-2">
      <CardHeader className="font-medium">Inventory Status</CardHeader>
      <CardBody>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[350px] [&_.recharts-text]:fill-background">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
            <Pie data={chartData} dataKey="count">
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
}
