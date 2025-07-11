import { Button, Card, CardBody, CardHeader, Tooltip } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import Swal from "sweetalert2";
import { BRAND_KEY } from "../../constants/query-key";
import { deleteBrand } from "../../service/brand.service";
import { UpdateBrandModal } from "./UpdateBrandModal";

export function BrandCard({ brand }) {
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      showCloseButton: true,
      title: "Are you sure?",
      text: "This action can not be undone.",
      icon: "question",
      confirmButtonText: "Delete",
    });
    if (isConfirmed) {
      await deleteBrand(brand.brand_id);
      queryClient.invalidateQueries({ queryKey: [BRAND_KEY] });
    }
  };

  return (
    <Card className="divide-y-1">
      <CardHeader className="justify-between font-medium">
        {brand.name}
        <div className="flex items-center gap-2">
          <UpdateBrandModal brand={brand} />
          <Tooltip content="Delete" placement="top" radius="sm" color="foreground">
            <Button isIconOnly size="sm" color="danger" variant="flat" onPress={handleDelete}>
              <TrashIcon className="size-3.5" />
            </Button>
          </Tooltip>
        </div>
      </CardHeader>
      <CardBody>
        <img src={brand.brand_logo_url} alt={brand.name} className="aspect-square rounded-md" />
      </CardBody>
    </Card>
  );
}
