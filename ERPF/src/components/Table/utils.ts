import { Column } from "@tanstack/react-table";
import { CSSProperties } from "react";

export const getCommonPinningStyles = <TData extends object>(
  column: Column<TData>
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
      ? "4px 0 4px -4px gray inset"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.92 : 1,
    position: isPinned ? "sticky" : "relative",
    zIndex: isPinned ? 10 : 0,
    background:  "inherit",
  };
};
