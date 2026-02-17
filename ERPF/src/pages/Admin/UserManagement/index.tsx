import { useState } from "react";

import classes from "./user.module.css";
import UserTable from "./Components/UserTable/UserTable";
import { Divider } from "@mantine/core";
import MainHeader from "@components/Header/MainHeader";

const Users = () => {
  const [searchUser, setSearchUser] = useState<string>("");

  return (
    <div className={classes.mainContainer}>
      <MainHeader
        search={searchUser}
        setSearch={setSearchUser}
        title="Users"
        placeholder="Search User..."
        withSearch
      />
      <Divider />
      <UserTable searchUser={searchUser} />
    </div>
  );
};

export default Users;
