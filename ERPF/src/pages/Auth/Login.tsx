import { useEffect } from "react";
import useAuthStore from "@stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import {
  apiErrNotification,
  successNotification,
} from "@utils/sendNotification";
import { loginUser, sendForgetPasswordEmail } from "@services/authService";
import { AxiosError } from "axios";
import { isRequired } from "@utils/validators";

import LoginForm from "./Forms/LoginForm";
import { encrypt } from "@utils/cryptoFunction";
import { ENDPOINT } from "@constants/endpoints";

const Login = () => {
  const { setAuth, clearAuth } = useAuthStore();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validate: {
      username: (value) => isRequired(value),
      password: (value) => isRequired(value),
    },
  });
  const navigate = useNavigate();

  const useLogin = useMutation<ErpResponseI<UserDataI>, AxiosError, LoginDataI>({
    mutationFn: (values: LoginDataI) =>
      loginUser({
        username: encrypt(values.username.trim()),
        password: encrypt(values.password.trim()),
        remember: values.remember,
      }),
    onSuccess: (res) => {
      setAuth(res?.data?.accessToken);
      navigate("/");
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const useResetPassword = useMutation<null, AxiosError, { email: string }>({
    mutationFn: sendForgetPasswordEmail,
    onSuccess: () => {
      navigate(ENDPOINT.AUTH.FORGET_PASSWORD, {
        state: { email: form.values.username },
      });
      successNotification(`OTP has been sent to your Email`);
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const submitHandler = async (values: LoginDataI) => {
    useLogin.mutate(values);
  };

  const onForgetHandler = () => {
    if (form.values.username) {
      if (!form.validateField("email").hasError) {
        useResetPassword.mutate({ email: form.values.username });
      } else {
        form.getInputNode("email")?.focus();
        form.validateField("email");
      }
    } else {
      form.getInputNode("email")?.focus();
      form.setErrors({ email: "Please enter your email" });
    }
  };

  useEffect(() => {
    clearAuth();
  }, [clearAuth]);

  return (
    <LoginForm
      submitHandler={submitHandler}
      loading={useLogin.isPending && !useLogin.isError}
      form={form}
      onForget={onForgetHandler}
    />
  );
};

export default Login;
