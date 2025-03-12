import {
  Flex,
  Button,
  Select,
  Loader,
  SelectProps,
  Group,
} from "@mantine/core";
import React, { useState } from "react";
import { Group as Groups } from "../types/Group";
import { useAuthHeader } from "../hooks.tsx/useIsAuthenticated";

type Props = {
  onGroupSelect: (id: string, name: string) => void;
  dropdownOpened: boolean;
};

export const GroupSelect = ({ onGroupSelect, dropdownOpened }: Props) => {
  const [isGroupLoading, setIsGroupLoading] = React.useState<boolean>(false);
  const [groups, setGroups] = React.useState<Groups[]>([]);
  const authHeader = useAuthHeader();
  const [disabledGroups, setDisabledGroups] = useState<string[]>([]);
  const [loadingGroups, setLoadingGroups] = useState<{
    [key: string]: boolean;
  }>({});

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

        setDisabledGroups((prev) =>
          [...prev, value].filter((id) => id !== null)
        );
        setLoadingGroups((prev) => ({ ...prev, [value]: true }));

        setTimeout(() => {
          setDisabledGroups((prev) => prev.filter((id) => id !== value));
          setLoadingGroups((prev) => ({ ...prev, [value]: false }));
        }, 60000);
      }
    }
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const isLoading = loadingGroups[option.value];

    return (
      <Flex flex="1" gap="xs" justify={"space-between"}>
        {option.label}
        {isLoading && <Loader size={15} />}
      </Flex>
    );
  };

  const sortedData = groups.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Flex align={"center"} gap={"md"} w="100%">
      <Select
        searchable
        w={"30vw"}
        bg={"white"}
        placeholder="Select a group"
        // dropdownOpened={dropdownOpened}
        data={sortedData.map((comment) => {
          const isDisabled = disabledGroups.includes(String(comment.contactId));
          return {
            value: String(comment.contactId),
            label: comment.name ? comment.name.toLowerCase() : "No Name",
            key: String(comment.contactId),
            disabled: isDisabled,
          };
        })}
        renderOption={renderSelectOption}
        onChange={handleSelect}
      />

      {isGroupLoading ? <Loader color="blue" size={"sm"} /> : null}
    </Flex>
  );
};
