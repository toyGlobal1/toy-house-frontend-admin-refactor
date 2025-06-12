import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import Swal from "sweetalert2";
import { CATEGORY_KEY } from "../../constants/query-key";
import { deleteCategory } from "../../service/category.service";

export function CategoryCard({ category }) {
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
      await deleteCategory(category.category_id);
      queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
    }
  };

  return (
    <Card className="divide-y-1">
      <CardHeader className="justify-between font-medium">
        {category.name}
        <Button isIconOnly size="sm" color="danger" variant="flat" onPress={handleDelete}>
          <TrashIcon className="size-3.5" />
        </Button>
      </CardHeader>
      <CardBody>
        <img
          src={category.category_logo_url}
          alt={category.name}
          className="aspect-square rounded-md"
        />
      </CardBody>
    </Card>
  );
}
