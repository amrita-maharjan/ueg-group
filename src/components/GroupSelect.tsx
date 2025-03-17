import { Flex, Select, Loader, SelectProps } from "@mantine/core";
import React from "react";
import { Group as Groups } from "../types/Group";
import { useAuthHeader } from "../hooks.tsx/useIsAuthenticated";
import { IconCheck } from "@tabler/icons-react";

type Props = {
  onGroupSelect: (id: string, name: string) => void;
  dropdownOpened: boolean;
  loadingGroups: {
    [key: string]: boolean;
  };
};

export const GroupSelect = ({
  onGroupSelect,
  dropdownOpened,
  loadingGroups,
}: Props) => {
  const [isGroupLoading, setIsGroupLoading] = React.useState<boolean>(false);
  const [groups, setGroups] = React.useState<Groups[]>([]);
  const authHeader = useAuthHeader();

  React.useEffect(() => {
    setIsGroupLoading(true);

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
        setIsGroupLoading(false);
      });
  }, []);

  const handleSelect = (value: string | null) => {
    if (value) {
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
      <Flex gap="xl" justify={"space-between"}>
        {checked && (
          <IconCheck style={{ marginInlineStart: "auto" }} {...GroupSelect} />
        )}
        {option.label}
        {isLoading && <Loader size={15} />}
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
        // dropdownOpened={dropdownOpened}
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
