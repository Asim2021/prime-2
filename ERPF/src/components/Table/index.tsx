import React, { useEffect } from "react";
import CenterLoader from "@components/CenterLoader/Index";
import { LOCAL_STORAGE_KEYS } from "@constants/strings";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ScrollArea } from "@mantine/core";
import NoDataFound from "@components/NoDataFound";
import { CustomTableOptions, MainTableI } from "@src/types/table";
import {
  ColumnOrderState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import Footer from "./Features/Footer";
import TableBody from "./Features/TableBody";
import TableHead from "./Features/TableHead";
import classes from "./table.module.css";

/** @format */

const MainTable = <TData extends object>({
  table,
  hasSubComponent = false,
  isError = false,
  isLoading = false,
  error,
  columnOrder = [],
  setColumnOrder,
  columnIdsToSort = [],
  renderSubComponent = (): React.ReactElement => <></>,
  id = "tanstack-table",
  excludeColumnFromSwap = [],
  notFoundPage = null,
  withFooter = false,
  totalPages = 0,
  setPagination,
  totalCount = 0,
  trClasses,
  showTableOptions = false,
  persistColumnVisibility = false,
  persistColumnPinning = false,
  showColumnVisibilityButton = false,
  showPinningButton = false,
  persistColumnSorting = false,
  noDataFoundDescription = undefined,
  noDataFoundChildren = undefined,
  className,
}: MainTableI<TData>) => {
  const tableId = (table.options as CustomTableOptions<TData>)?.tableId;

  useEffect(() => {
    const visibilityKey = `${tableId}-${LOCAL_STORAGE_KEYS.COLUMN_VISIBILITY}`;
    const pinningKey = `${tableId}-${LOCAL_STORAGE_KEYS.COLUMN_PINNING}`;
    const sortingKey = `${tableId}-${LOCAL_STORAGE_KEYS.COLUMN_SORTING}`;

    const currentVisibility = JSON.parse(
      localStorage.getItem(visibilityKey) || "null",
    ) as VisibilityState;
    const currentPinning = JSON.parse(
      localStorage.getItem(pinningKey) || "null",
    ) as VisibilityState;
    const currentSorting = JSON.parse(
      localStorage.getItem(sortingKey) || "null",
    ) as SortingState;

    // Handle column visibility persistence
    if (
      persistColumnVisibility &&
      currentVisibility &&
      JSON.stringify(currentVisibility) !==
        JSON.stringify(table.getState().columnVisibility)
    ) {
      table.setColumnVisibility(currentVisibility);
    }
    // Handle column pinning persistence
    if (
      persistColumnPinning &&
      currentPinning &&
      JSON.stringify(currentPinning) !==
        JSON.stringify(table.getState().columnPinning)
    ) {
      table.setColumnPinning(currentPinning);
    }
    // Handle column sorting persistence
    if (
      persistColumnSorting &&
      currentSorting &&
      JSON.stringify(currentSorting) !==
        JSON.stringify(table.getState().sorting)
    ) {
      table.setSorting(currentSorting);
    }
  }, [tableId, table]);

  // reorder columns after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!setColumnOrder && typeof setColumnOrder !== "function") {
      throw new Error("Please provide setColumnOrder function as props");
    }
    if (
      excludeColumnFromSwap?.length > 0 &&
      excludeColumnFromSwap?.includes(over?.id as string)
    )
      return; // skip re-ordering of toggle column
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder: ColumnOrderState) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!columnOrder) {
    throw new Error("Please provide columnOrder props");
  } else if (!Array.isArray(columnOrder)) {
    throw new Error("columnOrder props should be an Array!");
  }

  if (isLoading && !isError) {
    return <CenterLoader />;
  }

  return (
    <main className={`${classes.mainContiner} ${className || ""}`}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={id + "-dnd-container"}
      >
        <ScrollArea id={id + "-container"} className={classes.tableContainer}>
          <table id={id} className="border-collapse">
            <TableHead
              table={table}
              columnOrder={columnOrder}
              columnIdsToSort={columnIdsToSort}
              persistColumnSorting={persistColumnSorting}
            />
            {isError ? (
              <span className="absolute content-center w-full h-full text-lg text-center">
                {`Error: ${error?.message || "Something went wrong!"}`}
              </span>
            ) : table?.getRowModel()?.rows?.length === 0 ? (
              <span className="absolute !h-full !w-full">
                {notFoundPage ? (
                  notFoundPage
                ) : (
                  <NoDataFound
                    className="!absolute"
                    description={noDataFoundDescription}
                    children={noDataFoundChildren}
                  />
                )}
              </span>
            ) : (
              <TableBody
                table={table}
                hasSubComponent={hasSubComponent}
                renderSubComponent={renderSubComponent}
                trClasses={trClasses}
              />
            )}
          </table>
        </ScrollArea>
        {withFooter && (
          <Footer
            setPagination={setPagination}
            table={table}
            withFooter={withFooter}
            showTableOptions={showTableOptions}
            showColumnVisibilityButton={showColumnVisibilityButton}
            showPinningButton={showPinningButton}
            persistColumnVisibility={persistColumnVisibility}
            persistColumnPinning={persistColumnPinning}
            totalPages={totalPages}
            totalCount={totalCount}
          />
        )}
      </DndContext>
    </main>
  );
};

export default MainTable;

/**
 * To make column resizable give size, minSize & maxSize to the each column in your columns definition.
 *  @param {number} size :  the default initial width of column.
 *  @param {number} minSize : the minimum width column could go while resizing.
 *  @param {number} maxSize : the maximum width column could go while resizing.
 */
