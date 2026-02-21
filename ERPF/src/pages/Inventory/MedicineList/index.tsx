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
import { fetchAllMedicines, deleteMedicine } from "@services/inventoryService";
import useMedicineStore from "@stores/medicineStore";
import useMedicineColumns from "./useMedicineColumns";
import MedicineModal from "./MedicineModal";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { CustomTableOptions } from "@src/types/table";
import { QUERY_KEY } from "@constants/queryKeys";
import { Divider } from "@mantine/core";

const MedicineList = ({ withHeader = true }: { withHeader?: boolean }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = useMedicineColumns((id) => deleteMutation.mutate(id));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    columns?.map((c) => c.id as string),
  );

  const { setModalAction } = useMedicineStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Medicine deleted",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MEDICINES] });
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
    queryKey: [QUERY_KEY.MEDICINES],
    queryFn: fetchAllMedicines,
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const table = useReactTable({
    data: data?.data || [],
    columns,
    initialState: {
      columnPinning: {
        left: ["brand_name"],
        right: ["action"],
      },
    },
    state: { sorting, pagination, columnOrder },
    pageCount: data?.totalPages || 0,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    tableId: "medicines-table",
  } as CustomTableOptions<MedicineI>);

  return (
    <div className="w-full h-full flex flex-col relative">
      <MainHeader
        title={withHeader ? "Medicines" : ""} // Hide title if embedded
        search={search}
        setSearch={setSearch}
        withSearch
        modalButton={
          <ModalTriggerButton
            title="Add Medicine"
            triggerModalFn={() => setModalAction("ADD")}
          >
            Add Medicine
          </ModalTriggerButton>
        }
      />
      <Divider />
      <MainTable
        className="flex-1 h-auto!"
        id="medicines-table"
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
          "brand_name",
          "generic_name",
          "manufacturer",
          "schedule_type",
        ]}
        withFooter
      />
      <MedicineModal />
    </div>
  );
};

export default MedicineList;
