const baseUrl = import.meta.env.VITE_BASE_URL;

export const groupMembersUrl = `${baseUrl}/api/v1/groups`;

export const groupmMembersById = (contactId: string) =>
  `${baseUrl}/api/v1/groups/${contactId}`;

export const voucherGenerate = (groupId: string) =>
  `${baseUrl}/api/v1/groups/generate-vouchers/${groupId}`;

export const statusGenerate = (groupId: string) =>
  `${baseUrl}/api/v1/groups/generate-vouchers/status/${groupId}`;

export const GenerateAutoReedem = (groupId: string) =>
  `${baseUrl}/api/v1/groups/generate-vouchers/${groupId}/auto-redeem`;
