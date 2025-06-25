import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { PRODUCT_INVENTORY_KEY, PRODUCT_KEY } from "../../constants/query-key";
import { getProductInventories, setFeaturedProduct } from "../../service/product.service";

export function ProductFeatureModal({ product }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <button className="cursor-pointer" onClick={onOpen}>
        <Chip size="sm" color={product.is_featured ? "primary" : "default"}>
          {product.is_featured ? "Featured" : "Not Featured"}
        </Chip>
      </button>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">
            Edit Product Feature
          </ModalHeader>
          <ModalBody className="pb-4">
            <InventoryFeatureTable productId={product.product_id} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const columns = [
  { id: "color", name: "Color" },
  { id: "selling_price", name: "Selling Price" },
  { id: "sold_quantity", name: "Sold Quantity" },
  { id: "quantity", name: "Quantity" },
  { id: "actions", name: "Actions" },
];

function InventoryFeatureTable({ productId, onClose }) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: [PRODUCT_INVENTORY_KEY, productId],
    queryFn: () => getProductInventories(productId),
  });
  const inventories = data?.inventories || [];

  const handleSetFeatured = async (product_inventory_id) => {
    const { isConfirmed } = await Swal.fire({
      showCloseButton: true,
      title: "Are you sure?",
      text: "Are you sure you want to change the featured status of this product?",
      icon: "question",
      confirmButtonText: "OK",
    });
    if (isConfirmed) {
      await setFeaturedProduct({ product_id: productId, product_inventory_id });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
      onClose();
    }
  };
  return (
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
      <TableBody
        items={inventories}
        isLoading={isFetching}
        loadingContent={<Spinner variant="simple" />}>
        {(item) => (
          <TableRow key={item.inventory_id}>
            <TableCell>{item.color}</TableCell>
            <TableCell>{item.selling_price}</TableCell>
            <TableCell>{item.sold_quantity}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" color="danger" onPress={() => handleSetFeatured(item.inventory_id)}>
                {item.is_featured ? "Remove Feature" : "Make Feature"}
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
