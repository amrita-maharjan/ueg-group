import {
  Button,
  Checkbox,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
  Card,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { GroupMembers } from "../types/GroupMembers";
import Header from "../components/Header";
import { notifications } from "@mantine/notifications";
import { useAuthHeader } from "../hooks.tsx/useIsAuthenticated";
import { createPayload } from "../utils/create-payload";

const GroupTable = () => {
  const navigate = useNavigate();

  const [shouldOpenDropdown, setShouldOpenDropdown] = useState<boolean>(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<
    GroupMembers[]
  >([]);
  const [groupMembers, setGroupMembers] = useState<GroupMembers[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [hasOpenId, setHasOpenId] = useState(false);
  const authHeader = useAuthHeader();
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("uName");
    const password = localStorage.getItem("password");
    if (!username || !password) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    handleAutoRedeem();
  }, [groupId]);

  useEffect(() => {
    setSelectedRowIds([]);
    setSelectedGroupMembers([]);
  }, [groupId]);

  const fetchGroupMemberById = (contactId: string) => {
    setIsMembersLoading(true);
    fetch(
      `https://mondial-ueg-group-6fea23ebc309.herokuapp.com/api/v1/groups/${contactId}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setGroupMembers(json);
        setIsMembersLoading(false);
      })
      .catch(() => {
        setIsMembersLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Error occurred!",
        });
      });
  };

  const handleRowSelection = (groupMember: GroupMembers) => {
    setSelectedRowIds((prev) =>
      prev.includes(groupMember.id)
        ? prev.filter((id) => id !== groupMember.id)
        : [...prev, groupMember.id]
    );
    setSelectedGroupMembers((prev) =>
      prev.some((row) => row.id === groupMember.id)
        ? prev.filter((row) => row.id !== groupMember.id)
        : [...prev, groupMember]
    );
  };

  const allSelected =
    selectedRowIds.length === groupMembers.length && groupMembers.length > 0;

  const someSelected =
    selectedRowIds.length > 0 && selectedRowIds.length < groupMembers.length;

  const getShouldShowSelectAll = () => {
    let shouldShowSelectAll = false;
    for (let i = 0; i < groupMembers.length; i++) {
      if (!groupMembers[i].activationCodeFormatted) {
        shouldShowSelectAll = true;
        break;
      }
    }
    return shouldShowSelectAll;
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === groupMembers.length) {
      setSelectedRowIds([]);
      setSelectedGroupMembers([]);
    } else {
      const allSelectedRows = groupMembers.map((row) => row.id);
      setSelectedRowIds(allSelectedRows);
      setSelectedGroupMembers(groupMembers);
    }
  };
  const rows = groupMembers.map((members) => (
    <Table.Tr key={members.id}>
      <Table.Td>
        {!members.activationCodeFormatted && (
          <Checkbox
            key={members.id}
            checked={selectedRowIds.includes(members.id)}
            onChange={() => handleRowSelection(members)}
          />
        )}
      </Table.Td>
      <Table.Td>{members.firstName}</Table.Td>
      <Table.Td>{members.lastName}</Table.Td>

      <Table.Td>{members.activationCodeFormatted}</Table.Td>
      <Table.Td>{members.openID}</Table.Td>
    </Table.Tr>
  ));

  const handleAutoRedeem = () => {
    const hasOpenID = groupMembers.some((member) => member.openID);
    setHasOpenId(hasOpenID);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      <Stack h={"100vh"} gap={"xl"}>
        <Header
          onGroupSelect={(id, name) => {
            setGroupId(id);
            setGroupName(name);
            fetchGroupMemberById(id);
            setShouldOpenDropdown(false);
          }}
          dropdownOpened={shouldOpenDropdown}
        />
        {groupMembers.length == 0 ? (
          <Flex
            bg={"aliceblue"}
            h={"100vh"}
            w={"100vw"}
            justify="center"
            align="center"
          >
            <Card w={"30vw"} h={"30vh"} radius="md" shadow="md" withBorder>
              <Card.Section p={"xl"}>
                <Stack justify="center" align="center" gap={"xs"}>
                  <IconSearch
                    size={80}
                    color="var(--mantine-color-blue-filled)"
                  />
                  <LoadingOverlay visible={isMembersLoading} />
                  <Text size="lg" fw={"500"}>
                    No members found
                  </Text>
                  <Text c={"gray"} size="sm">
                    Please select a group to get started!
                  </Text>
                  {/* <Button
                    onClick={() => {
                      setShouldOpenDropdown(true);
                    }}
                    mt="md"
                  >
                    Click
                  </Button> */}
                </Stack>
              </Card.Section>
            </Card>
          </Flex>
        ) : (
          <>
            <Stack gap={"sm"} p={"xl"} pb={"md"}>
              <LoadingOverlay visible={isMembersLoading} />
              <ScrollArea
                style={{ height: "calc(100vh - 200px", overflow: "auto" }}
              >
                <Table
                  style={{
                    borderRadius: "16px",
                  }}
                  horizontalSpacing="xl"
                  verticalSpacing="md"
                  h={"calc(100vh - 220px"}
                  mih={"50vh"}
                  stickyHeader
                  captionSide="bottom"
                  highlightOnHover
                  withColumnBorders
                >
                  <Table.Thead
                    // bg="rgba(243, 243, 243, 1)"
                    style={{
                      fontWeight: "normal",
                      fontSize: "14px",
                    }}
                  >
                    <Table.Tr>
                      <Table.Td>
                        {getShouldShowSelectAll() ? (
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected}
                            onChange={toggleSelectAll}
                          />
                        ) : null}
                      </Table.Td>
                      <Table.Th>First Name</Table.Th>
                      <Table.Th>Last Name</Table.Th>
                      <Table.Th> Code Formatted</Table.Th>
                      <Table.Th>Open ID</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea>
            </Stack>
            <Stack align="flex-end" px={"xl"}>
              <Button
                justify="center"
                rightSection={<IconArrowRight size={14} />}
                disabled={selectedRowIds.length === 0}
                onClick={open}
              >
                Generate
              </Button>
              <Checkbox
                label="Auto-redeem the generated the voucher?"
                disabled={!hasOpenId}
                onChange={handleCheckboxChange}
                checked={isChecked}
              />
            </Stack>
          </>
        )}
      </Stack>
      <Modal opened={opened} onClose={close}>
        <Stack>
          <Text fw={"500"}>Confirm Voucher Generation</Text>
          <Text>
            Are you sure you want to generate voucher for the selected
            participants?
          </Text>
          <Flex gap={"lg"} justify={"flex-end"}>
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="filled"
              onClick={() => {
                close();
                const eligibleSelectedGroupMembers =
                  selectedGroupMembers.filter((selectedGroupMember) => {
                    return !selectedGroupMember.activationCodeFormatted;
                  });
                const payload = createPayload(
                  groupName,
                  eligibleSelectedGroupMembers
                );
                console.log("print", payload);
              }}
            >
              Ok
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};

export default GroupTable;
