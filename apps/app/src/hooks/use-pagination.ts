import { useState } from "react";

function usePagination() {
  const [page, setPage] = useState(1);

  return { get: page, set: setPage };
}

export default usePagination;
