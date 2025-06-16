import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import Swal from "sweetalert2";
import { MATERIAL_KEY } from "../../constants/query-key";
import { deleteMaterial } from "../../service/material.service";

export function MaterialCard({ material }) {
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
      await deleteMaterial(material.material_id);
      queryClient.invalidateQueries({ queryKey: [MATERIAL_KEY] });
    }
  };

  return (
    <Card className="divide-y-1">
      <CardHeader className="justify-between font-medium">
        {material.name}
        <Button isIconOnly size="sm" color="danger" variant="flat" onPress={handleDelete}>
          <TrashIcon className="size-3.5" />
        </Button>
      </CardHeader>
      <CardBody>
        <div>
          {material?.material_description ? (
            <p>{material.material_description}</p>
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
