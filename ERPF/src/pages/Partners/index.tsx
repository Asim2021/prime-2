import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Paper } from "@mantine/core";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoStorefront } from "react-icons/io5";
import VendorList from "./VendorList";
import CustomerList from "./CustomerList";
import { ROUTES } from "@constants/endpoints";

const Partners = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname.includes(ROUTES.PARTNERS.CUSTOMERS))
      return "customers";
    return "vendors";
  };

  const [activeTab, setActiveTab] = useState<string | null>(getActiveTab());

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value === "vendors") navigate(ROUTES.PARTNERS.VENDORS);
    if (value === "customers") navigate(ROUTES.PARTNERS.CUSTOMERS);
  };

  return (
    <div className="w-full h-full">
      <Paper radius="md" h="100dvh" className="flex flex-col">
        <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="vendors" leftSection={<IoStorefront size={16} />}>
              Vendors
            </Tabs.Tab>
            <Tabs.Tab
              value="customers"
              leftSection={<BsFillPeopleFill size={16} />}
            >
              Customers
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="vendors" h="calc(100dvh - 48px)">
            <VendorList />
          </Tabs.Panel>

          <Tabs.Panel value="customers" h="calc(100dvh - 48px)">
            <CustomerList />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Partners;
