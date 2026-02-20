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
        id: "medicine.brand_name",
        accessorKey: "medicine.brand_name",
        header: "Medicine",
        minSize: 160,
        size: 220,
        cell: ({ row }) => (
          <Text size="sm">{row.original.medicine?.brand_name || "N/A"}</Text>
        ),
      },
      {
        id: "batch_no",
        accessorKey: "batch_no",
        header: "Batch No",
        minSize: 80,
        size: 100,
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.batch_no}
          </Text>
        ),
      },
      {
        id: "exp_date",
        accessorKey: "exp_date",
        header: "Expiry",
        cell: ({ row }) => (
          <Badge color="red" variant="light">
            {new Date(row.original.exp_date).toLocaleDateString()}
          </Badge>
        ),
      },
      {
        id: "quantity_available",
        accessorKey: "quantity_available",
        header: "Stock",
        minSize: 80,
        size: 100,
        cell: ({ row }) => (
          <Text size="sm" fw={700}>
            {row.original.quantity_available}
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
        minSize: 80,
        size: 80,
        cell: ({ row }) => (
          <Group gap="xs" justify="center">
            <ActionIcon
              variant="light"
              radius={"100%"}
              color="blue"
              onClick={() => {
                setDetail(row.original);
                setModalAction("EDIT");
              }}
            >
              <MdEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              radius={"100%"}
              color="red"
              onClick={() => {
                modals.openConfirmModal({
                  title: "Delete Batch",
                  children: (
                    <Text size="sm">
                      Are you sure you want to delete batch{" "}
                      <strong>{row.original.batch_no}</strong>?
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
