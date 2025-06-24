import { Card, CardBody, CardHeader } from "@heroui/react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { InventoryStockPieChart } from "../components/dashboard/InventoryStockPieChart";
import { SalesOverviewAreaChart } from "../components/dashboard/SalesOverviewAreaChart";
import { ORDER_KEY, PRODUCT_KEY } from "../constants/query-key";
import { OrderStatusEnum } from "../enums/order.enum";
import { getAllOrders } from "../service/order.service";
import { getAllProducts } from "../service/product.service";

export default function DashboardPage() {
  const [{ data: productData }, { data: orderData }] = useSuspenseQueries({
    queries: [
      { queryKey: [PRODUCT_KEY], queryFn: getAllProducts },
      { queryKey: [ORDER_KEY], queryFn: getAllOrders },
    ],
  });

  // Calculate total sales from orders
  const deliveredOrders =
    orderData?.orders.filter((order) => order.order_status === OrderStatusEnum.delivered) || [];

  const totalSales = deliveredOrders
    .reduce((total, order) => total + order.payable_amount, 0)
    .toFixed(2);

  const totalSoldItems =
    deliveredOrders.reduce((total, order) => {
      return total + order.order_items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
    }, 0) || 0;

  const inStock = productData.products.filter((item) => item.inventory_count > 0).length;
  const outOfStock = productData.products.filter((item) => item.inventory_count === 0).length;

  return (
    <div>
      <h1 className="mb-3 text-center text-xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-2">
          <CardHeader className="font-medium">Total Sales</CardHeader>
          <CardBody className="text-xl font-semibold">BDT {totalSales}</CardBody>
        </Card>
        <Card className="p-2">
          <CardHeader className="font-medium">Total Products</CardHeader>
          <CardBody className="">
            <div className="text-xl font-semibold">{productData?.total_products || 0} Pcs</div>
          </CardBody>
        </Card>
        <Card className="p-2">
          <CardHeader className="font-medium">Total Sold Items</CardHeader>
          <CardBody className="text-xl font-semibold">{totalSoldItems} Pcs</CardBody>
        </Card>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <SalesOverviewAreaChart orders={deliveredOrders} />
        <InventoryStockPieChart inStock={inStock} outOfStock={outOfStock} />
      </div>
    </div>
  );
}
