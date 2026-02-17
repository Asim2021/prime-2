import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  PaginationState,
  ColumnDef,
} from "@tanstack/react-table";
import { ActionIcon, Badge, Text, Button } from "@mantine/core";
import { MdAdd, MdVisibility } from "react-icons/md";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

import MainHeader from "@components/Header/MainHeader";
import MainTable from "@components/Table";
import { ENDPOINT } from "@constants/endpoints";
import { fetchAllPurchases } from "@services/purchaseService";
import { CustomTableOptions } from "@src/types/table";
import { useMemo } from "react";

const PurchaseList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["purchases", pagination, debouncedSearch, sorting],
    queryFn: () =>
      fetchAllPurchases({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        sortBy: sorting.length > 0 ? sorting[0].id : "created_at",
        order: sorting.length > 0 ? (sorting[0].desc ? "DESC" : "ASC") : "DESC",
      }),
  });

  const columns = useMemo<ColumnDef<PurchaseI>[]>(
    () => [
      {
        id: "invoice_date",
        accessorKey: "invoice_date",
        header: "Date",
        cell: ({ row }) =>
          dayjs(row.original.invoice_date).format("DD MMM YYYY"),
      },
      {
        id: "invoice_no",
        accessorKey: "invoice_no",
        header: "Invoice No",
        cell: ({ row }) => (
          <Text fw={500} size="sm">
            {row.original.invoice_no}
          </Text>
        ),
      },
      {
        id: "vendor.name",
        accessorKey: "vendor.name",
        header: "Vendor",
        // Fallback to vendor_name if populated or ID
        cell: ({ row }) =>
          (row.original as any).vendor?.name ||
          row.original.vendor_name ||
          row.original.vendor_id,
      },
      {
        id: "total_amount",
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: ({ row }) => (
          <Text fw={600} size="sm">
            ₹{row.original.total_amount}
          </Text>
        ),
      },
      {
        id: "items",
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => (
          <Badge variant="light" color="gray">
            {row.original.items?.length || 0} Items
          </Badge>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => {
              navigate(`${ENDPOINT.PURCHASE.DETAILS}/${row.original.id}`);
            }}
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
    state: { sorting, pagination, columnOrder },
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    tableId: "purchases-table",
  } as CustomTableOptions<PurchaseI>);

  return (
    <div className="w-full h-full pb-24 relative">
      <MainHeader
        title="Purchase History"
        search={search}
        setSearch={setSearch}
        withSearch
        modalButton={
          <Button
            leftSection={<MdAdd size={18} />}
            onClick={() => navigate(ENDPOINT.PURCHASE.CREATE)}
          >
            Add Purchase
          </Button>
        }
      />
      <MainTable
        id="purchases-table"
        table={table}
        isLoading={isLoading}
        isError={isError}
        error={error}
        totalCount={data?.totalCount || 0}
        totalPages={data?.totalPages || 0}
        setPagination={setPagination}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnIdsToSort={["invoice_date", "invoice_no", "total_amount"]}
        withFooter
      />
    </div>
  );
};

export default PurchaseList;
