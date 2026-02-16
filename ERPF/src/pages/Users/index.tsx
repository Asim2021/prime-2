import { useDisclosure } from "@mantine/hooks";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import UserDrawer from "./Components/Forms/UserDrawer";
import classes from "./user.module.css";
import UserHeader from "./UserHeader";
import { DEFAULT_USER, isAddUser, isEditUser, USER_DRAWER } from "./constant";
import { STRINGS } from "@constants/strings";
import UserTable from "./Components/UserTable/UserTable";

const Users = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams("");
  const [searchUser, setSearchUser] = useState<string>("");
  const [formValues, setFormValues] = useState<UserI>(DEFAULT_USER);

  useEffect(() => {
    if (
      searchParams &&
      searchParams?.size &&
      (isEditUser(searchParams) || isAddUser(searchParams))
    ) {
      open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const userEditHandler = (action: string, payload: UserI) => {
    setFormValues(payload);
    setSearchParams({
      [STRINGS.USER_ACTION]: action,
      id: payload.id,
    } as { userAction: string; id: string });
    open();
  };
  return (
    <div className={classes.mainContainer}>
      <UserHeader
        open={open}
        setSearchParams={setSearchParams}
        searchUser={searchUser}
        setSearchUser={setSearchUser}
      />
      <UserTable
        userEditHandler={userEditHandler}
        searchUser={searchUser}
      />
      <UserDrawer
        opened={opened}
        close={() => {
          setFormValues(DEFAULT_USER);
          close();
        }}
        title={
          isAddUser(searchParams)
            ? USER_DRAWER.ADD_TITLE
            : USER_DRAWER.EDIT_TITLE
        }
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </div>
  );
};

export default Users;
