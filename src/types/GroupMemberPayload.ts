export interface GroupMemberPayload {
  vouchers: Voucher[];
}

export interface Voucher {
  first_name: string;
  last_name: string;
  email: string;
  type: number;
  role: string;
  groupName: string;
  openID: string;
  contactId: string;
}
