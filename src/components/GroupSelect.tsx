import { Flex, Select, Loader } from "@mantine/core";
import React from "react";
import { Group } from "../types/Group";
import { useAuthHeader } from "../hooks.tsx/useIsAuthenticated";

type Props = {
  onGroupSelect: (id: string, name: string) => void;
};

export const GroupSelect = ({ onGroupSelect }: Props) => {
  const [isGroupLoading, setIsGroupLoading] = React.useState<boolean>(false);
  const [groups, setGroups] = React.useState<Group[]>([]);

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

  const sortedData = groups.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <Flex align={"center"} gap={"md"} w="100%">
      <Select
        searchable
        w={"20vw"}
        bg={"white"}
        placeholder="Select a group"
        data={sortedData.map((comment) => {
          return {
            value: String(comment.contactId),
            label: comment.name ? comment.name.toLowerCase() : "No Name",
            key: String(comment.contactId),
          };
        })}
        // onChange={(id,name) => {
        //   if (id) {
        //     onGroupSelect(id,name);
        //   }
        // }}
        onChange={(value) => {
          const selectedGroup = groups.find(
            (group) => String(group.contactId) === value
          );
          if (selectedGroup) {
            onGroupSelect(selectedGroup.contactId, selectedGroup.name);
          }
        }}
      />
      {isGroupLoading ? <Loader color="blue" size={"sm"} /> : null}
    </Flex>
  );
};
