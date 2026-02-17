import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ActionIcon, Group, Text, Badge } from "@mantine/core";
import { MdEdit, MdDelete } from "react-icons/md";
import useMedicineStore from "@stores/medicineStore";
import { modals } from "@mantine/modals";

const useMedicineColumns = (deleteHandler: (id: string) => void) => {
  const { setModalAction, setDetail } = useMedicineStore();

  const columns = useMemo<ColumnDef<MedicineI>[]>(
    () => [
      {
        accessorKey: "brand_name",
        header: "Brand Name",
        cell: ({ row }) => (
          <div>
            <Text size="sm" fw={500}>
              {row.original.brand_name}
            </Text>
            <Text size="xs" c="dimmed">
              {row.original.generic_name}
            </Text>
          </div>
        ),
      },
      {
        accessorKey: "manufacturer",
        header: "Manufacturer",
        cell: ({ row }) => (
          <Text size="sm">{row.original.manufacturer || "-"}</Text>
        ),
      },
      {
        accessorKey: "schedule_type",
        header: "Schedule",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.schedule_type || "-"}</Badge>
        ),
      },
      {
        accessorKey: "unit_type",
        header: "Unit",
        cell: ({ row }) => (
          <Text size="sm">{row.original.unit_type || "-"}</Text>
        ),
      },
      {
        accessorKey: "gst_percent",
        header: "Tax",
        cell: ({ row }) => <Text size="sm">{row.original.gst_percent}%</Text>,
      },
      {
        accessorKey: "reorder_level",
        header: "Reorder Lvl",
        cell: ({ row }) => <Text size="sm">{row.original.reorder_level}</Text>,
      },
      {
        id: "action",
        header: "Action",
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
                  title: "Delete Medicine",
                  children: (
                    <Text size="sm">
                      Are you sure you want to delete{" "}
                      <strong>{row.original.brand_name}</strong>?
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

export default useMedicineColumns;
