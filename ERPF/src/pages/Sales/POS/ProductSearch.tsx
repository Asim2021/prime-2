import {
  ActionIcon,
  Badge,
  Group,
  Stack,
  Text,
  Tooltip,
  Autocomplete,
} from "@mantine/core";
import { useInputState, useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { MdAddShoppingCart, MdSearch } from "react-icons/md";
import {
  fetchAllMedicines,
  fetchBatchesByMedicine,
} from "@services/inventoryService";
import { useState } from "react";
import useCartStore from "@stores/cartStore";

// We need a custom search component that shows medicines, then expands to show batches.
// Or simple: Search Medicine -> On Select -> Show Modal/List of Batches.
// Let's do: Search Bar. Below it, list of matching medicines. Each medicine card has "Show Batches" toggle.
// Better for POS:
// Autocomplete finding Medicine.
// When selected, show Batches below.

const ProductSearch = () => {
  const [search, setSearch] = useInputState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

  // Fetch Medicines
  const { data: medicines } = useQuery({
    queryKey: ["medicines", debouncedSearch],
    queryFn: () =>
      fetchAllMedicines({ search: debouncedSearch, page: 1, limit: 10 }),
  });

  const { data: batches } = useQuery({
    queryKey: ["batches", selectedMedicine?.id],
    queryFn: () => fetchBatchesByMedicine(selectedMedicine.id),
    enabled: !!selectedMedicine,
  });

  const addItem = useCartStore((state) => state.addItem);

  return (
    <Stack gap="md" h="100%">
      <Autocomplete
        placeholder="Search Medicine (Brand, Generic)..."
        leftSection={<MdSearch size={16} />}
        data={
          medicines?.data?.map((m) => ({ value: m.brand_name, ...m })) || []
        }
        value={search}
        onChange={setSearch}
        onOptionSubmit={(val: string) => {
          const med = medicines?.data?.find((m) => m.brand_name === val);
          setSelectedMedicine(med);
        }}
        filter={({ options }) => options} // Server side filtering
      />

      {selectedMedicine && (
        <Stack>
          <Text fw={600} size="lg">
            {selectedMedicine.brand_name}{" "}
            <Text span size="sm" c="dimmed">
              ({selectedMedicine.generic_name})
            </Text>
          </Text>

          {batches?.length === 0 ? (
            <Text c="red">No Stock Available</Text>
          ) : (
            <Stack gap="xs">
              {batches?.map((batch: any) => (
                <Group
                  key={batch.id}
                  justify="space-between"
                  p="xs"
                  className="border rounded hover:bg-gray-50"
                >
                  <Stack gap={0}>
                    <Text fw={500} size="sm">
                      Batch: {batch.batch_number}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Exp: {new Date(batch.expiry_date).toLocaleDateString()}
                    </Text>
                  </Stack>
                  <Group>
                    <Badge
                      color={batch.available_quantity > 0 ? "green" : "red"}
                      variant="light"
                    >
                      Qty: {batch.available_quantity}
                    </Badge>
                    <Text fw={600}>₹{batch.mrp}</Text>
                    <Tooltip label="Add to Cart">
                      <ActionIcon
                        variant="filled"
                        color="blue"
                        onClick={() => addItem(batch, selectedMedicine)}
                        disabled={batch.available_quantity <= 0}
                      >
                        <MdAddShoppingCart size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      )}

      {/* Quick Suggestions or categories could go here */}
    </Stack>
  );
};

export default ProductSearch;
