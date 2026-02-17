import CenterLoader from "@components/CenterLoader/Index";
import useAuthStore from "@stores/authStore";
import useUserStore from "@stores/userStore";
import {
  Avatar,
  Button,
  Dialog,
  Flex,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { QueryCache, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MdLogout, MdSettings, MdTextsms, MdSecurity } from "react-icons/md";
import { apiErrNotification } from "@utils/sendNotification";
import { getMe, logoutUser } from "@services/authService";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";

import classes from "./sidebar.module.css";
import { QUERY_KEY } from "@constants/queryKeys";
import { ENDPOINT } from "@constants/endpoints";

const UserSection = ({ collapseSidebar }: { collapseSidebar: boolean }) => {
  const { user, avatarName, setUser } = useUserStore();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryCache = new QueryCache();

  const currentUser = useQuery({
    queryKey: [QUERY_KEY.GET_ME],
    queryFn: getMe,
  });

  useEffect(() => {
    if (currentUser.data) {
      if (currentUser.data.is_active) {
        setUser(currentUser.data);
      } else {
        logoutHandler();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.data]);

  if (currentUser.isLoading) {
    return <CenterLoader />;
  }

  if (currentUser.isError) {
    return (
      <Group gap="xs" justify="center">
        <Avatar
          src={null}
          alt={"Profile Icon"}
          radius={40}
          size={40}
          className="err_avatar"
        />
        <section style={{ flex: 1 }}>
          <Text fz={"sm"} fw={400}>
            Something Went Wrong
          </Text>
        </section>
      </Group>
    );
  }

  const logoutHandler = async () => {
    await logoutUser()
      .then(() => {
        queryCache.clear();
        localStorage.clear();
        clearAuth();
        navigate(ENDPOINT.AUTH.LOGIN);
      })
      .catch((err: AxiosError) => {
        apiErrNotification(err);
      });
  };

  return (
    <Menu
      id="user_section_main"
      position="right-end"
      withArrow
      arrowPosition="center"
    >
      <Menu.Target>
        <UnstyledButton
          className={collapseSidebar ? classes.user_mobile : classes.user}
        >
          <Group
            gap="xs"
            wrap="nowrap"
            justify="center"
            id="user_section"
            h={40}
            mah={40}
          >
            <Avatar
              src={null}
              alt={"Profile Icon"}
              radius={40}
              size={40}
              className={classes.avatar}
            >
              {avatarName}
            </Avatar>
            {!collapseSidebar && (
              <section style={{ flex: 1 }}>
                <Text fz={"sm"} fw={500} className={classes.user_name}>
                  {user?.username}
                </Text>
                <Text
                  fz="xs"
                  c="dimmed"
                  className="w-40 overflow-hidden whitespace-nowrap text-ellipsis"
                >
                  {user?.email}
                </Text>
              </section>
            )}
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown ml={4}>
        <Menu.Label>User Options</Menu.Label>
        <Menu.Item
          leftSection={<MdSettings size={18} />}
          className={classes.user_option}
          onClick={() => navigate(ENDPOINT.SETTINGS)}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          leftSection={<MdSecurity size={18} />}
          className={classes.user_option}
          onClick={() => navigate(ENDPOINT.USERS.PROFILE)}
        >
          Security
        </Menu.Item>
        <Menu.Item
          leftSection={<MdTextsms size={18} />}
          className={classes.user_option}
        >
          Messages
        </Menu.Item>
        <Menu.Item
          color={"red"}
          leftSection={<MdLogout size={18} />}
          onClick={toggle}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
      <Dialog
        opened={opened}
        withCloseButton
        onClose={close}
        size="md"
        radius="md"
        position={{ bottom: 100, left: 20 }}
        shadow="md"
        className={classes.logout_dialog}
      >
        <Text size="sm" mb="md" fw={500}>
          Are you sure you want to logout?
        </Text>
        <Flex justify="center" align="center" direction="row">
          <Button variant="filled" color="red" onClick={logoutHandler}>
            Yes
          </Button>
        </Flex>
      </Dialog>
    </Menu>
  );
};

export default UserSection;
