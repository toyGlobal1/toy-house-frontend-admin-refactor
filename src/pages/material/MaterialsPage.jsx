import { useSuspenseQuery } from "@tanstack/react-query";
import { AddMaterialModal } from "../../components/material/AddMaterialModal";
import { MaterialCard } from "../../components/material/MaterialCard";
import { MATERIAL_KEY } from "../../constants/query-key";
import { getAllMaterials } from "../../service/material.service";

export default function MaterialsPage() {
  const { data } = useSuspenseQuery({ queryKey: [MATERIAL_KEY], queryFn: getAllMaterials });
  const materials = data?.materials || [];

  return (
    <div>
      <h1 className="mb-3rounded-md text-center text-xl font-bold">All Materials</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Materials: <strong>{materials.length}</strong>
        </p>
        <AddMaterialModal />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {materials.map((material) => (
          <MaterialCard key={material.material_id} material={material} />
        ))}
      </div>
    </div>
  );
}
