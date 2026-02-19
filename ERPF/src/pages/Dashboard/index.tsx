import {
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
  ThemeIcon,
  Button,
  UnstyledButton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardStats,
  fetchSalesTrend,
  fetchLowStock,
} from "@services/dashboardService";
import { QUERY_KEY } from "@constants/queryKeys";
import {
  MdWarning,
  MdInventory,
  MdAttachMoney,
  MdArrowForward,
  MdAddShoppingCart,
  MdReceipt,
  MdPersonAdd,
  MdTrendingUp,
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
import { useNavigate } from "react-router-dom"; // Fixed import from react-router

// Modern Stat Card with Gradient & Click
const StatCard = ({
  title,
  value,
  icon,
  color,
  subtext,
  onClick,
  gradient,
}: any) => (
  <Paper
    withBorder
    p="md"
    radius="md"
    onClick={onClick}
    style={{
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
    className="hover:shadow-md hover:-translate-y-1"
  >
    <Group justify="space-between">
      <Stack gap={0}>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          {title}
        </Text>
        <Title order={2} fw={700} c={color}>
          {value}
        </Title>
        {subtext && (
          <Text size="xs" c="dimmed" fw={500}>
            {subtext}
          </Text>
        )}
      </Stack>
      <ThemeIcon
        size={48}
        radius="md"
        variant="gradient"
        gradient={gradient || { from: color, to: `${color}.4`, deg: 45 }}
      >
        {icon}
      </ThemeIcon>
    </Group>
  </Paper>
);

const QuickAction = ({ icon, label, color, onClick }: any) => (
  <UnstyledButton
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition-colors"
  >
    <ThemeIcon size={40} radius="xl" color={color} variant="light" mb="xs">
      {icon}
    </ThemeIcon>
    <Text size="sm" fw={600}>
      {label}
    </Text>
  </UnstyledButton>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [QUERY_KEY.DASHBOARD_STATS],
    queryFn: fetchDashboardStats,
  });

  const { data: salesTrend } = useQuery({
    queryKey: [QUERY_KEY.SALES_TREND],
    queryFn: fetchSalesTrend,
  });

  const { data: lowStock } = useQuery({
    queryKey: [QUERY_KEY.LOW_STOCK],
    queryFn: fetchLowStock,
  });

  if (statsLoading)
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );

  return (
    <Stack gap="lg" p="md" pb="xl" h="100%" style={{ overflowY: "auto" }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title order={2} fw={800} style={{ letterSpacing: -1 }}>
            Dashboard
          </Title>
          <Text size="sm" c="dimmed">
            Overview of your pharmacy performance
          </Text>
        </div>
        <Text
          size="sm"
          fw={500}
          c="dimmed"
          className="bg-gray-100 px-3 py-1 rounded-full"
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </div>

      {/* Quick Actions */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <QuickAction
          icon={<MdReceipt size={22} />}
          label="New Sale"
          color="teal"
          onClick={() => navigate("/sales/pos")}
        />
        <QuickAction
          icon={<MdAddShoppingCart size={22} />}
          label="Purchase Entry"
          color="blue"
          onClick={() => navigate("/purchases/create")}
        />
        <QuickAction
          icon={<MdInventory size={22} />}
          label="Add Medicine"
          color="violet"
          onClick={() => navigate("/medicines")}
        />
        <QuickAction
          icon={<MdPersonAdd size={22} />}
          label="Add Customer"
          color="orange"
          onClick={() => navigate("/customers")}
        />
      </SimpleGrid>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <StatCard
          title="Total Sales"
          value={`₹${stats?.totalSales?.toLocaleString() || 0}`}
          icon={<MdAttachMoney size={26} />}
          color="teal"
          gradient={{ from: "teal", to: "green", deg: 45 }}
          subtext="Total revenue today"
          onClick={() => navigate("/reports")}
        />
        <StatCard
          title="Stock Value"
          value={`₹${stats?.stockValue?.toLocaleString() || 0}`}
          icon={<MdInventory size={26} />}
          color="blue"
          gradient={{ from: "blue", to: "cyan", deg: 45 }}
          subtext="Current inventory value"
          onClick={() => navigate("/inventory")}
        />
        <StatCard
          title="Low Stock"
          value={stats?.lowStockCount || 0}
          icon={<MdWarning size={26} />}
          color="orange"
          gradient={{ from: "orange", to: "yellow", deg: 45 }}
          subtext="Items below reorder level"
          onClick={() => navigate("/inventory")}
        />
        <StatCard
          title="Expiring Soon"
          value={stats?.expiryCount || 0}
          icon={<MdTrendingUp size={26} />} // Using TrendingUp as a placeholder or maybe MdTimer
          color="red"
          gradient={{ from: "red", to: "pink", deg: 45 }}
          subtext="Batches expiring in 90 days"
          onClick={() => navigate("/inventory/batches")}
        />
      </SimpleGrid>

      {/* Middle Row: Charts & Activity */}
      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
        <Card withBorder radius="md" p="md" className="lg:col-span-2 shadow-sm">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Sales Trend</Title>
            <Badge variant="light">Last 30 Days</Badge>
          </Group>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20c997" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#20c997" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eee"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#20c997"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card withBorder radius="md" p="md" className="shadow-sm">
          <Group justify="space-between" mb="md">
            <Title order={4}>Low Stock Alert</Title>
            <Button
              variant="subtle"
              size="xs"
              rightSection={<MdArrowForward />}
              onClick={() => navigate("/inventory")}
            >
              View All
            </Button>
          </Group>
          <Stack gap="sm">
            {lowStock?.slice(0, 6).map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                onClick={() => navigate("/inventory")}
              >
                <div>
                  <Text size="sm" fw={600} lineClamp={1}>
                    {item.brand_name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {item.generic_name}
                  </Text>
                </div>
                <Badge color="red" variant="filled" size="sm">
                  {item.current_stock}
                </Badge>
              </div>
            ))}
            {!lowStock?.length && (
              <Stack align="center" py="xl" c="dimmed">
                <MdInventory size={40} opacity={0.3} />
                <Text size="sm">Stocks are healthy!</Text>
              </Stack>
            )}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

export default Dashboard;
