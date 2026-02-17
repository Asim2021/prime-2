import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { MdAlternateEmail, MdLock } from "react-icons/md";

interface LoginFormProps {
  submitHandler: (values: LoginDataI) => Promise<void>;
  form: UseFormReturnType<LoginDataI>;
  loading?: boolean;
  onForget?: () => void;
}

const LoginForm = ({
  submitHandler,
  form,
  loading,
  onForget,
}: LoginFormProps) => {
  return (
    <Container size={420} my={40} id="user-login-form">
      <Title ta="center">Welcome!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Contact HR, if you do not have an account!
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(
            (values) => submitHandler(values),
            (errors) => {
              const firstErrorPath = Object.keys(errors)[0];
              form.getInputNode(firstErrorPath)?.focus();
            },
          )}
        >
          <TextInput
            label="Email/Username"
            placeholder="...@gmail.com"
            {...form.getInputProps("username")}
            withAsterisk
            title="Please Fill out this field"
            leftSection={
              <MdAlternateEmail
                size={18}
                color={"var(--mantine-primary-color-6)"}
              />
            }
          />
          <PasswordInput
            label="Password"
            placeholder="password"
            mt="md"
            {...form.getInputProps("password")}
            withAsterisk
            title="Please Fill out this field"
            leftSection={
              <MdLock size={18} color={"var(--mantine-primary-color-6)"} />
            }
          />
          <Group mt="lg" justify="space-between">
            <Checkbox
              label={"Remember Me"}
              {...form.getInputProps("remember", { type: "checkbox" })}
              title="Select this will make you logged In for long"
            />
            <Anchor size="sm" onClick={onForget}>
              Forgot password?
            </Anchor>
          </Group>
          <Button
            type="submit"
            fullWidth
            mt="lg"
            loading={loading}
            loaderProps={{ type: "dots" }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
export default LoginForm;
