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
      <Table isStriped aria-label="All Products Table" className="max-h-[80vh]">
        <TableHeader>
          <TableColumn>Image</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Brand</TableColumn>
          <TableColumn>SKU</TableColumn>
          <TableColumn>Inventories</TableColumn>
          <TableColumn>Featured</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((product) => (
            <TableRow
              key={product.product_id}
              as={Link}
              href={`/product/${product.product_id}`}
              className="cursor-pointer">
              <TableCell>
                <img
                  className="size-12 rounded"
                  src={product.image_url}
                  alt={product.product_name}
                />
              </TableCell>
              <TableCell className="max-w-sm">{product.product_name}</TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>{product.brand_name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.inventory_count}</TableCell>
              <TableCell>
                <Chip color={product.is_featured ? "primary" : "default"}>
                  {product.is_featured ? "Featured" : "Not Featured"}
                </Chip>
              </TableCell>
              <TableCell>
                <ProductDeleteModal id={product.product_id} />
              </TableCell>
            </TableRow>
          ))}
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
