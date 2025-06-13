import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { UpdateProductForm } from "../../components/product/UpdateProductForm";
import { PRODUCT_KEY } from "../../constants/query-key";
import { getProductDetails } from "../../service/product.service";

export default function ProductUpdatePage() {
  const { id } = useParams();

  const { data } = useSuspenseQuery({
    queryKey: [PRODUCT_KEY, id],
    queryFn: () => getProductDetails(id),
  });

  return (
    <div>
      <h1 className="mb-3 text-center text-xl font-bold">Update Product</h1>
      <UpdateProductForm product={data} />
    </div>
  );
}
