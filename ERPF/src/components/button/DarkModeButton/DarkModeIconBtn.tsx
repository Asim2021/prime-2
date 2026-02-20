import { ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const DarkModeIconBtn = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const clickHandler = () => {
    toggleColorScheme();
  };

  return (
    <Tooltip label={dark ? "Enable Light Mode" : "Enable Dark Mode"}>
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : undefined}
        onClick={clickHandler}
        size="lg"
      >
        {dark ? <MdLightMode size="20px" /> : <MdDarkMode size="20px" />}
      </ActionIcon>
    </Tooltip>
  );
};

export default DarkModeIconBtn;
