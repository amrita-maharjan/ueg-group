import { useState, useEffect } from "react";
import {
  Select,
  Box,
  Table,
  Checkbox,
  Button,
  Stack,
  ScrollArea,
  Flex,
  Text,
  LoadingOverlay,
  Modal,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import { IconArrowRight } from "@tabler/icons-react";

import { GroupMembers } from "../types/GroupMembers";
import { Group } from "../types/Group";
import { useNavigate } from "react-router-dom";

import { Login } from "./Login";
import Header from "../components/Header";

const GroupTable = () => {
  const navigate = useNavigate();

  const [selectedRowData, setSelectedRowData] = useState<GroupMembers[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [groupMembers, setGroupMembers] = useState<GroupMembers[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const encodeCredentials = (username: string, password: string) => {
    return btoa(`${username}:${password}`);
  };

  const username = "admin";
  const password = "1234";
  const authHeader = `Basic ${encodeCredentials(username, password)}`;

  useEffect(() => {
    let userInfo = localStorage.getItem("uName");

    let pass = localStorage.getItem("password");
    if (userInfo && pass) {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://mondial-ueg-group-6fea23ebc309.herokuapp.com/api/v1/groups`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setIsLoading(false);
      });
  }, []);
  console.log("The data is", groups);

  const fetchPostCommentsById = (contactId: string) => {
    setIsLoading(true);

    fetch(
      `https://mondial-ueg-group-6fea23ebc309.herokuapp.com/api/v1/groups/${contactId}`,
      {
        headers: {
          Authorization: "Basic YWRtaW46MTIzNA",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setGroupMembers(json);
        setIsLoading(false);
      });
  };
  console.log("the post data :", groupMembers);

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
        {!post.activationCode && (
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
      <Header />

      {isAuthenticated ? (
        <Stack justify="space-between" h={"100vh"} gap={"xl"}>
          <Stack>
            <Select
              size="md"
              mt={"5%"}
              w={"30%"}
              bg={"white"}
              placeholder="Select a group"
              data={groups.map((comment) => {
                return {
                  value: String(comment.contactId),

                  label: comment.name ? comment.name.toLowerCase() : "No Name",
                  key: String(comment.contactId),
                };
              })}
              onChange={(id) => {
                if (id) {
                  fetchPostCommentsById(id);
                }
              }}
            />

            <LoadingOverlay visible={isLoading} />
            <ScrollArea
              mt={"3%"}
              style={{ maxHeight: "65vh", overflow: "auto" }}
            >
              <Table
                style={{
                  fontFamily: "Arial",
                  height: "auto",
                }}
                horizontalSpacing="xl"
                verticalSpacing="md"
                mah={"80vh"}
                mih={"50vh"}
                stickyHeader
                captionSide="bottom"
                striped
                highlightOnHover
                withTableBorder
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
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleSelectAll}
                      />
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
          <Stack mb={"3%"}>
            <Flex justify={"space-between"}>
              <Checkbox
                size="md"
                label="Auto-reedeem the generated the voucher?"
              />
              <Modal
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
              </Modal>

              <Button
                size="lg"
                justify="center"
                rightSection={<IconArrowRight size={14} />}
                disabled={selectedRowIds.length === 0}
                onClick={open}
                w={"20%"}
              >
                Generate
              </Button>
            </Flex>
          </Stack>
        </Stack>
      ) : (
        <Login />
      )}
    </>
  );
};

export default GroupTable;
