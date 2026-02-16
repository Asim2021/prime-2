import { Container, Stack, Title, Tabs } from "@mantine/core";
import TwoFactorSetup from "@pages/Auth/components/TwoFactorSetup";
import ActiveSessions from "@pages/Auth/components/ActiveSessions";
import { useState } from "react";
import { MdSecurity, MdDevices } from "react-icons/md";

const SecuritySettings = () => {
  const [activeTab, setActiveTab] = useState<string | null>("2fa");

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2}>Security Settings</Title>
        </div>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="2fa" leftSection={<MdSecurity size={16} />}>
              Two-Factor Authentication
            </Tabs.Tab>
            <Tabs.Tab value="sessions" leftSection={<MdDevices size={16} />}>
              Active Sessions
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="2fa" pt="xl">
            <TwoFactorSetup />
          </Tabs.Panel>

          <Tabs.Panel value="sessions" pt="xl">
            <ActiveSessions />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default SecuritySettings;
