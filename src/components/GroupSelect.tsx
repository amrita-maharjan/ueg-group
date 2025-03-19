import { Flex, Loader, Select, SelectProps } from "@mantine/core";
import React from "react";
import { Group as Groups } from "../types/Group";

import { IconCheck } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { useAuthHeader } from "../hooks.tsx/useIsAuthenticated";

type Props = {
  onGroupSelect: (id: string, name: string) => void;
  dropdownOpened: boolean;
  loadingGroups: {
    [key: string]: boolean;
  };
};

export const GroupSelect = ({ onGroupSelect, loadingGroups }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isGroupLoading, setIsGroupLoading] = React.useState<boolean>(false);
  const [groups, setGroups] = React.useState<Groups[]>([]);
  const authHeader = useAuthHeader();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  React.useEffect(() => {
    setIsGroupLoading(true);

    fetch(`${baseUrl}/api/v1/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setIsGroupLoading(false);
        const selectedGroupId = searchParams.get("group-id");
        const selectedGroup = (data as Groups[]).find(
          (group) => String(group.contactId) === selectedGroupId
        );
        if (selectedGroup) {
          onGroupSelect(selectedGroup.contactId, selectedGroup.name);
        }
      });
  }, []);

  const handleSelect = (value: string | null) => {
    if (value) {
      setSearchParams({ "group-id": value });
      const selectedGroup = groups.find(
        (group) => String(group.contactId) === value
      );
      if (selectedGroup) {
        onGroupSelect(selectedGroup.contactId, selectedGroup.name);
      }
    }
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const isLoading = loadingGroups?.[option.value];

    return (
      <Flex style={{ flexGrow: 2 }} gap={"sm"} align={"center"}>
        {checked && <IconCheck size={16} {...GroupSelect} />}
        {option.label}
        <Flex justify={"flex-end"} style={{ flexGrow: 2 }}>
          {isLoading && <Loader size={15} />}
        </Flex>
      </Flex>
    );
  };

  const sortedGroupData = groups.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Flex align={"center"} gap={"md"} w="100%">
      <Select
        searchable
        w={"30vw"}
        bg={"white"}
        placeholder="Select a group"
        value={searchParams.get("group-id")}
        data={sortedGroupData.map((group) => {
          const isLoading = loadingGroups[group.contactId];
          return {
            value: String(group.contactId),
            label: group.name ? group.name.toLowerCase() : "No Name",
            key: String(group.contactId),
            disabled: isLoading,
          };
        })}
        renderOption={renderSelectOption}
        onChange={handleSelect}
      />

      {isGroupLoading ? <Loader color="blue" size={"sm"} /> : null}
    </Flex>
  );
};
