// import { Modal, Box, Button } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { IconArrowRight } from "@tabler/icons-react";
// import { useState } from "react";
// import { GroupMembers } from "../types/GroupMembers";

// type Props = {
//   GenerateMoadal: (id: string) => void;
// };
// export const VoucherGeneration = ({ GenerateModal }: Props) => {
//   const [opened, { open, close }] = useDisclosure(false);
//   const [selectedRowData, setSelectedRowData] = useState<GroupMembers[]>([]);
//   const [isChecked, setIsChecked] = useState(false);
//   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setIsChecked(event.target.checked);
//   };
//   return (
//     <>
//       <Modal
//         opened={opened}
//         title="Selected Row Details"
//         onClose={close}
//         centered
//       >
//         {selectedRowData.length > 0 ? (
//           <Box>
//             {selectedRowData.map((row) => (
//               <Box key={row.id} mb="sm">
//                 {!row.activationCodeFormatted ? (
//                   <>
//                     <p>
//                       <strong>ID:</strong> {row.id}
//                     </p>
//                     <p>
//                       <strong>Firstname:</strong> {row.firstName}
//                     </p>
//                     <p>
//                       <strong>Lastname:</strong> {row.lastName}
//                     </p>
//                     <p>
//                       <strong>Type:</strong> {row.typeForVoucher}
//                     </p>
//                     <p>
//                       <strong>OpenID:</strong>{" "}
//                       {row.openID ? row.openID : "No value"}
//                     </p>
//                     <p>
//                       <strong>Autoreedem:</strong>{" "}
//                       {isChecked ? "checked" : "not checked"}
//                     </p>
//                     <hr />{" "}
//                   </>
//                 ) : null}
//               </Box>
//             ))}
//           </Box>
//         ) : (
//           <p>No rows selected</p>
//         )}
//       </Modal>
//       <Button
//         justify="center"
//         rightSection={<IconArrowRight size={14} />}
//         disabled={selectedRowIds.length === 0}
//         onClick={open}
//       >
//         Generate
//       </Button>
//     </>
//   );
// };

type Props = {
  GenerateModal: (id: string) => void;
};
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

export const VoucherGeneration = ({ GenerateModal }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        title="Selected Row Details"
        onClose={close}
        centered
      >
        {RowData.length > 0 ? (
          <Box>
            {RowData.map((row) => (
              <Box key={row.id} mb="sm">
                {!row.activationCodeFormatted ? (
                  <>
                    <p>
                      <strong>GroupId:</strong>
                      {groupId}
                    </p>
                    <p>
                      <strong>GroupName:</strong>
                      {groupName}
                    </p>
                    <p>
                      <strong>ID:</strong> {row.id}
                    </p>
                    <p>
                      <strong>Firstname:</strong> {row.firstName}
                    </p>
                    <p>
                      <strong>Lastname:</strong> {row.lastName}
                    </p>
                    <p>
                      <strong>Type:</strong> {row.typeForVoucher}
                    </p>
                    <p>
                      <strong>OpenID:</strong>{" "}
                      {row.openID ? row.openID : "No value"}
                    </p>
                    <p>
                      <strong>Autoreedem:</strong>{" "}
                      {isChecked ? "checked" : "not checked"}
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

      <Button variant="default" onClick={open}>
        Open modal
      </Button>
    </>
  );
};
