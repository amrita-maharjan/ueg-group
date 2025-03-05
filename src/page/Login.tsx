import {
  Button,
  Container,
  Group,
  PasswordInput,
  TextInput,
  Title,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

export function Login() {
  const navigate = useNavigate();
  const [isloading, setIsLoading] = useState(false);

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

  const handleSubmit = (values: { uName: string; password: string }) => {
    setIsLoading(true);

    fetch("https://mondial-ueg-group-6fea23ebc309.herokuapp.com/auth/login", {
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
      .then((data) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Error occured!",
        });
      });
  };

  return (
    <Container bg={"aliceblue"} h={"100vh"} w={"100vw"} maw={"100vw"} pt={"6%"}>
      <Container
        h={500}
        bg={"white"}
        w={600}
        pt={"5%"}
        pl={"2%"}
        pr={"2%"}
        ml={"30%"}
      >
        <Title order={1}>Sign in to your account</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <TextInput
            label="Enter your UserName"
            mt={"5%"}
            radius="md"
            placeholder="Enter your username"
            key={form.key("uName")}
            {...form.getInputProps("uName")}
          />
          <PasswordInput
            label="enter your password"
            mt={"5%"}
            radius="md"
            placeholder="Enter your password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              rightSection={
                isloading ? <Loader color="white" size={15} /> : null
              }
              fullWidth
              mt={"5%"}
            >
              Log in
            </Button>
          </Group>
        </form>
      </Container>
    </Container>
  );
}
