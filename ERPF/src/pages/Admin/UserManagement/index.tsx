import { useState } from "react";

import classes from "./user.module.css";
import UserTable from "./Components/UserTable/UserTable";
import { Divider, Button } from "@mantine/core";
import MainHeader from "@components/Header/MainHeader";
import UserModal from "./Components/Modals/UserModal";
import { useDisclosure } from "@mantine/hooks";
import { FaPlus } from "react-icons/fa6";

const Users = () => {
  const [searchUser, setSearchUser] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const [modalAction, setModalAction] = useState<"ADD" | "EDIT" | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleAddUser = () => {
    setModalAction("ADD");
    setSelectedUser(null);
    open();
  };

  return (
    <div className={classes.mainContainer}>
      <MainHeader
        search={searchUser}
        setSearch={setSearchUser}
        title="Users"
        placeholder="Search User..."
        withSearch
        modalButton={
          <Button leftSection={<FaPlus />} onClick={handleAddUser}>
            Add User
          </Button>
        }
      />
      <Divider />
      <UserTable
        searchUser={searchUser}
        onEdit={(user) => {
          setModalAction("EDIT");
          setSelectedUser(user);
          open();
        }}
      />

      <UserModal
        opened={opened}
        close={close}
        action={modalAction}
        detail={selectedUser}
      />
    </div>
  );
};

export default Users;
