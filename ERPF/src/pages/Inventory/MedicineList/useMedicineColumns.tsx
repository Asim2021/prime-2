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
        id: "brand_name",
        accessorKey: "brand_name",
        header: "Brand Name",
        minSize: 140,
        size: 220,
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
        minSize: 160,
        size: 240,
        id: "generic_name",
        accessorKey: "generic_name",
        header: "Generic Name",
        cell: ({ row }) => (
          <Text size="sm">{row.original.generic_name || "-"}</Text>
        ),
      },
      {
        id: "manufacturer",
        accessorKey: "manufacturer",
        header: "Manufacturer",
        cell: ({ row }) => (
          <Text size="sm">{row.original.manufacturer || "-"}</Text>
        ),
      },
      {
        id: "schedule_type",
        accessorKey: "schedule_type",
        header: "Schedule",
        size: 100,
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.schedule_type || "-"}</Badge>
        ),
      },
      {
        id: "gst_percent",
        accessorKey: "gst_percent",
        header: "Tax",
        size: 80,
        cell: ({ row }) => <Text size="sm">{row.original.gst_percent}%</Text>,
      },
      {
        id: "reorder_level",
        accessorKey: "reorder_level",
        header: "Reorder Lvl",
        size: 80,
        cell: ({ row }) => <Text size="sm">{row.original.reorder_level}</Text>,
      },
      {
        id: "action",
        size: 80,
        cell: ({ row }) => (
          <Group gap="xs" justify="center">
            <ActionIcon
              radius={"100%"}
              variant="light"
              color="blue"
              onClick={() => {
                setDetail(row.original);
                setModalAction("EDIT");
              }}
            >
              <MdEdit size={16} />
            </ActionIcon>
            <ActionIcon
              radius={"100%"}
              variant="light"
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
