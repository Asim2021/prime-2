import useAuthStore from "@stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "@constants/queryKeys";
import {
  apiErrNotification,
  successNotification,
} from "@utils/sendNotification";
import {
  loginUser,
  sendForgetPasswordEmail,
  verify2FALogin,
} from "@services/authService";
import { AxiosError } from "axios";
import { isRequired, validateEmail } from "@utils/validators";

import LoginForm from "./Forms/LoginForm";
import { useEffect, useState } from "react";
import { encrypt } from "@utils/cryptoFunction";

const Login = () => {
  const { setAuth, clearAuth } = useAuthStore();
  const [show2FA, setShow2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validate: {
      email: validateEmail,
      password: (value) => isRequired(value),
    },
  });
  const navigate = useNavigate();

  const useLogin = useMutation<ErpResponse<UserData>, AxiosError, LoginData>({
    mutationFn: (values: LoginData) =>
      loginUser({
        email: encrypt(values.email),
        password: encrypt(values.password),
        remember: values.remember,
      }),
    onSuccess: (res) => {
      // Check if 2FA is required
      if (res?.data?.require2FA) {
        setTempUserId(res?.data?.userId || null);
        setShow2FA(true);
        successNotification("Please verify your identity");
        return;
      }

      setAuth(res?.data?.accessToken);
      navigate("/");
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const useVerify2FA = useMutation<ErpResponse<UserData>, AxiosError, string>({
    mutationFn: (token: string) =>
      verify2FALogin(tempUserId!, token, form.values.remember),
    onSuccess: (res) => {
      setAuth(res?.data?.accessToken);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ACCESS_TOKEN] });
      navigate("/");
      setShow2FA(false);
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const useResetPassword = useMutation<null, AxiosError, { email: string }>({
    mutationFn: (values: { email: string }) => sendForgetPasswordEmail(values),
    onSuccess: () => {
      navigate("/forgetpassword", { state: { email: form.values.email } });
      successNotification(`OTP has been sent to your Email`);
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const submitHandler = async (values: LoginData) => {
    useLogin.mutate(values);
  };

  const onForgetHandler = () => {
    if (form.values.email) {
      if (!form.validateField("email").hasError) {
        useResetPassword.mutate({ email: form.values.email });
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
    <>
      <LoginForm
        submitHandler={submitHandler}
        loading={useLogin.isPending && !useLogin.isError}
        form={form}
        onForget={onForgetHandler}
      />
    </>
  );
};

export default Login;
