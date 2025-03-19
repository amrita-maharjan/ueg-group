import {
  Button,
  Container,
  Group,
  Loader,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      uName: "",
      password: "",
    },
    validate: {
      uName: (value: any) => {
        if (!value) {
          return "Invalid username";
        }
        return;
      },
      password: (value: any) => {
        if (!value) {
          return "Invalid password";
        }
        return;
      },
    },
  });
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = (values: { uName: string; password: string }) => {
    setIsLoading(true);

    fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.uName,
        password: values.password,
      }),
    })
      .then((response) => {
        setIsLoading(false);
        if (!response.ok) {
          notifications.show({
            color: "red",
            title: "Error",
            message: "Incorrect credentials!",
          });
        } else {
          localStorage.setItem("uName", values.uName);
          localStorage.setItem("password", values.password);
          navigate("/");
          notifications.show({
            color: "green",
            title: "Success",
            message: "Logged in successfully!",
          });
        }
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Error occurred!",
        });
      });
  };

  return (
    <Container
      bg={"aliceblue"}
      h={"100vh"}
      w={"100vw"}
      maw={"100vw"}
      pt={"10%"}
    >
      <Container
        h={400}
        bg={"white"}
        w={600}
        m="auto"
        p="xl"
        style={{ borderRadius: "16px" }}
      >
        <Stack>
          <Title order={1}>Sign in to your account</Title>
          <form
            onSubmit={form.onSubmit((values) => {
              handleSubmit(values);
            })}
          >
            <Stack gap={"lg"}>
              <TextInput
                label="Enter your username"
                radius="md"
                placeholder="Enter your username"
                key={form.key("uName")}
                {...form.getInputProps("uName")}
              />
              <PasswordInput
                label="Enter your password"
                radius="md"
                placeholder="Enter your password"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
              <Group justify="flex-end" mt="md">
                <Button
                  type="submit"
                  rightSection={
                    isLoading ? <Loader color="white" size={15} /> : null
                  }
                  fullWidth
                >
                  Log in
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Container>
  );
}
