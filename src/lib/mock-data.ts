import { ArchivedMessage, AutomationRule, ContactProfile, VaultItem, NagadMfiNode, NagadPhilanthropyNode, TestLabResult, PipelineBuild, NagadBiller, NagadGlobalMtoNode } from './types';

// Use fixed ISO strings for timestamps to prevent hydration mismatch
export const MOCK_MESSAGES: ArchivedMessage[] = [
  {
    id: 'signal-mdb-1',
    sender: 'Midland Bank IT',
    content: 'Nexus Node Handshake: Authentication keys for HSM Bridge generated. Waiting for merchant signature.',
    timestamp: '2026-06-22T04:45:00.000Z',
    app: 'Signal',
    category: 'Urgent',
    priorityScore: 99,
    tags: ['MDB-CORE', 'HSM-BRIDGE'],
  },
  {
    id: '1',
    sender: 'Alex Rivera',
    content: 'Can you send the draft by tonight? It is pretty critical for the meeting.',
    timestamp: '2026-06-22T03:30:00.000Z',
    app: 'WhatsApp',
    category: 'Urgent',
    priorityScore: 92,
  },
  {
    id: '2',
    sender: 'Amazon',
    content: 'Your package has been delivered to the front door.',
    timestamp: '2026-06-22T02:15:00.000Z',
    app: 'Messenger',
    category: 'Transactional',
    priorityScore: 45,
  },
  {
    id: '3',
    sender: 'Bank of America',
    content: 'Your OTP for the transaction of $150.00 is 558921. Do not share.',
    timestamp: '2026-06-22T01:00:00.000Z',
    app: 'Signal',
    category: 'OTP',
    priorityScore: 88,
  },
  {
    id: '4',
    sender: 'Sarah Jenkins',
    content: '[Message Deleted]',
    timestamp: '2026-06-21T23:45:00.000Z',
    app: 'Telegram',
    isDeleted: true,
    priorityScore: 15,
  },
  {
    id: '5',
    sender: 'Project Alpha Team',
    content: 'Meeting rescheduled to 4 PM tomorrow. Please confirm availability.',
    timestamp: '2026-06-21T20:30:00.000Z',
    app: 'WhatsApp',
    category: 'Other',
    priorityScore: 65,
  }
];

export const MOCK_CONTACTS: ContactProfile[] = [
  { id: 'c1', name: 'Alex Rivera', interactionScore: 95, lastInteraction: '2026-06-22T14:30:00Z', priority: 'High', platforms: ['WhatsApp', 'Telegram'] },
  { id: 'c2', name: 'Sarah Jenkins', interactionScore: 78, lastInteraction: '2026-06-22T10:45:00Z', priority: 'Medium', platforms: ['Telegram', 'Signal'] },
  { id: 'c3', name: 'CryptoBase', interactionScore: 40, lastInteraction: '2026-06-21T20:00:00Z', priority: 'Low', platforms: ['Signal'] },
];

export const MOCK_VAULT: VaultItem[] = [
  { id: 'v1', type: 'OTP', title: 'Bank of America OTP', content: '558921', timestamp: '2026-06-22T11:05:00Z', platform: 'Signal' },
  { id: 'v2', type: 'Receipt', title: 'Uber Receipt', content: 'Ride to JFK: $65.40', timestamp: '2026-06-21T15:20:00Z', platform: 'WhatsApp' },
  { id: 'v3', type: 'Contract', title: 'Lease Agreement Fragment', content: 'Section 4.2: Monthly rent due on 1st', timestamp: '2026-06-20T09:00:00Z', platform: 'Messenger' },
];

export const MOCK_RULES: AutomationRule[] = [
  {
    id: 'r1',
    name: 'Auto-Reply Out of Office',
    trigger: 'urgent',
    response: 'I am currently away. If this is critical, please call.',
    isActive: true,
  },
  {
    id: 'r2',
    name: 'Invoice Tagger',
    trigger: 'invoice',
    response: 'Detected an invoice. Tagged for finance.',
    isActive: true,
    tag: 'Finance',
  }
];

