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
} from "@tanstack/react-table";

import MainHeader from "@components/Header/MainHeader";
import MainTable from "@components/Table";
import ModalTriggerButton from "@components/button/ModalTriggerButton";
import { fetchAllBatches, deleteBatch } from "@services/inventoryService";
import useBatchColumns, { useBatchStore } from "./useBatchColumns";
import BatchModal from "./BatchModal";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { CustomTableOptions } from "@src/types/table";

const BatchList = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

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
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
    onError: (err: any) => {
      notifications.show({
        title: "Error",
        message: err?.message || "Failed to delete",
        color: "red",
      });
    },
  });

  const columns = useBatchColumns((id) => deleteMutation.mutate(id));

  const { data, isError, isFetching, error } = usePaginationDataFetch({
    queryKey: ["batches"],
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
    <div className="w-full h-full pb-24 relative">
      <MainHeader
        title="Batches"
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
      <MainTable
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
          "batch_number",
          "item_name",
          "expiry_date",
          "current_stock",
        ]}
        withFooter
      />
      <BatchModal />
    </div>
  );
};

export default BatchList;
