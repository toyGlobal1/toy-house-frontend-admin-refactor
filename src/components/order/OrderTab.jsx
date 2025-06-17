import {
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { OrderStatusEnum } from "../../enums/order.enum";

const tabs = [
  { id: "ALL", title: "All" },
  { id: OrderStatusEnum.pending, title: "Pending" },
  { id: OrderStatusEnum.confirmed, title: "Confirmed" },
  { id: OrderStatusEnum.shipped, title: "Shipped" },
  { id: OrderStatusEnum.delivered, title: "Delivered" },
  { id: OrderStatusEnum.cancelled, title: "Cancelled" },
  { id: OrderStatusEnum.returnedRequested, title: "Return Requested" },
  { id: OrderStatusEnum.returned, title: "Returned" },
  { id: OrderStatusEnum.refunded, title: "Refunded" },
];

const dropdownItems = [
  { id: OrderStatusEnum.cancelled, title: "Cancelled" },
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
            {filteredOrders.map((order) => (
              <Card key={order.order_id} className="rounded-lg p-1 text-sm">
                <CardBody>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <p className="">Order ID: {order.order_id}</p>
                      <p>Status: {order.order_status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p>Total Amount: {order.payable_amount.toFixed(2)} BDT</p>
                      <Button size="sm">Export PDF</Button>
                      <Button
                        size="sm"
                        color="success"
                        isDisabled={order.order_status === OrderStatusEnum.confirmed}>
                        Confirm Order
                      </Button>
                      <OrderStatusDropdown />
                    </div>
                  </div>
                  <Divider />
                  <div className="my-2 flex flex-col gap-2">
                    {order.order_items.map((item) => (
                      <div key={item.inventory_id} className="grid grid-cols-2">
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
            ))}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
}

function OrderStatusDropdown() {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button isIconOnly size="sm">
          <LuChevronDown className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Order Status Dropdown" items={dropdownItems}>
        {(item) => <DropdownItem key={item.id}>{item.title}</DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  );
}
