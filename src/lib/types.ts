export type MessageCategory = 'Urgent' | 'Transactional' | 'OTP' | 'Other' | 'Spam' | 'MDB-Signal';

export interface ArchivedMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  app: 'WhatsApp' | 'Telegram' | 'Signal' | 'Viber' | 'Messenger';
  category?: MessageCategory;
  isDeleted?: boolean;
  priorityScore?: number; // 0-100
  isSpam?: boolean;
  tags?: string[];
  opportunityScore?: number; // 0-100
  decisionPending?: boolean;
}

export interface ContactProfile {
  id: string;
  name: string;
  interactionScore: number; // 0-100
  lastInteraction: string;
  priority: 'High' | 'Medium' | 'Low';
  platforms: string[];
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  response: string;
  isActive: boolean;
  tag?: string;
}

export interface VaultItem {
  id: string;
  type: 'OTP' | 'Receipt' | 'Contract' | 'Document';
  title: string;
  content: string;
  timestamp: string;
  platform: string;
}

export interface AIAction {
  type: 'reply' | 'reminder' | 'task' | 'escalate';
  label: string;
  description: string;
}

// --- Nexus Core Types ---

export interface MerchantProfile {
  id?: string;
  businessName: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  merchantId: string;
  createdAt: string;
}

export interface Transaction {
  id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'flagged';
  merchantId: string;
  timestamp: string;
  description: string;
  type: 'payment' | 'refund' | 'payout';
  checksum?: string;
  metadata?: Record<string, any>;
}

export interface VisaCompliance {
  id?: string;
  merchantId: string;
  score: number;
  status: 'valid' | 'expired' | 'needs_review';
  lastReviewed: string;
  documentUrl: string;
}

export interface GlobalBridgeStatus {
  provider: 'Google Pay' | 'Apple Pay' | 'Visa' | 'Mastercard';
  status: 'connected' | 'pending' | 'failed' | 'limited';
  latency: number;
  lastSync: string;
}

export interface LiquidityNode {
  id: string;
  name: string;
  balance: number;
  currency: string;
  health: number; // 0-100
  status: 'online' | 'rebalancing' | 'offline';
  type: 'bank' | 'gateway' | 'global' | 'core' | 'nagad';
}

// --- Midland Payout Types ---

export interface MDBPayoutPayload {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  routingNumber: string;
  amount: number;
  currency: string;
  narration: string;
  checksum: string;
}

export interface MDBPayoutResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: string;
}

// --- Nagad Payout Types ---

export interface NagadPayoutPayload {
  merchantId: string;
  orderId: string;
  customerMsisdn: string;
  amount: number;
  currency: "BDT";
  challenge: string;
  signature: string;
  metadata?: {
    mfiOrg?: string;
    mfiBranch?: string;
    payoutType?: string;
    philanthropyOrg?: string;
    donationCategory?: string;
  };
}

export interface NagadPayoutResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: string;
}

export interface NagadMfiNode {
  organizationName: string;
  branchName: string;
  payoutType: 'EMI' | 'Microfinance_Settlement';
  status: 'Active' | 'Standby';
}

export interface NagadPhilanthropyNode {
  id: number;
  organizationName: string;
  category: 'Foundation' | 'Zakat_Fund' | 'Medical_Fund' | 'NGO' | 'Religious';
  status: 'Active' | 'Standby';
}

// --- Nagad Merchant Pay Types ---

export interface NagadMerchantPayPayload {
  merchantAccountNumber: string;
  amount: number;
  counterNumber?: string;
  reference?: string;
  pinSecureToken: string;
  channel: 'USSD' | 'APP_QR' | 'GATEWAY_API';
}

export interface NagadMerchantPayResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// --- Nagad Bill Pay Types ---

export interface NagadBiller {
  id: string;
  name: string;
  code: string;
  category: 'Utility' | 'Education' | 'Internet' | 'Other';
  chargeType: 'Fixed' | 'Slab';
  chargeValue: number; // For fixed or base slab
}

export interface NagadBillPayPayload {
  billerCode: string;
  accountNo: string;
  amount: number;
  contactNo: string;
  pinToken: string;
  metadata?: Record<string, any>;
}

export interface NagadBillPayResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  charge: number;
  totalAmount: number;
  timestamp: string;
}

// --- Global Remittance Types ---

export interface NagadGlobalMtoNode {
  country: string;
  partnerMto: string;
  status: 'Active' | 'Standby';
}

export interface InboundRemittancePayload {
  remitterName: string;
  beneficiaryNagadNumber: string;
  sourceCountry: string;
  mtoProvider: string;
  principalAmountBDT: number;
  referenceNumber: string; // MTCN বা গেটওয়ে ট্র্যাকিং আইডি
}

export interface RemittanceDisbursementResult {
  txId: string;
  principalAmount: number;
  governmentIncentive: number; // ২.৫% প্রণোদনা
  totalCreditedAmount: number; // সর্বমোট ক্রেডিট ব্যালেন্স
  notificationPayload: string; // "১টি সিঙ্গেল SMS" ফরম্যাট
  status: 'Settled' | 'Failed';
  message: string;
}

export interface StressTestResult {
  timestamp: string;
  throughput: number; // tx/sec
  successRate: number; // %
  avgLatency: number; // ms
  bottlenecks: string[];
}

export interface TopographyConnection {
  from: string;
  to: string;
  status: 'active' | 'syncing' | 'idle';
  load: number; // 0-100
}

export interface SystemLog {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  module: string;
}

// --- Testing & CI/CD Types ---

export interface TestLabResult {
  id: string;
  device: string;
  osVersion: string;
  type: 'Robo' | 'Instrumentation' | 'GameLoop';
  status: 'Passed' | 'Failed' | 'In Progress';
  timestamp: string;
  duration: string;
  screenshots?: string[];
  logsUrl?: string;
}

export interface PipelineBuild {
  id: string;
  branch: string;
  commitHash: string;
  status: 'Success' | 'Failed' | 'Building';
  timestamp: string;
  author: string;
}
