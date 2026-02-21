import {
  ActionIcon,
  Group,
  Kbd,
  Modal,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  Badge,
  Loader,
  Center,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useHotkeys, useDebouncedValue } from "@mantine/hooks";
import {
  MdSearch,
  MdArrowForward,
  MdInventory,
  MdPerson,
  MdStore,
} from "react-icons/md";
import { FcSearch } from "react-icons/fc";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMedicines } from "@services/inventoryService";
import { fetchAllCustomers, fetchAllVendors } from "@services/partnerService";
import { QUERY_KEY } from "@constants/queryKeys";
import { ROUTES } from "@constants/endpoints";

interface SearchResultI {
  id: string;
  title: string;
  description: string;
  type: "MEDICINE" | "CUSTOMER" | "VENDOR";
  link: string;
}

const GlobalSearch = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const navigate = useNavigate();

  useHotkeys([["mod+K", open]]);

  // We only search if query length > 2
  const enabled = debouncedQuery.length > 2;

  const { data: medicines, isLoading: loadingMedicines } = useQuery({
    queryKey: [QUERY_KEY.SEARCH, "medicines", debouncedQuery],
    queryFn: () =>
      fetchAllMedicines({ page: 1, limit: 5, search: debouncedQuery }),
    enabled,
  });

  const { data: customers, isLoading: loadingCustomers } = useQuery({
    queryKey: [QUERY_KEY.SEARCH, "customers", debouncedQuery],
    queryFn: () =>
      fetchAllCustomers({ page: 1, limit: 3, search: debouncedQuery }),
    enabled,
  });

  const { data: vendors, isLoading: loadingVendors } = useQuery({
    queryKey: [QUERY_KEY.SEARCH, "vendors", debouncedQuery],
    queryFn: () =>
      fetchAllVendors({ page: 1, limit: 3, search: debouncedQuery }),
    enabled,
  });

  const results: SearchResultI[] = [
    ...(medicines?.data?.map((m: any) => ({
      id: m.id,
      title: m.brand_name,
      description: `Generic: ${m.generic_name} | Stock: ${m.current_stock || 0}`,
      type: "MEDICINE" as const,
      link: ROUTES.INVENTORY.MEDICINES, // Ideally deep link, but for now list
    })) || []),
    ...(customers?.data?.map((c: any) => ({
      id: c.id,
      title: c.name,
      description: `Ph: ${c.phone}`,
      type: "CUSTOMER" as const,
      link: ROUTES.PARTNERS.CUSTOMERS,
    })) || []),
    ...(vendors?.data?.map((v: any) => ({
      id: v.id,
      title: v.name,
      description: `Credit Days: ${v.credit_days || 0}`,
      type: "VENDOR" as const,
      link: ROUTES.PARTNERS.VENDORS,
    })) || []),
  ];

  const isLoading = loadingMedicines || loadingCustomers || loadingVendors;

  const handleSelect = (link: string) => {
    navigate(link);
    close();
  };

  return (
    <>
      <Group onClick={open} style={{ cursor: "pointer" }}>
        <Tooltip label="Search (Ctrl + K)">
          <ActionIcon variant="default" size="lg" radius="md">
            <FcSearch size="1.5rem" />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        padding={0}
        withCloseButton={false}
        radius="md"
        yOffset="2vh"
      >
        <Stack gap={0}>
          <TextInput
            placeholder="Search medicines, customers, vendors..."
            size="md"
            variant="unstyled"
            p="md"
            leftSection={<MdSearch size={20} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-autofocus
          />

          {query.length > 0 && query.length < 3 && (
            <Text p="md" c="dimmed" size="sm" ta="center">
              Type at least 3 characters to search
            </Text>
          )}

          {isLoading && (
            <Center p="xl">
              <Loader size="sm" />
            </Center>
          )}

          {!isLoading && enabled && results.length === 0 && (
            <Text p="xl" c="dimmed" ta="center">
              No results found.
            </Text>
          )}

          {results.length > 0 && (
            <Stack gap={0} mah={400} style={{ overflowY: "auto" }}>
              {results.map((item) => (
                <UnstyledButton
                  key={`${item.type}-${item.id}`}
                  p="md"
                  style={(theme) => ({
                    borderTop: `1px solid ${theme.colors.gray[2]}`,
                    "&:hover": { backgroundColor: theme.colors.gray[0] },
                  })}
                  onClick={() => handleSelect(item.link)}
                >
                  <Group wrap="nowrap">
                    <Center p="xs" bg="gray.1" style={{ borderRadius: 8 }}>
                      {item.type === "MEDICINE" && (
                        <MdInventory size={20} color="teal" />
                      )}
                      {item.type === "CUSTOMER" && (
                        <MdPerson size={20} color="blue" />
                      )}
                      {item.type === "VENDOR" && (
                        <MdStore size={20} color="orange" />
                      )}
                    </Center>
                    <div style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>
                          {item.title}
                        </Text>
                        <Badge size="xs" variant="light" color="gray">
                          {item.type}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {item.description}
                      </Text>
                    </div>
                    <MdArrowForward color="gray" />
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          )}

          <Group justify="space-between" p="xs" bg="gray.0">
            <Text size="xs" c="dimmed">
              Use arrow keys to navigate
            </Text>
            <Kbd>Esc</Kbd>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default GlobalSearch;