export const MOCK_NAGAD_MFI_NODES: NagadMfiNode[] = [
  { organizationName: "VPKA Foundation", branchName: "Matipara", payoutType: "EMI", status: "Active" },
  { organizationName: "VPKA Foundation", branchName: "Head Office", payoutType: "Microfinance_Settlement", status: "Active" },
  { organizationName: "Uttara Development Program Society UDPS", branchName: "Nayangonj Branch", payoutType: "EMI", status: "Active" },
  { organizationName: "Uttara Development Program Society UDPS", branchName: "Gazipur Branch", payoutType: "EMI", status: "Active" },
  { organizationName: "Sangathita Gramunnayan Karmasuchi SANGRAM", branchName: "Bhola Branch", payoutType: "EMI", status: "Active" },
  { organizationName: "Sangathita Gramunnayan Karmasuchi SANGRAM", branchName: "Patuakhali Branch", payoutType: "Microfinance_Settlement", status: "Active" },
  { organizationName: "Bureau Bangladesh", branchName: "Dhaka North", payoutType: "EMI", status: "Active" },
  { organizationName: "ASA", branchName: "Comilla Zone", payoutType: "EMI", status: "Active" },
  { organizationName: "TMSS", branchName: "Bogra Core", payoutType: "Microfinance_Settlement", status: "Active" },
];

export const MOCK_NAGAD_PHILANTHROPY_NODES: NagadPhilanthropyNode[] = [
  { id: 124, organizationName: "Quantum Foundation - Cumilla Branch", category: "Foundation", status: "Active" },
  { id: 125, organizationName: "Quantum Foundation - Dhanmondi Branch", category: "Foundation", status: "Active" },
  { id: 142, organizationName: "Quantum Foundation - Lama Center", category: "Foundation", status: "Active" },
  { id: 165, organizationName: "Rogi Kolyan Somitee (Zakat Fund) Kurmitola General Hospital", category: "Zakat_Fund", status: "Active" },
  { id: 167, organizationName: "Sajida Foundation", category: "NGO", status: "Active" },
  { id: 174, organizationName: "Songjog Foundation - Medical Fund", category: "Medical_Fund", status: "Active" },
  { id: 180, organizationName: "SOS Children's Villages Bangladesh", category: "NGO", status: "Active" },
  { id: 195, organizationName: "Sadaqah Foundation", category: "Religious", status: "Active" },
];

export const NAGAD_BANK_NODES = [
  "Midland Bank", "AB Bank", "Al-Arafah Islami Bank", "Bank Asia", "Brac Bank", "City Bank", "Dhaka Bank", "Dutch-Bangla Bank", "Eastern Bank", "EXIM Bank", "First Security Islami Bank", "IFIC Bank", "Islami Bank Bangladesh", "Jamuna Bank", "Meghna Bank", "Mercantile Bank", "Modhumoti Bank", "Mutual Trust Bank", "National Bank", "NCC Bank", "NRB Bank", "NRB Commercial Bank", "One Bank", "Padma Bank", "Prime Bank", "Pubali Bank", "SBAC Bank", "Shahjalal Islami Bank", "Shimanto Bank", "Social Islami Bank", "South East Bank", "Standard Bank", "Trust Bank", "Union Bank", "United Commercial Bank", "Uttara Bank",
];

