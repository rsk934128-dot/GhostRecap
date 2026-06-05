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
