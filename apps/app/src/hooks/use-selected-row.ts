import { useState } from "react";

const useSelectedRow = () => {
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(
    null
  );

  return { selectedRow, setSelectedRow };
};

export default useSelectedRow;
