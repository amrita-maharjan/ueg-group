import { Flex, Loader, Select, SelectProps } from "@mantine/core";
import React from "react";
import { Group as Groups } from "../types/Group";

import { IconCheck } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { fetchData } from "../api/api-client";
import { groupMembersUrl } from "../api/api-urls";

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

  const fetchGroup = async () => {
    setIsGroupLoading(true);
    const result = await fetchData<Groups[]>(groupMembersUrl);
    setGroups(result);
    const selectedGroupId = searchParams.get("group-id");
    const selectedGroup = result.find(
      (group) => group.contactId === selectedGroupId
    );
    if (selectedGroup) {
      onGroupSelect(selectedGroup.contactId, selectedGroup.name);
    }
    setIsGroupLoading(false);
  };

  React.useEffect(() => {
    fetchGroup();
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
