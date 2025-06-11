import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ProductDeleteModal } from "./ProductDeleteModal";

const columns = [
  { id: "image", name: "Image" },
  { id: "product_name", name: "Name" },
  { id: "category_name", name: "Category" },
  { id: "brand_name", name: "Brand" },
  { id: "sku", name: "SKU" },
  { id: "inventory_count", name: "Inventories" },
  { id: "is_active", name: "Active" },
  { id: "is_featured", name: "Featured" },
  { id: "actions", name: "Actions" },
];

export function ProductTable({ products }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const pages = Math.ceil(products.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products.slice(start, end);
  }, [page, products]);

  return (
    <>
      <Table isStriped aria-label="All Products Table" className="">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.id} align={column.id === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(product) => (
            <TableRow key={product.product_id}>
              <TableCell>
                <Link to={`/product/${product.product_id}`}>
                  <img
                    className="size-12 rounded"
                    src={product.image_url}
                    alt={product.product_name}
                  />
                </Link>
              </TableCell>
              <TableCell className="max-w-sm">
                <Link to={`/product/${product.product_id}`}>{product.product_name}</Link>
              </TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>{product.brand_name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.inventory_count}</TableCell>
              <TableCell>
                <Chip variant="dot" size="sm" color={product.is_active ? "success" : "default"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip size="sm" color={product.is_featured ? "primary" : "default"}>
                  {product.is_featured ? "Featured" : "Not Featured"}
                </Chip>
              </TableCell>
              <TableCell>
                <ProductDeleteModal id={product.product_id} />
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
