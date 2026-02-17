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
import { fetchAllCustomers, deleteCustomer } from "@services/partnerService";
import useCustomerStore from "@stores/customerStore";
import useCustomerColumns from "./useCustomerColumns";
import CustomerModal from "./CustomerModal";
import { usePaginationDataFetch } from "@hooks/usePaginationDataFetch";
import { CustomTableOptions } from "@src/types/table";

const CustomerList = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const { setModalAction } = useCustomerStore();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Customer deleted",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (err: any) => {
      notifications.show({
        title: "Error",
        message: err?.message || "Failed to delete",
        color: "red",
      });
    },
  });

  const columns = useCustomerColumns((id) => deleteMutation.mutate(id));

  const { data, isError, isFetching, error } = usePaginationDataFetch({
    queryKey: ["customers"],
    queryFn: fetchAllCustomers,
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
    tableId: "customers-table",
  } as CustomTableOptions<CustomerI>);

  return (
    <div className="w-full h-full pb-24 relative">
      <MainHeader
        title="Customers"
        search={search}
        setSearch={setSearch}
        withSearch
        modalButton={
          <ModalTriggerButton
            title="Add Customer"
            triggerModalFn={() => setModalAction("ADD")}
          >
            Add Customer
          </ModalTriggerButton>
        }
      />
      <MainTable
        id="customers-table"
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
          "name",
          "phone",
          "gstin",
          "credit_limit",
          "outstanding_balance",
        ]}
        withFooter
      />
      <CustomerModal />
    </div>
  );
};

export default CustomerList;
