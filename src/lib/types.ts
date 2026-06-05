export type MessageCategory = 'Urgent' | 'Transactional' | 'OTP' | 'Other';

export interface ArchivedMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  app: 'WhatsApp' | 'Telegram' | 'Signal' | 'Viber' | 'Messenger';
  category?: MessageCategory;
  isDeleted?: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  response: string;
  isActive: boolean;
}