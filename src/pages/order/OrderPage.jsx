import { useSuspenseQuery } from "@tanstack/react-query";
import { OrderTab } from "../../components/order/OrderTab";
import { ORDER_KEY } from "../../constants/query-key";
import { getAllOrders } from "../../service/order.service";

export default function OrderPage() {
  const { data } = useSuspenseQuery({ queryKey: [ORDER_KEY], queryFn: getAllOrders });
  const orders = data.orders || [];

  return (
    <div>
      <h1 className="mb-3 text-center text-xl font-bold">All Orders</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Orders: <strong>{data.orders.length}</strong>
        </p>
      </div>
      <div className="">
        <OrderTab orders={orders} />
      </div>
    </div>
  );
}
