import { Button, Loader } from "@mantine/core";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { downloadExcel } from "@services/exportService";
import { FaFileExcel } from "react-icons/fa6";

interface ExportButtonProps {
  endpoint: string;
  params?: any;
  filename?: string;
  label?: string;
}

const ExportButton = ({
  endpoint,
  params = {},
  filename = "export",
  label = "Export to Excel",
}: ExportButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      await downloadExcel(endpoint, params, filename);
      notifications.show({
        title: "Success",
        message: "File downloaded successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Could not download the file",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      leftSection={
        loading ? <Loader size="xs" color="gray" /> : <FaFileExcel size={18} />
      }
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      color="green"
    >
      {loading ? "Exporting..." : label}
    </Button>
  );
};

export default ExportButton;
