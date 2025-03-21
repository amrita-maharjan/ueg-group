export type GroupMembers = {
  id: string;
  internalNumber: number;
  firstName: string;
  lastName: string;
  activationCodeFormatted: string;
  typeForVoucher: number;
  openID: string;
  primaryEmail: string;
  paymentStatus: string;
  remarks: string[];
  registrations: Array<{
    uniqueCode: string;
    paymentStatus: string;
    typeForVoucher: number;
  }>;
};
