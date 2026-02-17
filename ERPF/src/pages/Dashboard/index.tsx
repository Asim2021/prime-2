import {
  ActionIcon,
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Paper,
  Center,
  Loader,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardStats,
  fetchSalesTrend,
  fetchLowStock,
} from "@services/dashboardService";
import {
  MdWarning,
  MdInventory,
  MdAttachMoney,
  MdArrowForward,
} from "react-icons/md";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router";

const StatCard = ({ title, value, icon, color, subtext }: any) => (
  <Paper withBorder p="md" radius="md">
    <Group justify="space-between">
      <Stack gap={0}>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          {title}
        </Text>
        <Title order={2} fw={700}>
          {value}
        </Title>
        {subtext && (
          <Text size="xs" c={color} fw={500}>
            {subtext}
          </Text>
        )}
      </Stack>
      <Center
        p="sm"
        bg={`var(--mantine-color-${color}-light)`}
        style={{ borderRadius: "50%" }}
      >
        {icon}
      </Center>
    </Group>
  </Paper>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
  });

  const { data: salesTrend } = useQuery({
    queryKey: ["dashboard", "trend"],
    queryFn: fetchSalesTrend,
  });

  const { data: lowStock } = useQuery({
    queryKey: ["dashboard", "lowStock"],
    queryFn: fetchLowStock,
  });

  if (statsLoading)
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <Title order={2}>Dashboard</Title>
        <Text size="sm" c="dimmed">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Group>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard
          title="Total Sales"
          value={`₹${stats?.totalSales?.toLocaleString() || 0}`}
          icon={<MdAttachMoney size={24} color="teal" />}
          color="teal"
          subtext={
            stats?.totalSalesChange
              ? `${stats.totalSalesChange > 0 ? "+" : ""}${stats.totalSalesChange}% from yesterday`
              : null
          }
        />
        <StatCard
          title="Stock Value"
          value={`₹${stats?.stockValue?.toLocaleString() || 0}`}
          icon={<MdInventory size={24} color="blue" />}
          color="blue"
        />
        <StatCard
          title="Low Stock"
          value={stats?.lowStockCount || 0}
          icon={<MdWarning size={24} color="orange" />}
          color="orange"
          subtext="Items below reorder level"
        />
        <StatCard
          title="Expiring Soon"
          value={stats?.expiryCount || 0}
          icon={<MdWarning size={24} color="red" />}
          color="red"
          subtext="Batches expiring in 90 days"
        />
      </SimpleGrid>

      {/* Middle Row: Charts & Activity */}
      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Card withBorder radius="md" p="md" style={{ gridColumn: "span 2" }}>
          <Title order={4} mb="md">
            Sales Trend (Last 30 Days)
          </Title>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20c997" stopOpacity={0.8} />{" "}
                    // Teal
                    <stop offset="95%" stopColor="#20c997" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#20c997"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Stack gap="md">
          <Card withBorder radius="md" p="md" h="100%">
            <Group justify="space-between" mb="xs">
              <Title order={4}>Low Stock Alert</Title>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => navigate("/inventory/stock")}
              >
                <MdArrowForward />
              </ActionIcon>
            </Group>
            <Stack gap="xs">
              {lowStock?.slice(0, 5).map((item: any) => (
                <Group
                  key={item.id}
                  justify="space-between"
                  p="xs"
                  bg="light-dark(var(--mantine-color-orange-0), var(--mantine-color-dark-5))"
                  style={{ borderRadius: 4 }}
                >
                  <Text size="sm" fw={500} lineClamp={1}>
                    {item.brand_name}
                  </Text>
                  <Badge color="orange" variant="light" size="sm">
                    {item.current_stock} left
                  </Badge>
                </Group>
              ))}
              {!lowStock?.length && (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No low stock items
                </Text>
              )}
            </Stack>
          </Card>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
};

export default Dashboard;
