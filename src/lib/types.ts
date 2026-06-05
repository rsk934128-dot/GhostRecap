export type MessageCategory = 'Urgent' | 'Transactional' | 'OTP' | 'Other' | 'Spam';

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
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  response: string;
  isActive: boolean;
}