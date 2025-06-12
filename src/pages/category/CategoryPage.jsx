import { useSuspenseQuery } from "@tanstack/react-query";
import { AddCategoryModal } from "../../components/category/AddCategoryModal";
import { CategoryCard } from "../../components/category/CategoryCard";
import { CATEGORY_KEY } from "../../constants/query-key";
import { getAllCategories } from "../../service/category.service";

export default function CategoryPage() {
  const { data } = useSuspenseQuery({ queryKey: [CATEGORY_KEY], queryFn: getAllCategories });
  const categories = data?.categories || [];

  return (
    <div>
      <h1 className="mb-3rounded-md text-center text-xl font-bold">All Categories</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Categories: <strong>{categories.length}</strong>
        </p>
        <AddCategoryModal />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((category) => (
          <CategoryCard key={category.category_id} category={category} />
        ))}
      </div>
    </div>
  );
}
