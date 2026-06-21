import { ArchivedMessage, AutomationRule, ContactProfile, VaultItem } from './types';

export const MOCK_MESSAGES: ArchivedMessage[] = [
  {
    id: 'signal-mdb-1',
    sender: 'Midland Bank IT',
    content: 'Nexus Node Handshake: Authentication keys for HSM Bridge generated. Waiting for merchant signature.',
    timestamp: new Date().toISOString(),
    app: 'Signal',
    category: 'Urgent',
    priorityScore: 99,
    tags: ['MDB-CORE', 'HSM-BRIDGE'],
  },
  {
    id: '1',
    sender: 'Alex Rivera',
    content: 'Can you send the draft by tonight? It is pretty critical for the meeting.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    app: 'WhatsApp',
    category: 'Urgent',
    priorityScore: 92,
  },
  {
    id: '2',
    sender: 'Amazon',
    content: 'Your package has been delivered to the front door.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    app: 'Messenger',
    category: 'Transactional',
    priorityScore: 45,
  },
  {
    id: '3',
    sender: 'Bank of America',
    content: 'Your OTP for the transaction of $150.00 is 558921. Do not share.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    app: 'Signal',
    category: 'OTP',
    priorityScore: 88,
  },
  {
    id: '4',
    sender: 'Sarah Jenkins',
    content: '[Message Deleted]',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    app: 'Telegram',
    isDeleted: true,
    priorityScore: 15,
  },
  {
    id: '5',
    sender: 'Project Alpha Team',
    content: 'Meeting rescheduled to 4 PM tomorrow. Please confirm availability.',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    app: 'WhatsApp',
    category: 'Other',
    priorityScore: 65,
  }
];

export const MOCK_CONTACTS: ContactProfile[] = [
  { id: 'c1', name: 'Alex Rivera', interactionScore: 95, lastInteraction: '2024-06-01T14:30:00Z', priority: 'High', platforms: ['WhatsApp', 'Telegram'] },
  { id: 'c2', name: 'Sarah Jenkins', interactionScore: 78, lastInteraction: '2024-06-01T10:45:00Z', priority: 'Medium', platforms: ['Telegram', 'Signal'] },
  { id: 'c3', name: 'CryptoBase', interactionScore: 40, lastInteraction: '2024-05-31T20:00:00Z', priority: 'Low', platforms: ['Signal'] },
];

export const MOCK_VAULT: VaultItem[] = [
  { id: 'v1', type: 'OTP', title: 'Bank of America OTP', content: '558921', timestamp: '2024-06-01T11:05:00Z', platform: 'Signal' },
  { id: 'v2', type: 'Receipt', title: 'Uber Receipt', content: 'Ride to JFK: $65.40', timestamp: '2024-05-31T15:20:00Z', platform: 'WhatsApp' },
  { id: 'v3', type: 'Contract', title: 'Lease Agreement Fragment', content: 'Section 4.2: Monthly rent due on 1st', timestamp: '2024-05-30T09:00:00Z', platform: 'Messenger' },
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
