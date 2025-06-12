import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { REVIEW_KEY } from "../../constants/query-key";
import { deleteReview } from "../../service/review.service";

const columns = [
  { id: "reviewer", name: "Reviewer" },
  { id: "rating", name: "Rating" },
  { id: "comment", name: "Comment" },
  { id: "time_frame", name: "Review Time" },
  { id: "actions", name: "Actions" },
];

export function ReviewTable({ reviews }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const pages = Math.ceil(reviews.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reviews.slice(start, end);
  }, [page, reviews]);

  const handleDelete = async (reviewId) => {
    console.log(reviewId);
    const { isConfirmed } = await Swal.fire({
      showCloseButton: true,
      title: "Are you sure?",
      text: "This action can not be undone.",
      icon: "question",
      confirmButtonText: "Delete",
    });
    if (isConfirmed) {
      await deleteReview(reviewId);
      queryClient.invalidateQueries({ queryKey: [REVIEW_KEY] });
    }
  };

  return (
    <>
      <Table isStriped aria-label="All Reviews Table" className="">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.id} align={column.id === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.reviewer_name}</TableCell>
              <TableCell>{item.rating}</TableCell>
              <TableCell>{item.comment}</TableCell>
              <TableCell>{new Date(item.time_frame).toLocaleString()}</TableCell>
              <TableCell>
                <Button color="danger" size="sm" isIconOnly onPress={() => handleDelete(item.id)}>
                  <TrashIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </>
  );
}
