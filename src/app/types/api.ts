export enum OtpMessageType {
  OtpLoginType = "OtpLoginType",
  OtpSignUpType = "OtpSignUpType",
  OtpPasswordReset = "OtpPasswordReset",
}

export enum GroupType {
  MERRRY_GO_AROUND = "MERRRY_GO_AROUND",
  SACCO = "SACCO",
  SAVING = "SAVING",
  TABLE_BANKING = "TABLE_BANKING",
  OTHERS = "OTHERS",
}

export enum PaymentMethod {
  CASH = "CASH",
  MPESA = "MPESA",
  BANK_TRANSFER = "BANK_TRANSFER",
  CARD = "CARD",
  CRYPTO = "CRYPTO",
}

export enum PolicyType {
  LOAN = "LOAN",
  CONTRIBUTION = "CONTRIBUTION",
  FINE = "FINE",
  DIVIDEND = "DIVIDEND",
  MEMBER = "MEMBER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TransactionType {
  LOAN = "LOAN",
  REPAYMENT = "REPAYMENT",
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  FINE = "FINE",
  CONTRIBUTION = "CONTRIBUTION",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  PARTIAL = "PARTIAL",
  CANCELED = "CANCELED",
  REJECTED = "REJECTED",
}

export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  GROUP = "GROUP",
  PAYMENT = "PAYMENT",
  LOAN = "LOAN",
  OTP = "OTP",
  SYSTEM = "SYSTEM",
  FINE = "FINE",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
}

export enum Environment {
  sandbox = "sandbox",
  production = "production",
}

export enum ContributionFrequency {
  ONCE = "ONCE",
  TWICE = "TWICE",
  FOUR_TIMES = "FOUR_TIMES",
}

export enum FineType {
  LATE_PAYMENT = "LATE_PAYMENT",
  MISSED_MEETING = "MISSED_MEETING",
  LATE_ARRIVAL = "LATE_ARRIVAL",
  OTHER = "OTHER",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  profilePicture?: string;
  address?: string;
  city?: string;
  country?: string;
  nationalId?: string;
  roleId?: string;
  isActive?: boolean;
  isVerified?: boolean;
  role?: Role;
  otpMessages: OtpMessage[];
  groupMembers: GroupMember[];
  transactions: Transaction[];
  guarantors: Guarantor[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
  notifications: Notification[];
}

export interface Role {
  id: string;
  name: string;
  users: User[];
  permissions: Permission[];
  groupMembers: GroupMember[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  roleId?: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  type?: GroupType;
  policies?: any;
  createdById: string;
  members: GroupMember[];
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
  groupSettings: GroupSettings[];
  meetingDay: string;
  meetingTime: string;
  contributionFrequency: ContributionFrequency;
  finePercentageOfContribution: number;
  settings:{}
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  roleId: string;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
  role: Role;
  user: User;
  group: Group;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  fineDelayPercentageIncrement: number; // 1% daily
  loanFee: number; // 1.5%
  withDrawalFee: number; // 1.5%

  // Mpesa C2B
  mpesaC2bConsumerKey?: string;
  mpesaC2bConsumerSecret?: string;
  mpesaC2bEnvironment: Environment;
  mpesaC2bShortCode?: string;
  mpesaC2bLipaNaMpesaShortPass?: string;
  mpesaC2bInitiatorName?: string;
  mpesaC2bCallbackUrl?: string;
  mpesaC2bConfirmationUrl?: string;
  mpesaC2bValidationUrl?: string;

  // Mpesa B2C
  mpesaB2cConsumerKey?: string;
  mpesaB2cConsumerSecret?: string;
  mpesaB2cEnvironment: Environment;
  mpesaB2cShortCode?: string;
  mpesaB2cLipaNaMpesaShortPass?: string;
  mpesaB2cInitiatorName?: string;
  mpesaB2cCallbackUrl?: string;
  mpesaB2cConfirmationUrl?: string;
  mpesaB2cValidationUrl?: string;

  // Mpesa B2B
  mpesaB2bConsumerKey?: string;
  mpesaB2bConsumerSecret?: string;
  mpesaB2bEnvironment: Environment;
  mpesaB2bShortCode?: string;
  mpesaB2bInitiatorName?: string;
  mpesaB2bCallbackUrl?: string;
  mpesaB2bConfirmationUrl?: string;
  mpesaB2bValidationUrl?: string;

  createdAt: string;
  updatedAt: string;
}

export interface GroupSettings {
  id: string;
  groupId: string;
  group: Group;
  mpesaC2bConsumerKey?: string;
  mpesaC2bConsumerSecret?: string;
  mpesaC2bEnvironment?: Environment;
  mpesaC2bShortCode?: string;
  mpesaC2bLipaNaMpesaShortPass?: string;
  mpesaC2bInitiatorName?: string;
  mpesaC2bCallbackUrl?: string;
  mpesaC2bConfirmationUrl?: string;
  mpesaC2bValidationUrl?: string;
  mpesaB2cConsumerKey?: string;
  mpesaB2cConsumerSecret?: string;
  mpesaB2cEnvironment?: Environment;
  mpesaB2cShortCode?: string;
  mpesaB2cLipaNaMpesaShortPass?: string;
  mpesaB2cInitiatorName?: string;
  mpesaB2cCallbackUrl?: string;
  mpesaB2cConfirmationUrl?: string;
  mpesaB2cValidationUrl?: string;
}

export interface OtpMessage {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  groupId?: string;
  userId?: string;
  amount: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  description?: string;
  dueDate?: string;
  paidOn?: string;
  isPartial: boolean;
  cryptoWallet?: string;
  cryptoTransactionId?: string;
  mpesaPhone?: string;
  mpesaTransactionId?: string;
  mpesaCheckOutId?: string;
  payments: Payment[];
  group?: Group;
  user?: User;
  createdAt: string;
  updatedAt: string;
  guarantor: Guarantor[];
  guarantors?: Array<{
    userId: string;
    approved: boolean;
  }>;
  treasurerApproved?: boolean;
  treasurerApproval?: boolean;
  secretaryApproved?: boolean;
  secretaryApproval?: boolean;
  chairpersonApproved?: boolean;
  chairpersonApproval?: boolean;  createdByTreasurer?: boolean;
  isManualEntry?: boolean;        // Flag specifically for manual entries
  requiresApproval?: boolean;     // General flag for transactions that need approval workflow
  createdBy?: string;             // User ID of who created the transaction
  rejectionReason?: string;       // Reason if transaction was rejected
}

export interface Guarantor {
  id: string;
  userId: string;
  guarantorId: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  transactionId: string;
  paidOn: string;
  method: PaymentMethod;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  groupId?: string;
  status: NotificationStatus;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data?: {
    loanId?: string;
    requiresAction?: boolean;
    role?: string;
    amount?: number;
  };
}

export interface GroupPolicy {
  id: string;
  groupId: string;
  group: Group;
  name: string;
  description: string;
  type: PolicyType;
  content: object;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationMessage {
  id: string;
  subject: string;
  message: string;
  recipientGroup: string;
  sentBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationMessageResponse {
  messages: CommunicationMessage[];
  total: number;
  page: number;
  limit: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: "IN_PROGRESS" | "ACHIEVED" | "FAILED" | "PENDING_APPROVAL" | "REJECTED";
  description?: string;
  createdBy?: string;
  createdByTreasurer?: boolean;
  requiresApproval?: boolean;
  treasurerApproved?: boolean;
  secretaryApproved?: boolean;
  chairpersonApproved?: boolean;
  rejectionReason?: string;
}

export interface FineRule {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  amount: number;
  percentage?: number;
  type: FineType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
