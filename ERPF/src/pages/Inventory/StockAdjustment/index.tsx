import { useState, useMemo } from "react";
import { Button, Badge, Divider, Text } from "@mantine/core";
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
import MainHeader from "@components/Header/MainHeader";
import dayJs from "@utils/daysJs";

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
        minSize: 160,
        size: 220,
        id: "batch.medicine.brand_name",
        accessorKey: "batch.medicine.brand_name",
        header: "Medicine",
        cell: (info) => info.row.original.batch?.medicine?.brand_name || "N/A",
      },
      {
        id: "batch.batch_no",
        minSize: 80,
        size: 100,
        accessorKey: "batch.batch_no",
        header: "Batch",
        cell: (info) => info.row.original.batch?.batch_no || "N/A",
      },
      {
        id: "created_at",
        accessorKey: "created_at",
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
        minSize: 80,
        size: 120,
        id: "quantity_change",
        accessorKey: "quantity_change",
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
      { id: "reason", accessorKey: "reason", header: "Reason" },
      { id: "note", accessorKey: "note", header: "Note" },
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
    initialState: {
      columnPinning: {
        left: ["batch.medicine.brand_name"],
        right: ["action"],
      },
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
    <div className="w-full h-full flex flex-col relative">
      <MainHeader
        title=""
        modalButton={
          <Button leftSection={<MdAdd />} onClick={open}>
            New Adjustment
          </Button>
        }
      />
      <Divider />
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
    </div>
  );
};

export default StockAdjustment;
