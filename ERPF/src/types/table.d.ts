import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { PaginationState, Table } from "@tanstack/react-table";
import { TableOptions } from "@tanstack/react-table";
import { AxiosError } from "axios";

interface CustomTableOptions<TData extends object> extends TableOptions<TData> {
  // custom properties
  tableId?: string;
}

interface TableHeaderI<TData extends object> {
  table: Table<TData>;
  columnOrder: ColumnOrderState;
  columnIdsToSort: string[];
  persistColumnSorting?: boolean;
}

interface TableBodyI<TData extends object> {
  table: Table<TData>;
  hasSubComponent?: boolean;
  renderSubComponent?: (row: Row<TData>) => React.ReactElement ;
  trClasses?: string;
  isLoading?: boolean;
}

interface FooterI<TData extends object> {
  table: Table<TData>;
  withFooter?: boolean;
  totalPages: number;
  totalCount: number;
  showTableOptions?: boolean;
  showColumnVisibilityButton?: boolean;
  persistColumnVisibility?: boolean;
  persistColumnPinning?: boolean;
  showPinningButton?: boolean;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
}

interface MainTableI<TData extends object>
  extends FooterI<TData>,
    TableBodyI<TData>,
    TableHeaderI<TData> {
  id: string;
  table: Table<TData>;
  isError?: boolean;
  isLoading?: boolean;
  error?: Error | AxiosError | null | undefined;
  setColumnOrder: (
    updater: (oldOrder: ColumnOrderState) => ColumnOrderState
  ) => void;
  excludeColumnFromSwap?: string[];
  notFoundPage?: React.ReactNode;
  noDataFoundDescription?: string | undefined;
  noDataFoundChildren? : React.ReactElement
}
