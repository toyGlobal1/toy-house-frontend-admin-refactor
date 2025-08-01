import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import Swal from "sweetalert2";
import { COLOR_KEY } from "../../constants/query-key";
import { deleteColor } from "../../service/color.service";

export function ColorCard({ color }) {
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
      await deleteColor(color.color_id);
      queryClient.invalidateQueries({ queryKey: [COLOR_KEY] });
    }
  };

  return (
    <Card className="divide-y-1">
      <CardHeader className="justify-between font-medium">
        {color.color_name}
        <Button isIconOnly size="sm" color="danger" variant="flat" onPress={handleDelete}>
          <TrashIcon className="size-3.5" />
        </Button>
      </CardHeader>
      <CardBody className="space-y-2">
        <div className="text-sm text-gray-700">
          Color Hex Code: <span className="font-medium">{color.color_hex_code}</span>
        </div>
        <div style={{ backgroundColor: color.color_hex_code }} className="h-24 rounded-lg" />
      </CardBody>
    </Card>
  );
}
