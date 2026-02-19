import { useState, useMemo } from "react";
import { Button, Group, Stack, Title, Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchStockAdjustments } from "@services/inventoryService";
import { QUERY_KEY } from "@constants/queryKeys";
import MainTable from "@components/Table";
import { MdAdd } from "react-icons/md";
import StockAdjustmentModal from "./StockAdjustmentModal";
import { useDisclosure } from "@mantine/hooks";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  PaginationState,
  ColumnOrderState,
} from "@tanstack/react-table";
import { CustomTableOptions } from "@src/types/table";

const StockAdjustment = ({ withHeader = true }: { withHeader?: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
    "created_at",
    "medicine.brand_name",
    "batch.batch_no",
    "quantity_change",
    "reason",
    "note",
  ]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      QUERY_KEY.STOCK_ADJUSTMENTS,
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: () =>
      fetchStockAdjustments({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: "Date",
        cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      },
      {
        accessorKey: "medicine.brand_name",
        header: "Medicine",
        cell: (info) => info.row.original.medicine?.brand_name || "N/A",
      },
      {
        accessorKey: "batch.batch_no", // Changed from batch_number to batch_no to match DB
        header: "Batch",
        cell: (info) => info.row.original.batch?.batch_no || "N/A",
      },
      {
        accessorKey: "quantity_change", // Changed from quantity_adjustment to quantity_change to match DB
        header: "Adjustment",
        cell: (info) => {
          const val = info.getValue() as number;
          return (
            <Badge color={val > 0 ? "green" : "red"}>
              {val > 0 ? "+" : ""}
              {val}
            </Badge>
          );
        },
      },
      { accessorKey: "reason", header: "Reason" },
      { accessorKey: "note", header: "Note" }, // Added Note column
    ],
    [],
  );

  const tableData = data?.data || [];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
      columnOrder,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    tableId: "stock-adjustment-table",
    manualPagination: true,
    pageCount: data?.totalPages || -1,
  } as CustomTableOptions<any>);

  return (
    <Stack h="100%" gap="md">
      {withHeader && (
        <Group justify="space-between">
          <Title order={3}>Stock Adjustments</Title>
          <Button leftSection={<MdAdd />} onClick={open}>
            New Adjustment
          </Button>
        </Group>
      )}

      {!withHeader && (
        <Group justify="flex-end">
          <Button leftSection={<MdAdd />} onClick={open}>
            New Adjustment
          </Button>
        </Group>
      )}

      <MainTable
        className="flex-1 h-auto!"
        id="stock-adjustment-table"
        table={table}
        isLoading={isLoading}
        isError={isError}
        error={error}
        totalCount={data?.totalCount || 0}
        totalPages={data?.totalPages || 0}
        setPagination={setPagination}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnIdsToSort={["created_at", "quantity_change"]}
        withFooter
      />

      <StockAdjustmentModal opened={opened} close={close} />
    </Stack>
  );
};

export default StockAdjustment;
