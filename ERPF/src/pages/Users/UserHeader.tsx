import { Header } from "@components/Header";
import { Button, Group, TextInput } from "@mantine/core";
import { MdClose, MdPersonAddAlt1 } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

import { USER_DRAWER } from "./constant";
import { STRINGS } from "@constants/strings";

const UserHeader = ({
  setSearchParams,
  open,
  setSearchUser,
  searchUser
}: UserHeaderI) => {
  const addUserHandler = (action: string) => {
    open();
    setSearchParams({ [STRINGS.USER_ACTION]: action });
  };

  return (
    <Header id="user">
      <Header.Head title="Users" order={2}>
        <TextInput
          leftSection={<FiSearch size={"20"} />}
          placeholder="Search User"
          key={"user-search"}
          onChange={(e) => setSearchUser(e.currentTarget.value)}
          value={searchUser}
          rightSection={
            <MdClose
              aria-label="Clear user search"
              onClick={() => setSearchUser("")}
              style={{ display: searchUser ? undefined : "none" }}
              className="cursor-pointer"
              size={20}
            />
          }
        />
        <Group gap="xs">
          <Button
            leftSection={<MdPersonAddAlt1 size={16} />}
            onClick={() => addUserHandler(USER_DRAWER.ADD)}
            title="Add New User"
          >
            Add
          </Button>
        </Group>
      </Header.Head>
    </Header>
  );
};
export default UserHeader;

interface UserHeaderI {
  open: () => void;
  setSearchParams: (obj: { userAction?: string }) => void;
  searchUser: string;
  setSearchUser: (arg: string) => void;
}
