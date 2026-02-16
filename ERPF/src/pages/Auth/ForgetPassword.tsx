import {
  Anchor,
  Button,
  Center,
  Container,
  Paper,
  PinInput,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { sendForgetPasswordEmail, verifyOTP } from "@services/authService";
import useAuthStore from "@stores/authStore";
import { useMutation } from "@tanstack/react-query";
import {
  apiErrNotification,
  successNotification,
} from "@utils/sendNotification";
import { isRequired } from "@utils/validators";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const form = useForm<ForgetPassword>({
    initialValues: {
      otp: "",
    },
    validate: {
      otp: value => isRequired(value),
    },
  });
  const { setAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email;

  const useVerifyOTP = useMutation<
    UserData,
    AxiosError,
    { otp: string; email: string }
  >({
    mutationFn: (values: { otp: string; email: string }) => verifyOTP(values),
    onSuccess: ({ user, accessToken }: UserData) => {
      setAuth(accessToken);
      navigate("/");
      successNotification(`Welcome ${user.username}!`);
    },
    onError: (err) => {
      apiErrNotification(err);
    },
  });

  const resendOTP = useMutation<null, AxiosError, { email: string }>({
    mutationFn: (value) => sendForgetPasswordEmail(value),
    onSuccess: () => {
      successNotification(`OTP has been resent to your Email`);
    },
    onError: (err) => {
      form.reset();
      apiErrNotification(err);
    },
  });

  const submitHandler = () => {
    useVerifyOTP.mutate({ otp: form.values.otp, email: userEmail });
  };

  const resendHandler = () => {
    form.reset();
    resendOTP.mutate({ email: userEmail });
  };

  if (!userEmail) {
    navigate("/login");
  }

  return (
    <Container size={420} my={40} id="user-login-form">
      <Title ta="center">Email Verification!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Check your email for the OTP!
      </Text>
      <Paper
        id="form-container"
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
      >
        <form
          onSubmit={form.onSubmit(
            () => submitHandler(),
            (errors) => {
              const firstErrorPath = Object.keys(errors)[0];
              form.getInputNode(firstErrorPath)?.focus();
            }
          )}
        >
          <Center>
            <PinInput
              type="number"
              length={6}
              size={"md"}
              mask={false}
              inputMode={"numeric"}
              inputType="tel"
              oneTimeCode
              aria-label="One time code"
              {...form.getInputProps("otp")}
            />
          </Center>
          <Button
            type="submit"
            fullWidth
            mt="xl"
            loading={resendOTP.isPending}
            loaderProps={{ type: "dots" }}
            disabled={form.getValues().otp.length < 6}
          >
            Verify Account
          </Button>
        </form>
        <Center mt={"lg"}>
          <Text size="sm" ta="center" mr={4}>
            Didn't recieve the code?
          </Text>
          <Anchor
            underline="hover"
            size="sm"
            component="button"
            disabled={resendOTP.isPending}
            onClick={resendHandler}
          >
            Resend OTP
          </Anchor>
        </Center>
      </Paper>
    </Container>
  );
};
export default ForgetPassword;
