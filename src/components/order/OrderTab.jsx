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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LuArrowRight, LuChevronDown } from "react-icons/lu";
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
            <OrderStatusDropdown
              status={order.order_status}
              onOrderStatusChange={handleChangeOrderStatus}
            />
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
        <div className="mt-2 flex items-center gap-5">
          <p className="text-xs font-medium text-gray-500">
            Date: {new Date(order.order_date).toLocaleString()}
          </p>
          <CustomerInfoPopover
            name={order.name}
            phone_number={order.phone_number}
            email={order.email}
            delivery_options={order.delivery_options}
            address={order.address}
          />
        </div>
      </CardBody>
    </Card>
  );
}

function OrderStatusDropdown({ status, onOrderStatusChange }) {
  let disabledKeys = [];
  const orderStatusValues = Object.values(OrderStatusEnum);

  if (status === OrderStatusEnum.pending) {
    disabledKeys = orderStatusValues.filter(
      (item) =>
        item !== OrderStatusEnum.confirmed &&
        item !== OrderStatusEnum.cancelled &&
        item !== OrderStatusEnum.onHold
    );
  } else if (
    status === OrderStatusEnum.cancelled ||
    status === OrderStatusEnum.failed ||
    status === OrderStatusEnum.refunded
  ) {
    disabledKeys = orderStatusValues;
  } else if (status === OrderStatusEnum.confirmed) {
    disabledKeys = orderStatusValues.filter(
      (item) =>
        item !== OrderStatusEnum.shipped &&
        item !== OrderStatusEnum.cancelled &&
        item !== OrderStatusEnum.processing
    );
  } else if (status === OrderStatusEnum.onHold) {
    disabledKeys = orderStatusValues.filter(
      (item) => item !== OrderStatusEnum.confirmed && item !== OrderStatusEnum.cancelled
    );
  } else if (status === OrderStatusEnum.processing) {
    disabledKeys = orderStatusValues.filter(
      (item) => item !== OrderStatusEnum.shipped && item !== OrderStatusEnum.cancelled
    );
  } else if (status === OrderStatusEnum.shipped) {
    disabledKeys = orderStatusValues.filter((item) => item !== OrderStatusEnum.delivered);
  } else if (status === OrderStatusEnum.delivered) {
    disabledKeys = orderStatusValues.filter((item) => item !== OrderStatusEnum.returnedRequested);
  } else if (status === OrderStatusEnum.returnedRequested) {
    disabledKeys = orderStatusValues.filter((item) => item !== OrderStatusEnum.returned);
  } else if (status === OrderStatusEnum.returned) {
    disabledKeys = orderStatusValues.filter((item) => item !== OrderStatusEnum.refunded);
  }

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
        disabledKeys={disabledKeys}
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

function CustomerInfoPopover({ name, phone_number, email, delivery_options, address }) {
  return (
    <Popover placement="right" showArrow={true}>
      <PopoverTrigger>
        <Button size="sm">
          View customer info <LuArrowRight />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-neutral-200">
        <div className="p-2">
          <p className="mb-2 text-center text-base font-semibold">Customer Info</p>
          <div className="space-y-1 text-sm [&_strong]:inline-block [&_strong]:min-w-[120px] [&_strong]:font-medium">
            <div>
              <strong>Name:</strong> {name}
            </div>
            <div>
              <strong>Phone:</strong> {phone_number}
            </div>
            <div>
              <strong>Email:</strong> {email}
            </div>
            <div className="font-medium">
              <strong>Delivery Options:</strong> {delivery_options}
            </div>
            <div>
              <strong>Address:</strong> {address}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
