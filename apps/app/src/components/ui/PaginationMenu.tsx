import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";

interface props {
  page: number;
  setPage: any;
  count: number | undefined;
  rowsDisplayed: number;
}

const PaginationMenu = ({ page, setPage, count, rowsDisplayed }: props) => {
  let items: number[] = [];
  if (!count) count = 0;

  const calculatePages = () => {
    for (
      let i = 0;
      i <
      (Math.ceil(count / rowsDisplayed) < 5
        ? Math.ceil(count / rowsDisplayed)
        : 5);
      i++
    ) {
      const pageNo = page + 2 - i;
      items.unshift(pageNo);
    }

    for (let i = 0; i < 2; i++) {
      if (items[0] < 1) items = items.map((e) => e + 1);
      if (items[items.length - 1] > Math.ceil(count / rowsDisplayed))
        items = items.map((e) => e - 1);
    }
  };

  calculatePages();

  useEffect(() => {
    calculatePages();
  }, [page]);
  return (
    <div className="w-full flex justify-between items-center flex-col-reverse sm:flex-row gap-2 px-2 mt-2">
      <span className="flex-1 text-sm text-muted-foreground w-fit">
        Pagina {page} de {Math.ceil(count / rowsDisplayed)}
      </span>

      <Pagination className="w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              onClick={page > 1 ? () => setPage(1) : () => {}}
              className={page > 1 ? "" : "text-muted-foreground"}
            ></PaginationFirst>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              onClick={page > 1 ? () => setPage(page - 1) : () => {}}
              className={page > 1 ? "" : "text-muted-foreground"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={
                page < Math.ceil(count / rowsDisplayed)
                  ? () => setPage(page + 1)
                  : () => {}
              }
              className={
                page < Math.ceil(count / rowsDisplayed)
                  ? ""
                  : "text-muted-foreground"
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              onClick={
                page < Math.ceil(count / rowsDisplayed)
                  ? () => setPage(Math.ceil(count / rowsDisplayed))
                  : () => {}
              }
              className={
                page < Math.ceil(count / rowsDisplayed)
                  ? ""
                  : "text-muted-foreground"
              }
            ></PaginationLast>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationMenu;
