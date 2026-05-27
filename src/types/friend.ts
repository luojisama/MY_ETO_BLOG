export interface FriendLink {
  title: string;
  imgurl: string;
  desc: string;
  siteurl: string;
  tags?: string[];
  rssurl?: string;
  isSelf?: boolean;
}

export interface FriendCircleItem {
  title: string;
  link: string;
  published: string;
  description: string;
  siteTitle: string;
  siteurl: string;
  avatar: string;
}
