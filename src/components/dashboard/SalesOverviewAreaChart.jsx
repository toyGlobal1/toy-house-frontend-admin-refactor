import { Card, CardBody, CardHeader } from "@heroui/react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
};

function getLastSixMonthsFormatted() {
  const months = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = d.toLocaleDateString("en-US", { month: "short" }); // e.g., "Jan"
    months.unshift(`${monthName}`);
  }

  return months;
}

export function SalesOverviewAreaChart({ orders }) {
  const lastSixMonths = getLastSixMonthsFormatted();
  const chartData = lastSixMonths.map((month) => {
    const totalSales = orders
      .filter(
        (order) =>
          new Date(order.order_date).toLocaleDateString("en-US", {
            month: "short",
          }) === month
      )
      .reduce((total, order) => total + order.payable_amount, 0);
    return { month, sales: totalSales };
  });

  return (
    <Card className="p-2">
      <CardHeader className="font-medium">Sales Overview</CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="sales"
              type="monotone"
              fill="var(--color-sales)"
              fillOpacity={0.4}
              stroke="var(--color-sales)"
            />
          </AreaChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
}
