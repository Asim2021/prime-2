import ToggleColumnMenu from "./ToggleColumnVisibility";
import React from "react";
import ToggleColumnPinning from "./ToggleColumnPinning";
import { Flex, Pagination, Select } from "@mantine/core";
import { FooterI } from "@src/types/table";
import { useViewportSize } from "@mantine/hooks";
import classes from "../table.module.css";

const Footer = <TData extends object>({
  table,
  setPagination,
  withFooter,
  showTableOptions,
  showColumnVisibilityButton,
  showPinningButton,
  persistColumnVisibility,
  persistColumnPinning,
  totalPages,
  totalCount,
}: FooterI<TData>) => {
  const { width } = useViewportSize();
  const getRecordRangeText = () => {
    const start =
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
      1; // Calculate start index (1-based)
    const end = Math.min(
      start + table.getState().pagination.pageSize - 1,
      totalCount
    ); // Calculate end index
    return `${start} - ${end} out of ${totalCount}`;
  };

  return withFooter ? (
    <footer
      className={
        setPagination ? `${classes.tableFooter}` : " !flex !gap-2 !justify-end"
      }
    >
      <>
        <Flex align={"center"} gap={8} maw={"10rem"}>
          <React.Fragment>
            {setPagination && (
              <Select
                id="page-size"
                checkIconPosition="right"
                data={["10", "20", "50", "100"]}
                placeholder="Select Page Size"
                title="Page Size"
                defaultValue="10"
                value={String(table.getState().pagination.pageSize)}
                onChange={(pageSize) =>
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: parseInt(pageSize as string),
                  }))
                }
                className="pl-1 max-w-24 min-w-20"
              />
            )}
            {showTableOptions?<>
              {showColumnVisibilityButton && (
                <ToggleColumnMenu
                  table={table}
                  persistColumnVisibility={persistColumnVisibility}
                />
              )}
              {showPinningButton && (
                <ToggleColumnPinning
                  table={table}
                  persistColumnPinning={persistColumnPinning}
                />
              )}
            </> : null}
          </React.Fragment>
        </Flex>
        {setPagination && (
          <div className="flex items-center gap-2">
            <span className="text-dark-300">{getRecordRangeText()}</span>
            <Pagination
              withEdges={width >= 700}
              value={table.getState().pagination.pageIndex + 1}
              total={totalPages}
              onNextPage={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              onPreviousPage={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0),
                }))
              }
              onLastPage={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: totalPages - 1,
                }))
              }
              onFirstPage={() =>
                setPagination((prev) => ({ ...prev, pageIndex: 0 }))
              }
              onChange={(pageNumber) => {
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: pageNumber - 1,
                }));
              }}
            />
          </div>
        )}
      </>
    </footer>
  ) : null;
};
export default Footer;
