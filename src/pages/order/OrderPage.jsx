import { Input } from "@heroui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { OrderMonthFilterDropdown } from "../../components/order/OrderMonthFilterDropdown";
import { OrderTab } from "../../components/order/OrderTab";
import { ORDER_KEY } from "../../constants/query-key";
import { getAllOrders } from "../../service/order.service";

export default function OrderPage() {
  const [orderId, setOrderId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const { data } = useSuspenseQuery({ queryKey: [ORDER_KEY], queryFn: getAllOrders });

  const filteredOrders = useMemo(() => {
    const orders = data.orders || [];
    if (!orderId && !year && !month) return orders;
    return orders.filter((order) => {
      const matchesOrderId = order.order_id.toString().includes(orderId.toLowerCase());
      const orderDate = new Date(order.order_date);
      const matchesMonth = month
        ? orderDate
            .toLocaleString("default", { month: "long" })
            .toLowerCase()
            .includes(month.toLowerCase())
        : true;
      const matchesYear = year
        ? orderDate.getFullYear().toString().includes(year.toLowerCase())
        : true;
      return matchesOrderId && matchesYear && matchesMonth;
    });
  }, [orderId, month, year, data]);

  return (
    <div>
      <h1 className="mb-3 text-center text-xl font-bold">All Orders</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Orders: <strong>{data.orders.length}</strong>
        </p>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <Input
          size="sm"
          variant="bordered"
          placeholder="Search by order ID"
          className="w-fit"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <OrderMonthFilterDropdown month={month} onMonthChange={setMonth} />
          <Input
            size="sm"
            variant="bordered"
            placeholder="Search by year"
            className="w-fit"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>
      <OrderTab orders={filteredOrders} />
    </div>
  );
}
