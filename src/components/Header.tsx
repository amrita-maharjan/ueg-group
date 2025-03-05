import {
  Button,
  Stack,
  Flex,
  Text,
  Avatar,
  HoverCard,
  AppShell,
  Burger,
  Switch,
  Divider,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";

import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };
  const navigate = useNavigate();
  let userInfo = localStorage.getItem("uName") ?? "null";
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Flex justify={"space-between"} px={"md"} align={"center"} h={"100%"}>
            <Flex gap={"md"}>
              <MantineLogo size={30} />
            </Flex>
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <Avatar size={"md"}>{userInfo[0]}</Avatar>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Stack>
                  <Flex justify={"space-between"}>
                    <Text>Theme</Text>
                    <Switch
                      size="md"
                      color="dark.4"
                      onClick={toggleColorScheme}
                      onLabel={
                        <IconSun
                          size={16}
                          stroke={2.5}
                          color="var(--mantine-color-yellow-4)"
                        />
                      }
                      offLabel={
                        <IconMoonStars
                          size={16}
                          stroke={2.5}
                          color="var(--mantine-color-blue-6)"
                        />
                      }
                    />
                  </Flex>
                  <Divider></Divider>
                  <Button onClick={handleLogOut}>Log Out</Button>
                </Stack>
              </HoverCard.Dropdown>
            </HoverCard>
          </Flex>
        </AppShell.Header>
      </AppShell>
    </>
  );
};

export default Header;
