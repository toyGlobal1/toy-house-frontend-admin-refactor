import { Input } from "@heroui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ReviewTable } from "../../components/review/ReviewTable";
import { REVIEW_KEY } from "../../constants/query-key";
import { useDebounce } from "../../hooks/useDebounce";
import { getAllReviews } from "../../service/review.service";

export default function ReviewPage() {
  const [searchText, setSearchText] = useState("");
  const { data } = useSuspenseQuery({ queryKey: [REVIEW_KEY], queryFn: getAllReviews });
  const reviews = data?.reviews || [];

  const debouncedSearchText = useDebounce(searchText, 300);

  const filteredReviews = useMemo(() => {
    if (debouncedSearchText === "") {
      return reviews;
    } else {
      return reviews.filter((review) =>
        review.comment.toLowerCase().includes(debouncedSearchText.toLowerCase())
      );
    }
  }, [debouncedSearchText, reviews]);

  return (
    <div>
      <h1 className="mb-3 text-center text-xl font-bold">All Reviews</h1>
      <div className="mb-3 flex items-center justify-between">
        <p>
          Total Reviews: <strong>{filteredReviews.length}</strong>
        </p>

        <div>
          <Input
            variant="bordered"
            size="sm"
            placeholder="Search reviews by comment..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[250px]"
          />
        </div>
      </div>
      <ReviewTable reviews={filteredReviews} />
    </div>
  );
}
