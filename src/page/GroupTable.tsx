import {
  Button,
  Card,
  Checkbox,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../components/ConfirmationModal";
import Header from "../components/Header";
import { useAuthHeader } from "../hooks.tsx/useIsAuthenticated";
import { GroupMemberPayload } from "../types/GroupMemberPayload";
import { GroupMembers } from "../types/GroupMembers";
import {
  createPayloadForAutoRedeem,
  createPayloadForVoucherGeneration,
} from "../utils/create-payload";

const GroupTable = () => {
  const navigate = useNavigate();

  const [shouldOpenDropdown, setShouldOpenDropdown] = useState<boolean>(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<
    GroupMembers[]
  >([]);
  const [groupMembers, setGroupMembers] = useState<GroupMembers[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  //@ts-ignore
  const [isGeneratingVouchers, setIsGeneratingVouchers] = useState(false);
  //@ts-ignoreyarn build

  const [isAutoRedeemingVouchers, setIsAutoRedeemingVouchers] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [hasOpenId, setHasOpenId] = useState(false);
  const authHeader = useAuthHeader();
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [MembersStatus, setMemberStatus] = useState({});
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [loadingGroups, setLoadingGroups] = useState<{
    [key: string]: boolean;
  }>({});

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
    setSelectedGroupMembers([]);
  }, [groupId]);

  const fetchGroupMemberById = useCallback((contactId: string) => {
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
  }, []);

  const generateVouchers = useCallback(
    (groupId: string, payload: GroupMemberPayload) => {
      setIsGeneratingVouchers(true);
      fetch(
        `https://mondial-ueg-group-6fea23ebc309.herokuapp.com/api/v1/groups/generate-vouchers/${groupId}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then(() => {
          setIsGeneratingVouchers(false);
          notifications.show({
            color: "green",
            title: "Voucher generation triggered",
            message: "Please check back in a few minutes",
          });
        })
        .catch(() => {
          setIsGeneratingVouchers(false);
          notifications.show({
            color: "red",
            title: "Failed to generate vouchers",
            message: "Error occurred!",
          });
        });
    },
    []
  );

  const autoRedeemVouchers = useCallback(
    (groupId: string, payload: GroupMemberPayload) => {
      setIsAutoRedeemingVouchers(true);
      fetch(
        `https://mondial-ueg-group-6fea23ebc309.herokuapp.com/api/v1/groups/generate-vouchers/${groupId}/auto-redeem`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then(() => {
          setIsAutoRedeemingVouchers(false);
          notifications.show({
            color: "green",
            title: "Voucher auto-redeem triggered",
            message: "Please check back in a few minutes",
          });
        })
        .catch(() => {
          setIsAutoRedeemingVouchers(false);
          notifications.show({
            color: "red",
            title: "Failed to auto-redeem vouchers",
            message: "Error occurred!",
          });
        });
    },
    []
  );

  const handleRowSelection = (groupMember: GroupMembers) => {
    setSelectedRowIds((prev) =>
      prev.includes(groupMember.id)
        ? prev.filter((id) => id !== groupMember.id)
        : [...prev, groupMember.id]
    );

    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );

    setSelectedGroupMembers((prev) =>
      prev.some((row) => row.id === groupMember.id)
        ? prev.filter(
            (row) =>
              row.id !== groupMember.id &&
              row.activationCodeFormatted !== null &&
              row.paymentStatus !== "CANCELED" &&
              row.paymentStatus !== "CANCELED_GROUP_INVENTORY"
          )
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
      if (
        !groupMembers[i].activationCodeFormatted &&
        groupMembers[i].paymentStatus !== "CANCELED" &&
        groupMembers[i].paymentStatus !== "CANCELED_GROUP_INVENTORY" &&
        groupMembers[i].typeForVoucher !== null
      ) {
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
      const allSelectableRows = groupMembers
        .filter((row) => !row.activationCodeFormatted)
        .map((row) => row.id);

      setSelectedRowIds(allSelectableRows);
      setSelectedGroupMembers(
        groupMembers.filter((row) => allSelectableRows.includes(row.id))
      );
    }
  };

  const rows = groupMembers.map((members) => (
    <Table.Tr key={members.id}>
      <Table.Td>
        {
          // !members.activationCodeFormatted &&
          members.typeForVoucher != null &&
            members.paymentStatus != "CANCELED" &&
            members.paymentStatus != "CANCELED_GROUP_INVENTORY" && (
              <Checkbox
                key={members.id}
                checked={selectedRowIds.includes(members.id)}
                onChange={() => handleRowSelection(members)}
              />
            )
        }
      </Table.Td>
      <Table.Td>{members.firstName}</Table.Td>
      <Table.Td>{members.lastName}</Table.Td>

      <Table.Td>{members.activationCodeFormatted}</Table.Td>
      <Table.Td>{members.openID}</Table.Td>
      <Table.Td>{members.remarks?.join(", ")}</Table.Td>
    </Table.Tr>
  ));

  const handleAutoRedeem = () => {
    const hasOpenID = groupMembers.some((member) => member.openID);
    console.log("the open id are", hasOpenId);
    setHasOpenId(hasOpenID);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleLoading = () => {
    setLoadingGroups((prev) => {
      const updatedState = { ...prev, [groupId]: true };
      return updatedState;
    });

    setTimeout(() => {
      setLoadingGroups((prev) => ({ ...prev, [groupId]: false }));
    }, 60000);
  };

  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  const fetchStatus = useCallback(
    (groupId: string) => {
      fetch(
        `https://mondial-ueg-group-6fea23ebc309.herokuapp.com/api/v1/groups/generate-vouchers/status/${groupId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          setMemberStatus(json);
          if (
            json.status === "NOT_FOUND" ||
            json.status === "FAILED" ||
            json.status === "COMPLETED"
          ) {
            if (intervalsRef.current[groupId]) {
              clearInterval(intervalsRef.current[groupId] as NodeJS.Timeout);
              intervalsRef.current[groupId] = null;
            }
          }
        })
        .catch(() => {
          notifications.show({
            message: "Error occurred!",
          });
        });
    },
    [authHeader]
  );

  const handleVoucherCreation = () => {
    const eligibleSelectedGroupMembers = selectedGroupMembers.filter(
      (selectedGroupMember) => {
        return selectedGroupMember.typeForVoucher !== null;
      }
    );

    if (eligibleSelectedGroupMembers.length === 0) {
      return;
    }

    if (isChecked) {
      const eligibleForAutoRedeem = selectedGroupMembers.filter(
        (selectedGroupMember) => selectedGroupMember.openID
      );
      const notEligibleForAutoRedeem = selectedGroupMembers.filter(
        (selectedGroupMember) => !selectedGroupMember.openID
      );
      const payloadForAutoRedeem = createPayloadForAutoRedeem(
        groupName,
        eligibleForAutoRedeem
      );
      autoRedeemVouchers(groupId, payloadForAutoRedeem);
      const payloadForVoucherGeneration = createPayloadForVoucherGeneration(
        groupName,
        notEligibleForAutoRedeem
      );
      generateVouchers(groupId, payloadForVoucherGeneration);
    } else {
      const payloadForVoucherGeneration = createPayloadForVoucherGeneration(
        groupName,
        selectedGroupMembers
      );
      generateVouchers(groupId, payloadForVoucherGeneration);
    }
    selectedGroupIds.forEach((id) => {
      if (!intervalsRef.current[id]) {
        intervalsRef.current[id] = setInterval(() => {
          console.log(`This is the set interval for group ${id}`);
          fetchStatus(id);
        }, 10000);
      }
    });
  };

  return (
    <>
      <Stack h={"100vh"} gap={"xl"} bg={"aliceblue"}>
        <Header
          onGroupSelect={(id, name) => {
            setGroupId(id);
            setGroupName(name);
            fetchGroupMemberById(id);
            setShouldOpenDropdown(false);
          }}
          dropdownOpened={shouldOpenDropdown}
          loadingGroups={loadingGroups}
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
                style={{
                  height: "calc(100vh - 200px",
                  overflow: "auto",
                }}
              >
                <Table
                  style={{
                    borderRadius: "16px",
                    overflow: "auto",
                  }}
                  bg={"white"}
                  h={"calc(100vh - 220px"}
                  w={"90%"}
                  m={"60px"}
                  mah={"50px"}
                  mih={"20%"}
                  stickyHeader
                  stickyHeaderOffset={60}
                  captionSide="bottom"
                  highlightOnHover
                >
                  <Table.Thead
                    style={{
                      fontWeight: "normal",
                      fontSize: "14px",
                      background: "lightgrey",
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
                      <Table.Th>Remarks</Table.Th>
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
                disabled={loadingGroups[groupId] || selectedRowIds.length === 0}
                onClick={() => {
                  open();
                }}
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
      <ConfirmationModal
        opened={opened}
        close={() => {
          close();
        }}
        onOkayClick={() => {
          close();
          handleVoucherCreation();
          handleLoading();
        }}
      />
    </>
  );
};

export default GroupTable;
