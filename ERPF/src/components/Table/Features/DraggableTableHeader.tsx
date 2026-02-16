import React from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import { MdOutlineDragIndicator } from "react-icons/md";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { rem } from "@mantine/core";
import { flexRender, Header, Table } from "@tanstack/react-table";
import { getCommonPinningStyles } from "../utils";
import clsx from "clsx";
import { LOCAL_STORAGE_KEYS } from "@constants/strings";
import { CustomTableOptions } from "@src/types/table";

const DraggableTableHeader = <TData extends object>({
  table,
  header,
  columnIdsToSort,
  persistColumnSorting,
}: {
  table: Table<TData>;
  header: Header<TData, unknown>;
  columnIdsToSort: string[];
  persistColumnSorting?: boolean;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
      animateLayoutChanges: () => true,
    });

  const sortHandler = (header: Header<TData, unknown>) => {
    const id = header?.column?.columnDef?.id;
    if (columnIdsToSort.includes(id as string)) {
      header.column.toggleSorting();
      if (persistColumnSorting) {
        if (header.column.getIsSorted() === "desc") {
          localStorage.setItem(
            `${(table.options as CustomTableOptions<TData>)?.tableId}-${
              LOCAL_STORAGE_KEYS.COLUMN_SORTING
            }`,
            JSON.stringify([])
          );
          return;
        }
        localStorage.setItem(
          `${(table.options as CustomTableOptions<TData>)?.tableId}-${
            LOCAL_STORAGE_KEYS.COLUMN_SORTING
          }`,
          JSON.stringify([
            {
              id,
              desc: header.column.getIsSorted() === "asc",
            },
          ])
        );
      }
    }
  };

  const style: React.CSSProperties = {
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition:
      "all 0.3s ease-in-out, transform 0.3s cubic-bezier(.17,.67,.83,.67)",
    whiteSpace: "nowrap",
    width: `${header.getSize()}px`,
    zIndex: isDragging ? 1 : 0,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={{ ...style, ...getCommonPinningStyles(header.column) }}
      {...attributes}
      className={clsx(header.column.getIsPinned() && "!bg-primary-600")}
    >
      <div>
        {header.isPlaceholder ? null : isDragging ? (
          <div className="flex gap-2 items-center justify-center bg-white px-3 py-2 rounded !text-gray-700 border border-veryLightGrey">
            <MdOutlineDragIndicator className="!w-3 !h-3" />
            <span>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>
          </div>
        ) : (
          <div className="!w-full flex">
            <div
              className={
                header.column.getCanSort()
                  ? " select-none flex w-full justify-center !cursor-default"
                  : ""
              }
              title={
                header.column.getCanSort()
                  ? header.column.getNextSortingOrder() === "asc"
                    ? "Sort Ascending"
                    : header.column.getNextSortingOrder() === "desc"
                    ? "Sort Descending"
                    : "Clear Sort"
                  : undefined
              }
            >
              <span
                className="flex w-full justify-center items-center mx-4"
                onClick={() => sortHandler(header)}
              >
                {typeof header.column.columnDef.header === "string" && (
                  <span {...listeners} className="cursor-grab">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </span>
                )}
                {typeof header.column.columnDef.header !== "string" && (
                  <span className="cursor-default">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </span>
                )}
                {typeof header.column.columnDef.header === "string" &&
                  columnIdsToSort.includes(header.column.id) &&
                  !header.column.getIsSorted() && (
                    <FaSort
                      size={18}
                      style={{ marginLeft: rem(6) }}
                      cursor={"pointer"}
                    />
                  )}
                {{
                  asc: (
                    <FaSortUp
                      color={"gray.7"}
                      size={18}
                      style={{ marginLeft: rem(6) }}
                      cursor={"pointer"}
                    />
                  ),
                  desc: (
                    <FaSortDown
                      color={"gray.7"}
                      size={18}
                      style={{ marginLeft: rem(6) }}
                      cursor={"pointer"}
                    />
                  ),
                }[header.column.getIsSorted() as string] ?? null}
              </span>
            </div>
            {/*--------- Resizing ---------*/}
            {header.column.id !== "action" && (
              <div
                className={`resizer ${
                  header.column.getIsResizing()
                    ? "isResizing !cursor-col-resize"
                    : "!cursor-col-resize"
                }`}
                onDoubleClick={() => header.column.resetSize()}
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                style={{
                  transform: header.column.getIsResizing()
                    ? `translateX(${header.column.getSize ?? 0}px)`
                    : "",
                }}
              >
                <span className="border mr-1"></span>
              </div>
            )}
          </div>
        )}
      </div>
    </th>
  );
};

export default DraggableTableHeader;
