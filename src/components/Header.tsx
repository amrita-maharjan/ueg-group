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

const Header = () => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  let userInfo = localStorage.getItem("uName") ?? "null";

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
                  <Text fw={500}>Account</Text>
                  <Flex gap={"5%"}>
                    <Avatar size={"md"}>{userInfo[0]}</Avatar>
                  </Flex>
                  <Text>Manage Account</Text>
                  <Divider></Divider>
                  <Text>Open QuickStart</Text>
                  <Text size="sm">Jira</Text>
                  <Text>Profile</Text>
                  <Text>Personal Setting</Text>
                  <Flex justify={"space-between"}>
                    <Text>Notification</Text>
                    <Text size="sm">New</Text>
                  </Flex>
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
                  <Text>Log out</Text>
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
