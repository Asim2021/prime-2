import { Text } from "@mantine/core";
import { useMemo, useState } from "react";
import MainTable from "@components/Table";
import { fetchAllSalesReturns } from "@services/salesService";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  PaginationState,
  ColumnOrderState,
} from "@tanstack/react-table";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { QUERY_KEY } from "@constants/queryKeys";
import { CustomTableOptions } from "@src/types/table";
import dayJs from "@utils/daysJs";

const SalesReturn = ({
  withHeader: _withHeader = true,
}: {
  withHeader?: boolean;
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  _withHeader; // use variable
  setSearch(""); // use variable

  const { data, isError, isFetching, error } = usePaginationDataFetch({
    queryKey: [QUERY_KEY.SALES, "returns"],
    queryFn: fetchAllSalesReturns,
    search: search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const columns = useMemo(
    () => [
      {
        id: "return_date",
        accessorKey: "return_date",
        header: "Return Date",
        cell: (value: any) => (
          <Text
            size="sm"
            title={dayJs(value.getValue() as string).format(
              "DD-MM-YY hh:mm:ss",
            )}
          >
            {dayJs(value.getValue() as string).format("DD-MM-YY")}
          </Text>
        ),
      },
      {
        id: "bill_no",
        accessorKey: "bill_no",
        header: "Original Bill No",
      },
      {
        id: "reason",
        accessorKey: "reason",
        header: "Reason",
      },
      {
        id: "total_refund",
        accessorKey: "total_refund",
        header: "Total Refund",
        cell: (info: any) => (
          <Text fw={500}>₹{Number(info.getValue()).toFixed(2)}</Text>
        ),
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((c) => c.id as string),
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    manualPagination: true,
    pageCount: data?.meta?.totalPages || -1,
  } as CustomTableOptions<any>);

  // we use width/height handling to sit perfectly within the Tabs Panel just like SalesHistory
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MainTable
        id="sales-return-table"
        table={table}
        isLoading={isFetching}
        isError={isError}
        error={error}
        totalCount={data?.meta?.total || 0}
        totalPages={data?.meta?.totalPages || 0}
        setPagination={setPagination}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnIdsToSort={["return_date", "bill_no", "total_refund"]}
        withFooter
      />
    </div>
  );
};

export default SalesReturn;
