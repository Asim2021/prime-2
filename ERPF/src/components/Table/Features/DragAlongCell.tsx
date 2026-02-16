import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Cell, flexRender } from "@tanstack/react-table";
import { getCommonPinningStyles } from "../utils";

const DragAlongCell = <TData extends object>({
  cell,
}: {
  cell: Cell<TData, unknown>;
}) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
    animateLayoutChanges: () => true,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.67 : 1,
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition:
      "all 0.4s ease-in-out, transform 0.4s cubic-bezier(.17,.67,.83,.67)",
    width: cell.column.getSize() || "100%",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td
      style={{
        ...style,
        ...getCommonPinningStyles(cell.column),
      }}
      ref={setNodeRef}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

export default DragAlongCell;
