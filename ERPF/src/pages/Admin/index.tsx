import { Tabs, Paper } from "@mantine/core";
import { useState } from "react";
import { MdSupervisedUserCircle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import Users from "./UserManagement";
import ShopConfiguration from "./ShopConfiguration";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string | null>("users");

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
  };

  return (
    <div className="w-full h-full">
      <Paper radius="md" h="100dvh" className="flex flex-col">
        <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab
              value="users"
              leftSection={<MdSupervisedUserCircle size={16} />}
            >
              Users
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IoSettings size={16} />}>
              Shop Settings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="users" h="calc(100dvh - 48px)">
            <Users />
          </Tabs.Panel>

          <Tabs.Panel value="settings" h="calc(100dvh - 48px)">
            <ShopConfiguration />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Admin;
