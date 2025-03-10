import {
  Button,
  Checkbox,
  Flex,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Box,
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

const GroupTable = () => {
  const navigate = useNavigate();

  const [shouldOpenDropdown, setShouldOpenDropdown] = useState<boolean>(false);
  const [RowData, setRowDAta] = useState<GroupMembers[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMembers[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [hasOpenId, setHasOpenId] = useState(false);
  const authHeader = useAuthHeader();
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const type0 = [];
  const type1 = [];
  const type2 = [];
  const type3 = [];
  const type4 = [];
  const type5 = [];
  const type6 = [];
  const type7 = [];

  for (let i = 0; i < RowData.length; i++) {
    if (
      RowData[i].typeForVoucher === 0 &&
      !RowData[i].activationCodeFormatted
    ) {
      type0.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    } else if (
      RowData[i].typeForVoucher === 1 &&
      !RowData[i].activationCodeFormatted
    ) {
      type1.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    } else if (
      RowData[i].typeForVoucher === 2 &&
      !RowData[i].activationCodeFormatted
    ) {
      type2.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    } else if (
      RowData[i].typeForVoucher === 3 &&
      !RowData[i].activationCodeFormatted
    ) {
      type3.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    } else if (
      RowData[i].typeForVoucher === 4 &&
      !RowData[i].activationCodeFormatted
    ) {
      type4.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    } else if (
      RowData[i].typeForVoucher === 5 &&
      !RowData[i].activationCodeFormatted
    ) {
      type5.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    } else if (
      RowData[i].typeForVoucher === 6 &&
      !RowData[i].activationCodeFormatted
    ) {
      type6.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    } else if (
      RowData[i].typeForVoucher === 7 &&
      !RowData[i].activationCodeFormatted
    ) {
      type7.push(
        RowData[i].typeForVoucher,
        RowData[i].firstName,
        RowData[i].lastName
      );
    }
  }
  console.log("Type0", type0);
  console.log("Type1", type1);
  console.log("Type2", type2);
  console.log("Type3", type3);
  console.log("Type4", type4);
  console.log("Type5", type5);
  console.log("Type6", type6);
  console.log("Type7", type7);
  useEffect(() => {
    const username = localStorage.getItem("uName");
    const password = localStorage.getItem("password");
    if (!username || !password) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    handleAutoRedeem();
  }, [groupMembers]);

  useEffect(() => {
    setSelectedRowIds([]);
    setRowDAta([]);
  }, [groupMembers]);

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
  console.log("group members are", groupMembers);

  const handleRowSelection = (groupMember: GroupMembers) => {
    setSelectedRowIds((prev) =>
      prev.includes(groupMember.id)
        ? prev.filter((id) => id !== groupMember.id)
        : [...prev, groupMember.id]
    );
    setRowDAta((prev) =>
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
      setRowDAta([]);
    } else {
      const allSelectedRows = groupMembers.map((row) => row.id);
      setSelectedRowIds(allSelectedRows);
      setRowDAta(groupMembers);
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
  console.log("Group Id ", groupId);
  console.log("Group name", groupName);

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
                  <Button
                    onClick={() => {
                      setShouldOpenDropdown(true);
                    }}
                    mt="md"
                  >
                    Click
                  </Button>
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
      {/* <Modal opened={opened} onClose={close}>
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
            <Button variant="filled" onClick={close}>
              Ok
            </Button>
          </Flex>
        </Stack>
      </Modal> */}
      <Modal
        opened={opened}
        title="Selected Row Details"
        onClose={close}
        centered
      >
        {RowData.length > 0 ? (
          <Box>
            {RowData.map((row) => (
              <Box key={row.id} mb="sm">
                {!row.activationCodeFormatted ? (
                  <>
                    <p>
                      <strong>GroupId:</strong>
                      {groupId}
                    </p>
                    <p>
                      <strong>GroupName:</strong>
                      {groupName}
                    </p>
                    <p>
                      <strong>ID:</strong> {row.id}
                    </p>
                    <p>
                      <strong>Firstname:</strong> {row.firstName}
                    </p>
                    <p>
                      <strong>Lastname:</strong> {row.lastName}
                    </p>
                    <p>
                      <strong>Type:</strong> {row.typeForVoucher}
                    </p>
                    <p>
                      <strong>OpenID:</strong>{" "}
                      {row.openID ? row.openID : "No value"}
                    </p>
                    <p>
                      <strong>Autoreedem:</strong>{" "}
                      {isChecked ? "checked" : "not checked"}
                    </p>
                    <hr />{" "}
                  </>
                ) : null}
              </Box>
            ))}
          </Box>
        ) : (
          <p>No rows selected</p>
        )}
      </Modal>
    </>
  );
};

export default GroupTable;
