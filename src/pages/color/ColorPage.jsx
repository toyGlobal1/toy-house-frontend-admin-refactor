import { useSuspenseQuery } from "@tanstack/react-query";
import { AddColorModal } from "../../components/color/AddColorModal";
import { ColorCard } from "../../components/color/ColorCard";
import { COLOR_KEY } from "../../constants/query-key";
import { getAllColors } from "../../service/color.service";

export default function ColorPage() {
  const { data } = useSuspenseQuery({ queryKey: [COLOR_KEY], queryFn: getAllColors });
  const colors = data?.colors || [];

  return (
    <div>
      <h1 className="mb-3rounded-md text-center text-xl font-bold">All Colors</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Colors: <strong>{colors.length}</strong>
        </p>
        <AddColorModal />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 md:grid-cols-6">
        {colors.map((color) => (
          <ColorCard key={color.color_id} color={color} />
        ))}
      </div>
    </div>
  );
}
