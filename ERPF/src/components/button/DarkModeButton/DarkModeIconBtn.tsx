import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const DarkModeIconBtn = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const clickHandler = () => {
    toggleColorScheme();
  };

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : undefined}
      onClick={clickHandler}
      title={dark ? "Enable Light Mode" : "Enable Dark Mode"}
      size="lg"
    >
      {dark ? <MdLightMode size="20px" /> : <MdDarkMode size="20px" />}
    </ActionIcon>
  );
};

export default DarkModeIconBtn;
