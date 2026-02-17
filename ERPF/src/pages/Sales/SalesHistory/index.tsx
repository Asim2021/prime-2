import { ActionIcon, Group, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { MdVisibility } from "react-icons/md";
import MainTable from "@components/Table";
import { fetchAllSales } from "@services/salesService";
import dayjs from "dayjs";
import { CustomTableOptions } from "@src/types/table";
import { SaleI } from "@src/types/sales";

import { useNavigate } from "react-router";

const SalesHistory = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sales", pagination, sorting],
    queryFn: () =>
      fetchAllSales({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id || "created_at",
        order: sorting[0]?.desc ? "DESC" : "ASC",
      }),
  });

  const columns = useMemo<ColumnDef<SaleI>[]>(
    () => [
      {
        accessorKey: "bill_date",
        header: "Date",
        cell: ({ row }) =>
          dayjs(row.original.bill_date).format("DD MMM YYYY, hh:mm A"),
      },
      {
        accessorKey: "bill_no",
        header: "Bill No",
      },
      {
        accessorKey: "customer_name",
        header: "Customer",
        cell: ({ row }) => (
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {row.original.customer_name}
            </Text>
            {row.original.customer_phone && (
              <Text size="xs" c="dimmed">
                {row.original.customer_phone}
              </Text>
            )}
          </Stack>
        ),
      },
      {
        accessorKey: "total_amount",
        header: "Amount",
        cell: ({ row }) => (
          <Text fw={600}>₹{Number(row.original.total_amount).toFixed(2)}</Text>
        ),
      },
      {
        accessorKey: "payment_mode",
        header: "Mode",
        cell: ({ row }) => (
          <Text tt="capitalize">{row.original.payment_mode}</Text>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => navigate(`${row.original.id}`)}
          >
            <MdVisibility size={16} />
          </ActionIcon>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: { pagination, sorting, columnOrder },
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    tableId: "sales-history",
  } as CustomTableOptions<SaleI>);

  return (
    <Stack h="100%" p="md">
      <Group justify="space-between">
        <Title order={3}>Sales History</Title>
      </Group>
      <MainTable
        id="sales-history"
        table={table}
        isLoading={isLoading}
        isError={isError}
        error={error}
        totalCount={data?.totalCount || 0}
        totalPages={data?.totalPages || 0}
        setPagination={setPagination}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnIdsToSort={[
          "bill_date",
          "bill_no",
          "total_amount",
          "customer_name",
        ]}
        withFooter
      />
    </Stack>
  );
};

export default SalesHistory;
