import { Button, Input } from "@heroui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ProductTable } from "../../components/product/ProductTable";
import { PRODUCT_KEY } from "../../constants/query-key";
import { useDebounce } from "../../hooks/useDebounce";
import { getAllProducts } from "../../service/product.service";

export default function ProductPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { data } = useSuspenseQuery({ queryKey: [PRODUCT_KEY], queryFn: getAllProducts });

  const debouncedSearchText = useDebounce(searchText, 300);

  const filteredProducts = useMemo(() => {
    const allProducts = data?.products || [];
    if (debouncedSearchText === "") {
      return allProducts;
    } else {
      return allProducts.filter((product) =>
        product.product_name.toLowerCase().includes(debouncedSearchText.toLowerCase())
      );
    }
  }, [debouncedSearchText, data]);

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
            <PlusIcon className="size-4" onPress={() => navigate("/product/add")} />
            Add Product
          </Button>
        </div>
      </div>
      <ProductTable products={filteredProducts} />
    </div>
  );
}
