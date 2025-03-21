import { GroupMemberPayload, Voucher } from "../types/GroupMemberPayload";
import { GroupMembers } from "../types/GroupMembers";

export const createPayloadForVoucherGeneration = (
  groupName: string,
  selectedMembers: GroupMembers[]
): GroupMemberPayload => {
  const convertedRows = selectedMembers.reduce((acc, curr) => {
    curr.registrations.forEach((registration) => {
      acc.push({
        first_name: curr.firstName,
        last_name: curr.lastName,
        email: curr.primaryEmail,
        type: registration.typeForVoucher,
        role: "DELEGATE",
        groupName: groupName,
        contactId: curr.id,
      });
    });
    return acc;
  }, [] as Voucher[]);
  const payload = {
    vouchers: convertedRows,
  };
  return payload;
};

export const createPayloadForAutoRedeem = (
  groupName: string,
  selectedMembers: GroupMembers[]
): GroupMemberPayload => {
  const convertedRows = selectedMembers.reduce((acc, curr) => {
    curr.registrations.forEach((registration) => {
      acc.push({
        first_name: curr.firstName,
        last_name: curr.lastName,
        email: curr.primaryEmail,
        type: registration.typeForVoucher,
        role: "DELEGATE",
        groupName: groupName,
        openID: curr.openID, // Add openID to the payload for auto-redeem. Rest is same as voucher generation
        contactId: curr.id,
      });
    });
    return acc;
  }, [] as Voucher[]);
  const payload = {
    vouchers: convertedRows,
  };
  return payload;
};
