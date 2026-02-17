import MainTable from "@components/Table";
import { useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import {
  ColumnOrderState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import useUserColumn from "./useUserColumn";
import { TABLES } from "@constants/tables";
import { CustomTableOptions } from "@src/types/table";
import { INITIAL_ALL_TABLE_PINNING } from "@constants/items";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { QUERY_KEY } from "@constants/queryKeys";
import { fetchAllUser } from "@services/userService";
import { USER_COLUMNS } from "../../constant";

const UserTable = ({ searchUser }: UserTableI) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { columns } = useUserColumn();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    columns?.map((c) => c.id as string),
  );

  const [debouncedSearch] = useDebouncedValue(searchUser, 400);

  const {
    data: users,
    isFetching,
    isError,
    error,
  } = usePaginationDataFetch({
    queryKey: [QUERY_KEY.GET_ALL_USERS],
    queryFn: fetchAllUser,
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const usersData = useMemo<UserI[]>(
    () => (users?.data as UserI[]) || [],
    [users],
  );

  const table = useReactTable<UserI>({
    tableId: TABLES.USERS,
    data: usersData,
    columns,
    state: {
      sorting,
      columnOrder,
      pagination,
    },
    initialState: {
      columnPinning: INITIAL_ALL_TABLE_PINNING,
    },
    columnResizeMode: "onChange",
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // use this instead of onPaginationChange
  } as CustomTableOptions<UserI>);

  const sortableHeader = [USER_COLUMNS.USERNAME];

  return (
    <MainTable
      id={TABLES.USERS}
      table={table}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      columnIdsToSort={sortableHeader}
      excludeColumnFromSwap={[USER_COLUMNS.USERNAME, USER_COLUMNS.ACTION]}
      totalPages={(users as any)?.totalPages ?? 1}
      totalCount={(users as any)?.totalCount ?? 0}
      isLoading={isFetching}
      isError={isError}
      error={error as Error}
      setPagination={setPagination}
      withFooter
      showTableOptions
      showColumnVisibilityButton
      showPinningButton
      persistColumnPinning
      persistColumnSorting
    />
  );
};
export default UserTable;

interface UserTableI {
  searchUser: string;
}
