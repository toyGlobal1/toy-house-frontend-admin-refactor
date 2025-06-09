import { Button, Input, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductTable } from "../../components/product/ProductTable";
import { PRODUCT_KEY } from "../../constants/query-key";
import { getAllProducts } from "../../service/product.service";

export default function ProductPage() {
  const [searchText, setSearchText] = useState("");
  const { data, isFetching } = useQuery({ queryKey: [PRODUCT_KEY], queryFn: getAllProducts });

  const filteredProducts = useMemo(() => {
    const allProducts = data?.products || [];
    if (searchText === "") {
      return allProducts;
    } else {
      return allProducts.filter((product) =>
        product.product_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }, [searchText, data]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="size-8" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-3 text-center text-xl font-bold">All Products</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Products: <strong>{filteredProducts.length}</strong>
        </p>
        <div className="flex items-center gap-3">
          <div>
            <Input
              variant="bordered"
              size="sm"
              placeholder="Search products by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <Button size="sm">
            <PlusIcon className="size-4" />
            Add Product
          </Button>
        </div>
      </div>
      <ProductTable products={filteredProducts} />
    </div>
  );
}
