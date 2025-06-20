import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { LuFilter } from "react-icons/lu";
import { MonthEnum } from "../../enums/order.enum";

const dropdownItems = Object.values(MonthEnum).map((month, index) => ({
  id: index + 1,
  month,
}));

export function OrderMonthFilterDropdown({ month, onMonthChange }) {
  return (
    <Dropdown size="sm" placement="bottom" classNames={{ content: "min-w-fit" }}>
      <DropdownTrigger>
        <Button size="sm">
          <LuFilter className="size-3.5" />
          {month ? `Selected: ${month}` : "Filter by Month"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Order Filter By Month Dropdown"
        selectionMode="single"
        items={dropdownItems}
        onSelectionChange={(set) => {
          const value = Array.from(set)[0];
          onMonthChange(value);
        }}>
        {(item) => <DropdownItem key={item.month}>{item.month}</DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  );
}
