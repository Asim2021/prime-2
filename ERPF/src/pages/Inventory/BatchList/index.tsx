import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  PaginationState,
  ColumnOrderState,
} from "@tanstack/react-table";

import MainHeader from "@components/Header/MainHeader";
import MainTable from "@components/Table";
import ModalTriggerButton from "@components/button/ModalTriggerButton";
import { fetchAllBatches, deleteBatch } from "@services/inventoryService";
import useBatchColumns, { useBatchStore } from "./useBatchColumns";
import BatchModal from "./BatchModal";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { CustomTableOptions } from "@src/types/table";
import { QUERY_KEY } from "@constants/queryKeys";
import { Divider } from "@mantine/core";

const BatchList = ({ withHeader = true }: { withHeader?: boolean }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = useBatchColumns((id) => deleteMutation.mutate(id));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    columns?.map((c) => c.id as string),
  );

  const { setModalAction } = useBatchStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Batch deleted",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.BATCHES] });
    },
    onError: (err: any) => {
      notifications.show({
        title: "Error",
        message: err?.message || "Failed to delete",
        color: "red",
      });
    },
  });

  const { data, isError, isFetching, error } = usePaginationDataFetch({
    queryKey: [QUERY_KEY.BATCHES],
    queryFn: fetchAllBatches,
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: { sorting, pagination, columnOrder },
    pageCount: data?.totalPages || 0,
    initialState: {
      columnPinning: {
        left: ["medicine.brand_name"],
        right: ["action"],
      },
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    tableId: "batches-table",
  } as CustomTableOptions<BatchI>);

  return (
    <div className="w-full h-full flex flex-col relative">
      <MainHeader
        title={withHeader ? "Batches" : ""}
        search={search}
        setSearch={setSearch}
        withSearch
        modalButton={
          <ModalTriggerButton
            title="Add Batch"
            triggerModalFn={() => setModalAction("ADD")}
          >
            Add Batch
          </ModalTriggerButton>
        }
      />
      <Divider />
      <MainTable
        className="flex-1 h-auto!"
        id="batches-table"
        table={table}
        isLoading={isFetching}
        isError={isError}
        error={error}
        totalCount={data?.totalCount || 0}
        totalPages={data?.totalPages || 0}
        setPagination={setPagination}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnIdsToSort={[
          "batch_no",
          "medicine.brand_name",
          "exp_date",
          "quantity_available",
        ]}
        withFooter
      />
      <BatchModal />
    </div>
  );
};

export default BatchList;
