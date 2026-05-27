export interface Message {
  id: string;
  slug?: string;
  parentId?: string;
  nickname: string;
  qq?: string;
  content: string;
  email?: string;
  website?: string;
  avatar: string;
  createdAt: number;
  floor?: number;
  replies?: Message[];
  os?: string;
  browser?: string;
  device?: string;
}
