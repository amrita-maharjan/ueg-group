import { GroupMemberPayload, Voucher } from "../types/GroupMemberPayload";
import { GroupMembers } from "../types/GroupMembers";

export const createPayload = (
  groupName: string,
  selectedRows: GroupMembers[]
): GroupMemberPayload => {
  const convertedRows = selectedRows.map<Voucher>((selectedRow) => {
    return {
      first_name: selectedRow.firstName,
      last_name: selectedRow.lastName,
      email: selectedRow.primaryEmail,
      type: selectedRow.typeForVoucher,
      role: "DELEGATE",
      groupName: groupName,
      openID: selectedRow.openID,
      contactId: selectedRow.id,
    };
  });
  const payload = {
    vouchers: convertedRows,
  };
  return payload;
};
