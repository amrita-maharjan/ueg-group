import { Flex, Select, Loader, SelectProps } from "@mantine/core";
import React from "react";
import { Group as Groups } from "../types/Group";

import { IconCheck } from "@tabler/icons-react";
import { useAuthHeader } from "../hooks.tsx/useIsAuthenticated";

type Props = {
  onGroupSelect: (id: string, name: string) => void;
  dropdownOpened: boolean;
  loadingGroups: {
    [key: string]: boolean;
  };
};

export const GroupSelect = ({ onGroupSelect, loadingGroups }: Props) => {
  const [isGroupLoading, setIsGroupLoading] = React.useState<boolean>(false);
  const [groups, setGroups] = React.useState<Groups[]>([]);
  const authHeader = useAuthHeader();
  // const dummyGroup: Group[] = [
  //   {
  //     contactId: "e69a0a2b-272c-4045-9c71-14a56763acf6",
  //     name: "Group1",
  //   },
  //   {
  //     contactId: "255fad40-d73b-4ee9-a591-9c9e490130d3",
  //     name: "Group2",
  //   },
  //   {
  //     contactId: "5f7e7559-adda-4cc0-84ab-4c8c32090fde",
  //     name: "Group3",
  //   },
  //   {
  //     contactId: "51da29d0-bea4-46eb-a094-2535b6e7bf0a",
  //     name: "Group4",
  //   },
  // ];

  React.useEffect(() => {
    setIsGroupLoading(true);
    // setGroups(dummyGroup);
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
      <Flex gap="sm" justify={"space-between"}>
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
