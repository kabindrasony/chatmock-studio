
export type Platform = 'Tinder' | 'WhatsApp' | 'iMessage' | 'Instagram' | 'Messenger';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Profile {
  name: string;
  avatar: string;
  subtext?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'sender' | 'receiver';
  timestamp: string;
  status?: MessageStatus;
}

export interface AppState {
  sender: Profile;
  receiver: Profile;
  platform: Platform;
  script: string;
  messages: Message[];
}
