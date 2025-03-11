import { GroupMemberPayload, Voucher } from "../types/GroupMemberPayload";
import { GroupMembers } from "../types/GroupMembers";

export const createPayloadForVoucherGeneration = (
  groupName: string,
  selectedMembers: GroupMembers[]
): GroupMemberPayload => {
  const convertedRows = selectedMembers
    .filter((member) => !member.openID)
    .map<Voucher>((selectedRow) => {
      return {
        first_name: selectedRow.firstName,
        last_name: selectedRow.lastName,
        email: selectedRow.primaryEmail,
        type: selectedRow.typeForVoucher,
        role: "DELEGATE",
        groupName: groupName,
        contactId: selectedRow.id,
      };
    });
  const payload = {
    vouchers: convertedRows,
  };
  return payload;
};

export const createPayloadForAutoRedeem = (
  groupName: string,
  selectedMembers: GroupMembers[]
): GroupMemberPayload => {
  const convertedRows = selectedMembers
    .filter((member) => member.openID)
    .map<Voucher>((selectedRow) => {
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
