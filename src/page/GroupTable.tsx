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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { GroupMembers } from "../types/GroupMembers";
import Header from "../components/Header";
import { notifications } from "@mantine/notifications";
import { useAuthHeader } from "../hooks.tsx/useAuthHeader";

const GroupTable = () => {
  const navigate = useNavigate();
  const [selectedRowData, setSelectedRowData] = useState<GroupMembers[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMembers[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const authHeader = useAuthHeader();

  useEffect(() => {
    const username = localStorage.getItem("uName");
    const password = localStorage.getItem("password");
    if (!username || !password) {
      navigate("/login");
    }
  }, []);

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
      .catch((err) => {
        console.log(err.message);
        setIsMembersLoading(false);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Error occurred!",
        });
      });
  };

  const handleRowSelection = (post: any) => {
    setSelectedRowIds((prev) =>
      prev.includes(post.id)
        ? prev.filter((id) => id !== post.id)
        : [...prev, post.id]
    );
    setSelectedRowData((prev) =>
      prev.some((row) => row.id === post.id)
        ? prev.filter((row) => row.id !== post.id)
        : [...prev, post]
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
      setSelectedRowData([]);
    } else {
      const allSelectedRows = groupMembers.map((row) => row.id);
      setSelectedRowIds(allSelectedRows);
      setSelectedRowData(groupMembers);
    }
  };
  const rows = groupMembers.map((post) => (
    <Table.Tr key={post.id}>
      <Table.Td>
        {!post.activationCodeFormatted && (
          <Checkbox
            key={post.id}
            checked={selectedRowIds.includes(post.id)}
            onChange={() => handleRowSelection(post)}
          />
        )}
      </Table.Td>
      <Table.Td>{post.firstName}</Table.Td>
      <Table.Td>{post.lastName}</Table.Td>
      <Table.Td>{post.activationCode}</Table.Td>
      <Table.Td>{post.activationCodeFormatted}</Table.Td>
      <Table.Td>{post.activationPIN}</Table.Td>
      <Table.Td>{post.claimAccessURL}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack h={"100vh"} p={"xl"} gap={"xl"}>
        <Header onGroupSelect={(id) => fetchGroupMemberById(id)} />
        <Stack gap={"sm"}>
          <LoadingOverlay visible={isMembersLoading} />
          <ScrollArea
            style={{ height: "calc(100vh - 220px", overflow: "auto" }}
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
                bg="rgba(243, 243, 243, 1)"
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
                  <Table.Th>Code</Table.Th>
                  <Table.Th> Code Formatted</Table.Th>
                  <Table.Th> Pin</Table.Th>
                  <Table.Th>Claim Access Url</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
        <Stack align="flex-end">
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
            disabled={selectedRowIds.length === 0}
          />
        </Stack>
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
            <Button variant="filled" onClick={close}>
              Ok
            </Button>
          </Flex>
        </Stack>
      </Modal>
      {/* <Modal
              opened={opened}
              title="Selected Row Details"
              onClose={close}
              centered
            >
              {selectedRowData.length > 0 ? (
                <Box>
                  {selectedRowData.map((row) => (
                    <Box key={row.id} mb="sm">
                      {!row.activationCode ? (
                        <>
                          <p>
                            <strong>ID:</strong> {row.id}
                          </p>
                          <p>
                            <strong>Firstname:</strong> {row.firstName}
                          </p>
                          <p>
                            <strong>Lastname</strong> {row.lastName}
                          </p>
                          <p>
                            <strong>ActivationCodeFormatted</strong>{" "}
                            {row.activationCodeFormatted}
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
            </Modal> */}
    </>
  );
};

export default GroupTable;
