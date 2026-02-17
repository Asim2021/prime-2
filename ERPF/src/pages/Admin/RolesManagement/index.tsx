import { Stack, Title, Text, Paper, ThemeIcon, Group } from "@mantine/core";
import { MdSecurity } from "react-icons/md";

const RolesManagement = () => {
  return (
    <Stack h="100%" p="md" align="center" justify="center">
      <Paper withBorder p="xl" radius="md" shadow="sm" ta="center" maw={480}>
        <Group justify="center" mb="md">
          <ThemeIcon size={64} radius="xl" variant="light" color="blue">
            <MdSecurity size={32} />
          </ThemeIcon>
        </Group>
        <Title order={3} mb="xs">
          Role Management
        </Title>
        <Text c="dimmed" size="sm">
          Role-based access control is coming soon. You'll be able to create
          custom roles and assign granular permissions to control what each user
          can access across the system.
        </Text>
      </Paper>
    </Stack>
  );
};

export default RolesManagement;
