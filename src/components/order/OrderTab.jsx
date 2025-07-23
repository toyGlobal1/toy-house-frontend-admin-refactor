import {
  addToast,
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { ORDER_KEY } from "../../constants/query-key";
import { OrderStatusEnum } from "../../enums/order.enum";
import { updateOrderStatus } from "../../service/order.service";
import { ExportOrderPdf } from "./ExportOrderPdf";

const tabs = [
  { id: "ALL", title: "All" },
  { id: OrderStatusEnum.pending, title: "Pending" },
  { id: OrderStatusEnum.onHold, title: "On Hold" },
  { id: OrderStatusEnum.confirmed, title: "Confirmed" },
  { id: OrderStatusEnum.processing, title: "Processing" },
  { id: OrderStatusEnum.shipped, title: "Shipped" },
  { id: OrderStatusEnum.delivered, title: "Delivered" },
  { id: OrderStatusEnum.cancelled, title: "Cancelled" },
  { id: OrderStatusEnum.returnedRequested, title: "Return Requested" },
  { id: OrderStatusEnum.returned, title: "Returned" },
  { id: OrderStatusEnum.refunded, title: "Refunded" },
];

const dropdownItems = [
  { id: OrderStatusEnum.cancelled, title: "Cancelled" },
  { id: OrderStatusEnum.onHold, title: "On Hold" },
  { id: OrderStatusEnum.processing, title: "Processing" },
  { id: OrderStatusEnum.shipped, title: "Shipped" },
  { id: OrderStatusEnum.delivered, title: "Delivered" },
  { id: OrderStatusEnum.returnedRequested, title: "Return Requested" },
  { id: OrderStatusEnum.returned, title: "Returned" },
  { id: OrderStatusEnum.refunded, title: "Refunded" },
];

export function OrderTab({ orders }) {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);
  const filteredOrders = useMemo(() => {
    if (selectedTab === "ALL") {
      return orders;
    }
    return orders.filter((order) => order.order_status === selectedTab);
  }, [selectedTab, orders]);

  return (
    <Tabs
      aria-label="Order Status tabs"
      className="flex justify-center"
      selectedKey={selectedTab}
      onSelectionChange={setSelectedTab}>
      {tabs.map((tab) => (
        <Tab key={tab.id} title={tab.title}>
          <div className="flex flex-col gap-3">
            {filteredOrders.length ? (
              filteredOrders.map((order) => <OrderCard key={order.order_id} order={order} />)
            ) : (
              <p className="mt-5 text-center text-gray-500">No orders found</p>
            )}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
}

function OrderCard({ order }) {
  const queryClient = useQueryClient();

  const handleChangeOrderStatus = async (newStatus) => {
    try {
      await updateOrderStatus({ orderId: order.order_id, status: newStatus });
      addToast({
        color: "success",
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
      queryClient.invalidateQueries(ORDER_KEY, order.order_id);
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error",
        description: `Failed to update order status: ${error.message}`,
      });
    }
  };

  return (
    <Card className="rounded-lg p-1 text-sm">
      <CardBody>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="">Order ID: {order.order_id}</p>
            <p>Status: {order.order_status}</p>
          </div>
          <div className="flex items-center gap-3">
            <p>Total Amount: {order.payable_amount.toFixed(2)} BDT</p>
            <ExportOrderPdf order={order} />
            <Button
              size="sm"
              color="success"
              className="text-white"
              isDisabled={order.order_status !== OrderStatusEnum.pending}
              onPress={() => handleChangeOrderStatus(OrderStatusEnum.confirmed)}>
              Confirm Order
            </Button>
            <OrderStatusDropdown onOrderStatusChange={handleChangeOrderStatus} />
          </div>
        </div>
        <Divider />
        <div className="my-2 flex flex-col gap-2">
          {order.order_items.map((item) => (
            <div key={item.inventory_id} className="grid grid-cols-2 gap-5">
              <div className="flex items-center gap-3">
                <img
                  src={item.image_url || null}
                  alt={item.product_name}
                  className="aspect-square size-16 rounded border"
                />
                <div>
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="text-[11px]">Color: {item.color_name}</p>
                  <p className="text-[11px]">
                    SKU: <span className="font-medium">{item.sku}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between font-medium">
                <p>x{item.quantity}</p>
                <p>{item.selling_price} BDT</p>
                <p>{item.total_price} BDT</p>
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-500">
            Date: {new Date(order.order_date).toLocaleString()}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

function OrderStatusDropdown({ onOrderStatusChange }) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button isIconOnly size="sm">
          <LuChevronDown className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Order Status Dropdown"
        selectionMode="single"
        onSelectionChange={(set) => {
          const value = Array.from(set)[0];
          onOrderStatusChange(value);
        }}>
        <DropdownSection title="Change Order Status" items={dropdownItems}>
          {(item) => <DropdownItem key={item.id}>{item.title}</DropdownItem>}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
