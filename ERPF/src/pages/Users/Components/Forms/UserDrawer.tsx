import { AxiosError } from "axios";
import { useEffect } from "react";
import { MdAddCircle, MdDelete, MdEdit, MdLocalPhone } from "react-icons/md";
import { IMaskInput } from "react-imask";

import { QUERY_KEY } from "@constants/queryKeys";
import {
  Avatar,
  Button,
  Drawer,
  Group,
  InputBase,
  PasswordInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  ADD_USER_INITIAL_VALUES,
  disableAddUserForm,
  disableEditUserForm,
  EDIT_USER_INITIAL_VALUES,
  formatDate,
  getIdFromQuery,
  isAddUser,
} from "@pages/Users/constant";
import {
  addUser,
  deleteProfile,
  editUser,
  fetchUserById,
  uploadProfile,
} from "@services/userService";
import useUserStore from "@stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCountriesNameAndCode } from "@utils/currencyAndCountries";
import {
  apiErrNotification,
  failureNotification,
  successNotification,
} from "@utils/sendNotification";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "@utils/validators";
import { pick } from "lodash-es";

const UserDrawer = ({
  opened,
  close,
  title,
  setSearchParams,
  searchParams,
  formValues,
  setFormValues,
}: UserDrawerI) => {
  const queryClient = useQueryClient();
  const isAdd = isAddUser(searchParams);
  const userId = getIdFromQuery(searchParams);
  const { user } = useUserStore();

  const form = useForm<UserI>({
    name: "add-edit-user-drawer",
    initialValues: isAdd
      ? (pick(formValues, Object.keys(ADD_USER_INITIAL_VALUES)) as UserI)
      : (pick(formValues, Object.keys(EDIT_USER_INITIAL_VALUES)) as UserI),
    validate: {
      email: (value) => validateEmail(value as string),
      password: (value) =>
        isAdd ? validatePassword(value as string) : undefined,
      confirmPassword: isAdd ? validateConfirmPassword : undefined,
    },
    validateInputOnBlur: true,
  });

  const useAddUserMutation = useMutation<UserI, AxiosError, Partial<UserI>>({
    mutationFn: (values) => addUser(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_USERS] });
      successNotification(`New User ${data.firstName} ${data.lastName} added!`);
      form.reset();
      close();
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const useEditUserMutation = useMutation<UserI, AxiosError, Partial<UserI>>({
    mutationFn: (values) => editUser(searchParams.get("id"), values),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_USERS] });
      if (user.id === searchParams.get("id")) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ME] });
      }
      setFormValues(EDIT_USER_INITIAL_VALUES);
      successNotification(
        `User ${formValues?.firstName} ${formValues?.lastName} details updated!`,
      );
      close();
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const useProfileMutation = useMutation<ProfileUploadI, AxiosError, ProfileI>({
    mutationFn: (values) =>
      uploadProfile(searchParams.get("id") as string, values),
    onSuccess: (data) => {
      if (data.src) {
        setFormValues({ ...formValues, profile: data.src });
      }
      successNotification("Profile uploaded!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_USERS] });
      if (user.id === searchParams.get("id")) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ME] });
      }
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const useDeleteProfileMutation = useMutation<null, AxiosError, string>({
    mutationFn: (id) => deleteProfile(id),
    onSuccess: () => {
      setFormValues({ ...formValues, profile: null });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_USERS] });
      successNotification(`Profile deleted`);
      if (user.id === searchParams.get("id")) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ME] });
      }
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_ID, userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId && !formValues.firstName && !isAdd,
  });

  useEffect(() => {
    if (formValues && !isAdd) {
      form.setValues({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        dob: formatDate(formValues.dob),
        address: formValues.address,
        pincode: formValues.pincode,
        countryCode: formValues.countryCode,
        active: formValues.active ? "1" : "0",
        phone: formValues.phone ?? "",
      });
    }
    if (currentUser) {
      form.setValues({
        ...currentUser,
        dob: formatDate(currentUser.dob),
        active: currentUser.active ? "1" : "0",
      });
    }
    form.resetDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, isAdd, currentUser]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form.errors).some((ele) => !!ele)) {
      failureNotification("Please Clear The Errors!");
      return;
    }
    isAdd
      ? useAddUserMutation.mutate(
          pick(form.getValues(), Object.keys(ADD_USER_INITIAL_VALUES)),
        )
      : useEditUserMutation.mutate(
          pick(form.getValues(), Object.keys(EDIT_USER_INITIAL_VALUES)),
        );
  };

  const onFileChange = (e: Event, input: HTMLInputElement) => {
    const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
    const file = event.target.files?.[0] as File;
    const sizeLimit = 1024 * 1024;
    if (file && file?.size <= sizeLimit && file?.size > 0 && !!input.value) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // reader.result will be the base64 string
      reader.onloadend = () => {
        const fileData = {
          name: file?.name,
          fileBase64: reader.result,
          type: file?.type,
          size: file?.size,
        };
        useProfileMutation.mutate(fileData);
      };
      input.value = "";
    } else {
      failureNotification("File size should be upto 1MB");
    }
  };

  const openFileExplorer = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.onchange = (e) => onFileChange(e, input);
    input.accept = "image/png, image/jpeg";
    input.click();
  };

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        setSearchParams({});
        isAdd
          ? form.setValues(ADD_USER_INITIAL_VALUES)
          : form.setValues(EDIT_USER_INITIAL_VALUES);
        close();
      }}
      title={
        <div className="flex items-center w-[230px] justify-between">
          <Title order={4}>{title}</Title>
          {!isAdd && (
            <div className="relative">
              {formValues?.profile ? (
                <>
                  <MdEdit
                    size={18}
                    className="absolute -right-3 z-50 -top-1 cursor-pointer"
                    title="Edit"
                    onClick={openFileExplorer}
                  />
                  <MdDelete
                    size={18}
                    className="absolute -right-3 z-50 -bottom-1 cursor-pointer"
                    title="Delete"
                    onClick={(e) => {
                      e.preventDefault();
                      useDeleteProfileMutation.mutate(
                        searchParams.get("id") as string,
                      );
                    }}
                  />
                </>
              ) : (
                <MdAddCircle
                  size={18}
                  className="absolute -right-3 z-50 -bottom-1 cursor-pointer"
                  title="Upload Profile"
                  onClick={openFileExplorer}
                />
              )}
              <Avatar
                src={formValues?.profile}
                alt={`${formValues.firstName} ${formValues.lastName}`}
                radius={60}
                size={60}
                className="err_avatar border"
              />
            </div>
          )}
        </div>
      }
      position="right"
      id="user-drawer"
      key={title}
      size={460}
      overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      transitionProps={{
        transition: "fade-left",
        duration: 200,
        timingFunction: "linear",
      }}
      closeOnClickOutside={false}
    >
      <Stack gap={"0.5rem"}>
        <Group grow wrap="wrap">
          <TextInput
            label="First Name"
            placeholder="John"
            key={form.key("firstName")}
            {...form.getInputProps("firstName")}
            withAsterisk
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            key={form.key("lastName")}
            {...form.getInputProps("lastName")}
            withAsterisk
          />
        </Group>
        <Group grow wrap="wrap">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="...@gmail.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
            inputMode="email"
          />
          <DateInput
            label="Date of birth"
            placeholder="01/01/1995"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("dob")}
            key={form.key("dob")}
            clearable
          />
        </Group>
        {isAdd && (
          <Group grow wrap="wrap">
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Your Password"
              {...form.getInputProps("password")}
              key={form.key("password")}
              width={"50%"}
            />
            <PasswordInput
              withAsterisk
              label="Confirm Password"
              placeholder="Confirm Password"
              {...form.getInputProps("confirmPassword")}
              key={form.key("confirmPassword")}
              width={"50%"}
            />
          </Group>
        )}
        <Textarea
          label="Address"
          placeholder="Address"
          {...form.getInputProps("address")}
          key={form.key("address")}
          autosize
        />
        <Group grow wrap="wrap">
          <Select
            label="Country"
            placeholder="India"
            key={form.key("countryCode")}
            {...form.getInputProps("countryCode")}
            data={getCountriesNameAndCode()}
            searchable
            autoComplete="off"
            clearable
            onClear={() => form.setFieldValue("phone", "")}
            defaultValue={null}
          />
          <TextInput
            label="State"
            placeholder="Delhi"
            key={form.key("state")}
            {...form.getInputProps("state")}
          />
        </Group>
        <Group grow wrap="wrap">
          <TextInput
            label="Pincode"
            placeholder="110006"
            key={form.key("pincode")}
            {...form.getInputProps("pincode")}
          />
          <InputBase
            label="Phone"
            placeholder="Your phone"
            mask={"0000-00-0000"}
            component={IMaskInput}
            key={form.key("phone")}
            {...form.getInputProps("phone")}
            leftSection={<MdLocalPhone size={18} />}
            disabled={!form.values.countryCode}
          />
        </Group>
        <Group grow wrap="wrap">
          {!isAdd && (
            <Select
              label="User Status"
              placeholder="Pick a status"
              defaultValue="0"
              key={form.key("active")}
              data={[
                { value: "1", label: "Active" },
                { value: "0", label: "In Active" },
              ]}
              {...form.getInputProps("active")}
            />
          )}
        </Group>
        <Button
          type="submit"
          fullWidth
          mt="xs"
          loading={
            useAddUserMutation.isPending || useEditUserMutation.isPending
          }
          loaderProps={{ type: "dots" }}
          disabled={
            (isAdd ? disableAddUserForm(form) : disableEditUserForm(form)) ||
            Object.values(form.errors).some((ele) => !!ele)
          }
          onClick={submitHandler}
        >
          Save
        </Button>
      </Stack>
      <Text size="xs" mt={4}>
        * field are required
      </Text>
    </Drawer>
  );
};

export default UserDrawer;

interface UserDrawerI {
  opened: boolean;
  close: () => void;
  title: string;
  setSearchParams: (obj: { userAction?: string }) => void;
  searchParams: URLSearchParams;
  formValues: Partial<UserI>;
  setFormValues: (obj: UserI) => void;
}
