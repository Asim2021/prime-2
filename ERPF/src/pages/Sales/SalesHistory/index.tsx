import {
  ActionIcon,
  Badge,
  Divider,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { MdVisibility } from "react-icons/md";
import MainTable from "@components/Table";
import { fetchAllSales } from "@services/salesService";
import { SaleI } from "@src/types/sales";
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
import MainHeader from "@components/Header/MainHeader";
import dayJs from "@utils/daysJs";

const SalesHistory = ({ withHeader = true }: { withHeader?: boolean }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isError, isFetching, error } = usePaginationDataFetch({
    queryKey: [QUERY_KEY.SALES, "history"],
    queryFn: fetchAllSales,
    search: search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const columns = useMemo(
    () => [
      {
        id: "bill_no",
        accessorKey: "bill_no",
        header: "Bill No",
      },
      {
        id: "bill_date",
        accessorKey: "bill_date",
        header: "Date",
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
        id: "customer_name",
        accessorKey: "customer_name",
        header: "Customer",
      },
      {
        id: "total_amount",
        accessorKey: "total_amount",
        header: "Amount",
      },
      {
        id: "payment_mode",
        accessorKey: "payment_mode",
        header: "Mode",
        cell: (info: any) => (
          <Badge
            color={
              info.getValue() === "cash"
                ? "green"
                : info.getValue() === "credit"
                  ? "orange"
                  : "blue"
            }
          >
            {info.getValue().toUpperCase()}
          </Badge>
        ),
      },
      {
        id: "action",
        cell: () => (
          <Group gap="xs">
            <Tooltip label="View Invoice">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => {}} // Placeholder for now
              >
                <MdVisibility size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    columns?.map((c) => (c as any).accessorKey || (c as any).id),
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: { sorting, pagination, columnOrder },
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    tableId: "sales-history-table",
  } as CustomTableOptions<SaleI>);

  return (
    <div className="w-full h-full flex flex-col relative">
      <MainHeader
        title={withHeader ? "Sales History" : ""}
        search={search}
        setSearch={setSearch}
        withSearch
        placeholder="Search Bill No, Customer..."
      />
      <Divider />
      <MainTable
        className="flex-1 h-auto!"
        id="sales-history-table"
        table={table}
        isLoading={isFetching}
        isError={isError}
        error={error}
        totalCount={data?.meta?.total || 0}
        totalPages={data?.meta?.totalPages || 0}
        setPagination={setPagination}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnIdsToSort={[
          "bill_no",
          "bill_date",
          "customer_name",
          "total_amount",
        ]}
        withFooter
      />
      {/* {viewId && (
        <InvoiceViewer
          opened={!!viewId}
          onClose={() => setViewId(null)}
          saleId={viewId}
        />
      )} */}
    </div>
  );
};

export default SalesHistory;
