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
  ColumnOrderState,
} from "@tanstack/react-table";
import {
  ActionIcon,
  Badge,
  Text,
  Button,
  Divider,
  HoverCard,
  Alert,
  Group,
} from "@mantine/core";
import { MdAdd, MdInfo, MdVisibility } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

import MainHeader from "@components/Header/MainHeader";
import MainTable from "@components/Table";
import { fetchAllPurchases } from "@services/purchaseService";
import PurchaseViewer from "./components/PurchaseViewer";
import { CustomTableOptions } from "@src/types/table";
import { QUERY_KEY } from "@constants/queryKeys";
import { useMemo } from "react";
import dayJs from "@utils/daysJs";

const PurchaseList = ({
  handleTabChange,
  withTitle = false,
}: {
  handleTabChange?: (value: string | null) => void;
  withTitle?: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [viewId, setViewId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.PURCHASES, pagination, debouncedSearch, sorting],
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
        id: "invoice_date",
        accessorKey: "invoice_date",
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
          <HoverCard>
            <HoverCard.Target>
              <Badge variant="light" color="gray">
                {row.original.items?.length || 0} Items
              </Badge>
            </HoverCard.Target>
            {!!row.original?.items?.length && (
              <HoverCard.Dropdown>
                {row.original.items?.map((ele) => {
                  return (
                    <Alert
                      icon={<MdInfo />}
                      title={ele.batch?.medicine?.brand_name || "N/A"}
                      color="blue"
                      variant="light"
                    >
                      <Group justify="space-between">
                        <Text size="sm">
                          Purchase Quantity: <b>{ele?.purchase_quantity}</b>
                        </Text>
                        <Text size="sm">
                          Expiry:{" "}
                          <b>
                            {dayJs(ele?.batch?.exp_date).format("DD/MM/YYYY")}
                          </b>
                        </Text>
                      </Group>
                    </Alert>
                  );
                })}
              </HoverCard.Dropdown>
            )}
          </HoverCard>
        ),
      },
      {
        id: "action",
        size: 80,
        cell: ({ row }) => (
          <ActionIcon
            variant="light"
            radius={"100%"}
            color="blue"
            onClick={() => setViewId(row.original.id as string)}
          >
            <MdVisibility size={16} />
          </ActionIcon>
        ),
      },
    ],
    [],
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    columns?.map((c) => c.id as string),
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: { sorting, pagination, columnOrder },
    initialState: {
      columnPinning: {
        left: ["invoice_no"],
        right: ["action"],
      },
    },
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
        title={withTitle ? "Purchase History" : ""}
        search={search}
        setSearch={setSearch}
        withSearch
        modalButton={
          <Button
            leftSection={<MdAdd size={18} />}
            onClick={() => handleTabChange && handleTabChange("new_purchase")}
          >
            Add Purchase
          </Button>
        }
      />
      <Divider />
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

      {viewId && (
        <PurchaseViewer
          opened={!!viewId}
          onClose={() => setViewId(null)}
          purchaseId={viewId}
        />
      )}
    </div>
  );
};

export default PurchaseList;
