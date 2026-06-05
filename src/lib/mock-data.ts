import { ArchivedMessage, AutomationRule } from './types';

export const MOCK_MESSAGES: ArchivedMessage[] = [
  {
    id: '1',
    sender: 'Alex Rivera',
    content: 'Can you send the draft by tonight? It is pretty critical for the meeting.',
    timestamp: '2024-06-01T14:30:00Z',
    app: 'WhatsApp',
    category: 'Urgent',
  },
  {
    id: '2',
    sender: 'Amazon',
    content: 'Your package has been delivered to the front door.',
    timestamp: '2024-06-01T12:15:00Z',
    app: 'Messenger',
    category: 'Transactional',
  },
  {
    id: '3',
    sender: 'Bank of America',
    content: 'Your OTP for the transaction of $150.00 is 558921. Do not share.',
    timestamp: '2024-06-01T11:05:00Z',
    app: 'Signal',
    category: 'OTP',
  },
  {
    id: '4',
    sender: 'Sarah Jenkins',
    content: '[Message Deleted]',
    timestamp: '2024-06-01T10:45:00Z',
    app: 'Telegram',
    isDeleted: true,
  },
  {
    id: '5',
    sender: 'Project Alpha Team',
    content: 'Meeting rescheduled to 4 PM tomorrow. Please confirm availability.',
    timestamp: '2024-05-31T18:20:00Z',
    app: 'WhatsApp',
    category: 'Other',
  }
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
    name: 'OTP Forwarding',
    trigger: 'verification code',
    response: 'Detected a sensitive security code.',
    isActive: false,
  }
];