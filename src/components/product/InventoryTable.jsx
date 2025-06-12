import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { EyeIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { InventoryImageModal } from "./InventoryImageModal";
import { InventoryUpdateModal } from "./InventoryUpdateModal";

const columns = [
  { id: "image", name: "Image" },
  { id: "video", name: "Video" },
  { id: "color", name: "Color" },
  { id: "quantity", name: "Quantity" },
  { id: "base_price", name: "Base Price" },
  {
    id: "base_price_after_tax",
    name: (
      <div className="flex flex-col items-center">
        Base Price <span className="font-normal">(After Tax)</span>
      </div>
    ),
  },
  { id: "selling_price", name: "Selling Price" },
  {
    id: "selling_price_after_tax",
    name: (
      <div className="flex flex-col items-center">
        Selling Price <span className="font-normal">(After Tax)</span>
      </div>
    ),
  },
  {
    id: "applicable_tax_percent",
    name: (
      <div className="flex flex-col items-center">
        Applicable Tax <span className="font-normal">(%)</span>
      </div>
    ),
  },
  {
    id: "discount_percent",
    name: (
      <div className="flex flex-col items-center">
        Discount <span className="font-normal">(%)</span>
      </div>
    ),
  },
  { id: "discount_price", name: "Discount Price" },
  { id: "mark_unavailable", name: "Availability" },
  { id: "is_new", name: "New" },
  { id: "is_featured", name: "Featured" },
  { id: "actions", name: "Actions" },
];

export function InventoryTable({ inventories }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const pages = Math.ceil(inventories.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return inventories.slice(start, end);
  }, [page, inventories]);

  const handleDeleteInventory = async (inventoryId) => {
    const { isConfirmed } = await Swal.fire({
      showCloseButton: true,
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "question",
      confirmButtonText: "Delete",
    });
    if (isConfirmed) {
      console.log(inventoryId); // TODO: Call delete inventory API
    }
  };

  return (
    <>
      <Table
        isStriped
        aria-label="All Inventories Table"
        className="max-h-[80vh]"
        classNames={{ th: "py-3 bg-secondary text-secondary-foreground" }}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.id} align="center">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.inventory_id}>
              <TableCell>
                <InventoryImageModal inventoryId={item.inventory_id} />
              </TableCell>
              <TableCell className="max-w-sm">
                <Button isIconOnly size="sm">
                  <EyeIcon className="size-4" />
                </Button>
              </TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.base_price}</TableCell>
              <TableCell>{item.base_price_after_tax}</TableCell>
              <TableCell>{item.selling_price}</TableCell>
              <TableCell>{item.selling_price_after_tax}</TableCell>
              <TableCell>{item.applicable_tax_percent}</TableCell>
              <TableCell>{item.discount_percent}</TableCell>
              <TableCell>{item.discount_price}</TableCell>
              <TableCell>
                <Chip
                  variant="dot"
                  size="sm"
                  color={!item.mark_unavailable ? "default" : "success"}>
                  {!item.mark_unavailable ? "Unavailable" : "Available"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip variant="flat" size="sm" color={item.is_new ? "primary" : "default"}>
                  {item.is_new ? "New" : "Not New"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip size="sm" color={item.is_featured ? "primary" : "default"}>
                  {item.is_featured ? "Featured" : "Not Featured"}
                </Chip>
              </TableCell>
              <TableCell className="space-x-2">
                <InventoryUpdateModal inventory={item} />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  onPress={() => handleDeleteInventory(item.inventory_id)}>
                  <TrashIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </>
  );
}
