import {
  AppShell,
  Avatar,
  Button,
  Divider,
  Flex,
  HoverCard,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { GroupSelect } from "./GroupSelect";

type Props = {
  onGroupSelect: (id: string, name: string) => void;
};

const Header = ({ onGroupSelect }: Props) => {
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
        <Flex justify={"space-between"} px={"xl"} align={"center"} h={"100%"}>
          <Logo />
          <Flex gap={"md"}>
            <GroupSelect onGroupSelect={onGroupSelect} />
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <Avatar size={"md"}>{userInfo[0].toUpperCase()}</Avatar>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Stack>
                  <Flex justify={"space-between"}>
                    <Text>Theme</Text>
                    <Switch
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
        </Flex>
      </AppShell.Header>
    </AppShell>
  );
};

export default Header;
