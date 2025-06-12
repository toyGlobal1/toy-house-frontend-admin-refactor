import { useSuspenseQuery } from "@tanstack/react-query";
import { AddBrandModal } from "../../components/brand/AddBrandModal";
import { BrandCard } from "../../components/brand/BrandCard";
import { BRAND_KEY } from "../../constants/query-key";
import { getAllBrands } from "../../service/brand.service";

export default function BrandPage() {
  const { data } = useSuspenseQuery({ queryKey: [BRAND_KEY], queryFn: getAllBrands });
  const brands = data?.brands || [];

  return (
    <div>
      <h1 className="mb-3rounded-md text-center text-xl font-bold">All Brands</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Brands: <strong>{brands.length}</strong>
        </p>
        <AddBrandModal />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {brands.map((brand) => (
          <BrandCard key={brand.brand_id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
