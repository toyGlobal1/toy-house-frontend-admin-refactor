import { Card, CardBody, CardHeader } from "@heroui/react";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "react-router";
import { PRODUCT_INVENTORY_KEY, PRODUCT_KEY } from "../../constants/query-key";
import { getProductDetails, getProductInventories } from "../../service/product.service";

export default function ProductInventoryPage() {
  const { id } = useParams();
  const [{ data: productData }, { data: productInventories }] = useQueries({
    queries: [
      { queryKey: [PRODUCT_KEY, id], queryFn: () => getProductDetails(id) },
      { queryKey: [PRODUCT_INVENTORY_KEY, id], queryFn: () => getProductInventories(id) },
    ],
  });

  console.log(productData, productInventories);

  return (
    <div>
      <Card className="max-w-[400px] p-5">
        <CardHeader className="font-medium">Basic Information</CardHeader>
        <CardBody>
          <p>Product Name: {productData?.product_name}</p>
          <p>Category: {productData?.category.name}</p>
          <p>Product SKU: {productData?.sku}</p>
          <p>Product Brand: {productData?.brand.name}</p>
          <p>Number Of Pieces: {productData?.number_of_pieces}</p>
          <p>Warranty Info: {productData?.warranty_info}</p>
          <p>Maximum Age: {productData?.maximum_age_range}</p>
          <p>Minimum Age: {productData?.minimum_age_range}</p>
        </CardBody>
      </Card>
    </div>
  );
}
