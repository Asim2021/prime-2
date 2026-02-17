import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ActionIcon, Group, Text, Badge } from "@mantine/core";
import { MdEdit, MdDelete } from "react-icons/md";
import { modals } from "@mantine/modals";

// I need useBatchStore
import { create } from "zustand";

interface BatchStoreI {
  detail: BatchI | null;
  modalAction: "ADD" | "EDIT" | "VIEW" | null;
  setDetail: (data: BatchI | null) => void;
  setModalAction: (action: "ADD" | "EDIT" | "VIEW" | null) => void;
}

export const useBatchStore = create<BatchStoreI>((set) => ({
  detail: null,
  modalAction: null,
  setDetail: (data) => set({ detail: data }),
  setModalAction: (action) => set({ modalAction: action }),
}));

const useBatchColumns = (deleteHandler: (id: string) => void) => {
  const { setModalAction, setDetail } = useBatchStore();

  const columns = useMemo<ColumnDef<BatchI>[]>(
    () => [
      {
        id: "batch_number",
        accessorKey: "batch_number",
        header: "Batch No",
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.batch_number}
          </Text>
        ),
      },
      {
        id: "item_name",
        accessorKey: "item_name",
        header: "Medicine",
        cell: ({ row }) => (
          <Text size="sm">
            {row.original.item_name || row.original.item_id}
          </Text>
        ),
      },
      {
        id: "expiry_date",
        accessorKey: "expiry_date",
        header: "Expiry",
        cell: ({ row }) => (
          <Badge color="red" variant="light">
            {new Date(row.original.expiry_date).toLocaleDateString()}
          </Badge>
        ),
      },
      {
        id: "current_stock",
        accessorKey: "current_stock",
        header: "Stock",
        cell: ({ row }) => (
          <Text size="sm" fw={700}>
            {row.original.current_stock}
          </Text>
        ),
      },
      {
        id: "mrp",
        accessorKey: "mrp",
        header: "MRP",
        cell: ({ row }) => <Text size="sm">₹{row.original.mrp}</Text>,
      },
      {
        id: "action",
        cell: ({ row }) => (
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => {
                setDetail(row.original);
                setModalAction("EDIT");
              }}
            >
              <MdEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => {
                modals.openConfirmModal({
                  title: "Delete Batch",
                  children: (
                    <Text size="sm">
                      Are you sure you want to delete batch{" "}
                      <strong>{row.original.batch_number}</strong>?
                    </Text>
                  ),
                  labels: { confirm: "Delete", cancel: "Cancel" },
                  confirmProps: { color: "red" },
                  onConfirm: () => deleteHandler(row.original.id),
                });
              }}
            >
              <MdDelete size={16} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    [],
  );

  return columns;
};

export default useBatchColumns;
