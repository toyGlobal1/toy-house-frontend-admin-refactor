import { Button, Card, CardBody, CardHeader, cn, Radio, RadioGroup } from "@heroui/react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { SquarePenIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useParams } from "react-router";
import Editor from "../../components/editor/Editor";
import { AddInventoryModal } from "../../components/product/AddInventoryModal";
import { InventoryTable } from "../../components/product/InventoryTable";
import { COLOR_KEY, PRODUCT_INVENTORY_KEY, PRODUCT_KEY } from "../../constants/query-key";
import { ProductDimensionEnum } from "../../enums/product.enum";
import { getAllColors } from "../../service/color.service";
import { getProductDetails, getProductInventories } from "../../service/product.service";

const cardStyles = {
  card: "divide-y-1 divide-default rounded-lg",
  header: "px-5 pt-5 text-xl font-medium",
  body: "px-5 py-5",
};

export default function ProductInventoryPage() {
  const productDescriptionRef = useRef(null);
  const productInTheBoxRef = useRef(null);
  const { id } = useParams();
  const [{ data: productData }, { data: productInventories }] = useSuspenseQueries({
    queries: [
      { queryKey: [PRODUCT_KEY, id], queryFn: () => getProductDetails(id) },
      { queryKey: [PRODUCT_INVENTORY_KEY, id], queryFn: () => getProductInventories(id) },
      { queryKey: [COLOR_KEY], queryFn: getAllColors },
    ],
  });

  const inventories = productInventories?.inventories || [];

  if (!productData) {
    throw new Error("Product does not exist");
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className={cardStyles.card}>
          <CardHeader className={cardStyles.header}>
            Basic Information
            <Button size="sm" className="ml-auto" as={Link} to={`/product/${id}/update`}>
              <SquarePenIcon className="size-3.5" />
              Edit
            </Button>
          </CardHeader>
          <CardBody
            className={cn(
              cardStyles.body,
              "space-y-2 [&_strong]:inline-block [&_strong]:min-w-[150px] [&_strong]:font-semibold"
            )}>
            <div>
              <strong>Product Name:</strong> {productData?.product_name}
            </div>
            <div>
              <strong>Category:</strong> {productData?.category.name}
            </div>
            <div>
              <strong>Product SKU:</strong> {productData?.sku}
            </div>
            <div>
              <strong>Product Brand:</strong> {productData?.brand.name}
            </div>
            <div>
              <strong>Number Of Pieces:</strong> {productData?.number_of_pieces}
            </div>
            <div>
              <strong>Warranty Info:</strong> {productData?.warranty_info}
            </div>
            <div>
              <strong>Maximum Age:</strong> {productData?.maximum_age_range}
            </div>
            <div>
              <strong>Minimum Age:</strong> {productData?.minimum_age_range}
            </div>
          </CardBody>
        </Card>
        <DimensionCard dimensions={productData?.dimensions} />
        <Card className={cardStyles.card}>
          <CardHeader className={cardStyles.header}>Product Description</CardHeader>
          <CardBody className={`${cardStyles.body} max-h-[300px] overflow-y-auto`}>
            <Editor
              ref={productDescriptionRef}
              defaultValue={productData?.product_description}
              readOnly={true}
            />
          </CardBody>
        </Card>

        <Card className={cardStyles.card}>
          <CardHeader className={cardStyles.header}>In The Box</CardHeader>
          <CardBody className={`${cardStyles.body} max-h-[300px] overflow-y-auto`}>
            {productData?.in_the_box ? (
              <Editor
                ref={productInTheBoxRef}
                defaultValue={productData?.in_the_box}
                readOnly={true}
              />
            ) : (
              <div className="text-gray-500">Information Not Available</div>
            )}
          </CardBody>
        </Card>
      </div>
      <div className="flex items-center justify-center gap-5">
        <h2 className="my-5 text-center text-2xl font-semibold">Inventories</h2>
        <AddInventoryModal />
      </div>

      <InventoryTable inventories={inventories} />
    </div>
  );
}

function DimensionCard({ dimensions }) {
  const [dimension, setDimension] = useState(ProductDimensionEnum.box);
  const activeDimensions = dimensions.filter((item) => item.type === dimension);

  return (
    <Card className={cardStyles.card}>
      <CardHeader className={cardStyles.header}>Product Dimensions</CardHeader>
      <CardBody className={cardStyles.body}>
        <RadioGroup
          orientation="horizontal"
          defaultValue={dimension}
          onChange={(e) => setDimension(e.target.value)}>
          <Radio value={ProductDimensionEnum.box}>Box</Radio>
          <Radio value={ProductDimensionEnum.product}>Product</Radio>
        </RadioGroup>
        <div className="mt-5">
          {activeDimensions.length === 0 && (
            <div className="text-gray-500">No dimensions available for this product.</div>
          )}
          {activeDimensions.map((item) => (
            <div
              key={item.dimension_id}
              className="space-y-5 [&_strong]:inline-block [&_strong]:font-semibold">
              <div className="flex items-center gap-3">
                <div>
                  <strong>Height:</strong> {item.height}
                </div>
                <div>
                  <strong>Width:</strong> {item.width}
                </div>
                <div>
                  <strong>Depth:</strong> {item.depth}
                </div>
                <div>
                  <strong>Dimension unit:</strong> {item.dimension_unit}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <strong>Weight:</strong> {item.weight}
                </div>
                <div>
                  <strong>Weight unit:</strong> {item.weight_unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