export const MOCK_NAGAD_BILLERS: NagadBiller[] = [
  { id: 'b1', name: 'DPDC (Postpaid)', code: '1001', category: 'Utility', chargeType: 'Slab', chargeValue: 5 },
  { id: 'b2', name: 'DESCO (Prepaid)', code: '1002', category: 'Utility', chargeType: 'Fixed', chargeValue: 0 },
  { id: 'b3', name: 'Titas Gas (Postpaid)', code: '1003', category: 'Utility', chargeType: 'Fixed', chargeValue: 10 },
  { id: 'b4', name: 'WASA Dhaka', code: '1004', category: 'Utility', chargeType: 'Slab', chargeValue: 2 },
  { id: 'b5', name: 'Palli Bidyut (Prepaid)', code: '1005', category: 'Utility', chargeType: 'Fixed', chargeValue: 0 },
  { id: 'e1', name: 'BL Govt High School, Sirajganj', code: '5001', category: 'Education', chargeType: 'Fixed', chargeValue: 10 },
  { id: 'e2', name: 'Collectorate School, Sirajganj', code: '5002', category: 'Education', chargeType: 'Fixed', chargeValue: 10 },
  { id: 'e3', name: 'Sirajganj Govt College', code: '5003', category: 'Education', chargeType: 'Fixed', chargeValue: 15 },
  { id: 'e4', name: 'North Bengal Medical College', code: '5004', category: 'Education', chargeType: 'Slab', chargeValue: 20 },
  { id: 'i1', name: 'Amber IT', code: '3001', category: 'Internet', chargeType: 'Fixed', chargeValue: 0 },
  { id: 'i2', name: 'Carnival Internet', code: '3002', category: 'Internet', chargeType: 'Fixed', chargeValue: 5 },
];

export const MOCK_NAGAD_MTO_NODES: NagadGlobalMtoNode[] = [
  { country: "Australia", partnerMto: "Remitly", status: "Active" },
  { country: "Austria", partnerMto: "Western Union", status: "Active" },
  { country: "Bahrain", partnerMto: "NEC Bahrain", status: "Active" },
  { country: "Belgium", partnerMto: "Ria Money Transfer", status: "Active" },
  { country: "Brunei", partnerMto: "Merchantrade", status: "Active" },
  { country: "Bulgaria", partnerMto: "MoneyGram", status: "Active" },
  { country: "Canada", partnerMto: "Placid Express", status: "Active" },
  { country: "USA", partnerMto: "ACE Money Transfer", status: "Active" },
  { country: "UK", partnerMto: "Remit Choice", status: "Active" },
  { country: "Malaysia", partnerMto: "Mycash Online", status: "Active" },
];

export const MOCK_TEST_RESULTS: TestLabResult[] = [
  {
    id: 'tr-1',
    device: 'Pixel 7 Pro',
    osVersion: 'Android 13',
    type: 'Robo',
    status: 'Passed',
    timestamp: '2026-06-22T13:00:00Z',
    duration: '4m 12s',
    screenshots: ['https://picsum.photos/seed/test1/200/400', 'https://picsum.photos/seed/test2/200/400']
  },
  {
    id: 'tr-2',
    device: 'iPhone 14 Pro',
    osVersion: 'iOS 16.2',
    type: 'Instrumentation',
    status: 'Passed',
    timestamp: '2026-06-22T12:00:00Z',
    duration: '8m 45s'
  },
  {
    id: 'tr-3',
    device: 'Galaxy S23',
    osVersion: 'Android 13',
    type: 'Robo',
    status: 'Failed',
    timestamp: '2026-06-22T11:00:00Z',
    duration: '2m 30s',
    screenshots: ['https://picsum.photos/seed/error1/200/400']
  }
];

export const MOCK_PIPELINE_BUILDS: PipelineBuild[] = [
  {
    id: 'build-442',
    branch: 'main',
    commitHash: 'c2d7a19',
    status: 'Success',
    timestamp: '2026-06-22T14:00:00Z',
    author: 'Farid Node'
  },
  {
    id: 'build-441',
    branch: 'feat/nagad-bridge',
    commitHash: 'a1b2c3d',
    status: 'Success',
    timestamp: '2026-06-22T08:00:00Z',
    author: 'Farid Node'
  },
  {
    id: 'build-440',
    branch: 'fix/hsm-handshake',
    commitHash: 'e5f6g7h',
    status: 'Failed',
    timestamp: '2026-06-21T18:00:00Z',
    author: 'Farid Node'
  }
];