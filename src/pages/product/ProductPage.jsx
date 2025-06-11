import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { ProductTable } from "../../components/product/ProductTable";
import { getAllProducts } from "../../service/product.service";

export default function ProductPage() {
  const navigate = useNavigate();
  const { data, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const products = data?.products || [];

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-3 text-center text-xl font-bold">All Products</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>Total Products: {data.total_products}</p>
        <Button onPress={() => navigate("/product/add")}>
          <PlusIcon className="size-4" />
          Add Product
        </Button>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
