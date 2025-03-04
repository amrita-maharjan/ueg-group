import { Flex, Select, Loader } from "@mantine/core";
import React from "react";
import { Group } from "../types/Group";
import { useAuthHeader } from "../hooks.tsx/useAuthHeader";

type Props = {
  onGroupSelect: (id: string) => void;
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

  return (
    <Flex align={"center"} gap={"md"} w="100%">
      <Select
        w={"20vw"}
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
            onGroupSelect(id);
          }
        }}
      />
      {isGroupLoading ? <Loader color="blue" size={"sm"} /> : null}
    </Flex>
  );
};
