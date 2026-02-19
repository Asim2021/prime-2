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
import MainTable from "@components/Table"; // Use MainTable directly
import ModalTriggerButton from "@components/button/ModalTriggerButton"; // Assuming this exists or create it
import { fetchAllVendors, deleteVendor } from "@services/partnerService";
import useVendorStore from "@stores/vendorStore";
import useVendorColumns from "./useVendorColumns";
import VendorModal from "./VendorModal";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { CustomTableOptions } from "@src/types/table";
import { QUERY_KEY } from "@constants/queryKeys";

const VendorList = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = useVendorColumns((id) => deleteMutation.mutate(id));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    columns?.map((c) => c.id as string),
  );

  const { setModalAction } = useVendorStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Vendor deleted",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.VENDORS] });
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
    queryKey: [QUERY_KEY.VENDORS],
    queryFn: fetchAllVendors,
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
    tableId: "vendors-table",
  } as CustomTableOptions<VendorI>);

  return (
    <div className="w-full h-full pb-24 relative">
      <MainHeader
        title="Vendors"
        search={search}
        setSearch={setSearch}
        withSearch
        modalButton={
          <ModalTriggerButton
            title="Add Vendor"
            triggerModalFn={() => setModalAction("ADD")}
          >
            Add Vendor
          </ModalTriggerButton>
        }
      />
      <MainTable
        id="vendors-table"
        table={table}
        isLoading={isFetching}
        isError={isError}
        error={error}
        totalCount={data?.totalCount || 0}
        totalPages={data?.totalPages || 0}
        setPagination={setPagination}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnIdsToSort={["name", "phone", "contact_person", "gst_number"]}
        withFooter
      />
      <VendorModal />
    </div>
  );
};

export default VendorList;
