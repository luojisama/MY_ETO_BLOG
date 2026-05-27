import type { FriendLink } from "@/types/friend";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, OWNER_AVATAR } from "./site";

/** 自己的卡片 — 字段从 site.ts 自动取，无需重复填写 */
export const myFriendLink: FriendLink = {
  title: SITE_TITLE,
  imgurl: OWNER_AVATAR,
  desc: SITE_DESCRIPTION,
  siteurl: SITE_URL,
  isSelf: true,
};

/**
 * 友链列表。
 * 每项必填：title / imgurl / desc / siteurl
 * rssurl 填写后会自动拉取友圈动态
 */
export const friendLinks: FriendLink[] = [
  {
    title: "Astro",
    imgurl: "https://avatars.githubusercontent.com/u/44914786?s=48&v=4",
    desc: "The web framework for content-driven websites. Star to support our work!",
    siteurl: "https://github.com/withastro/astro",
  },
  {
    title: "时歌的博客",
    imgurl: "https://www.lapis.cafe/avatar.webp",
    desc: "理解以真实为本，但真实本身并不会自动呈现",
    siteurl: "https://www.lapis.cafe",
    rssurl: "https://www.lapis.cafe/rss.xml",
  },
  {
    title: "Zellon的博客",
    imgurl: "https://www.zellon.top/avatar.jpg",
    desc: "告别过去，是为了走向未来",
    siteurl: "https://www.zellon.top",
    rssurl: "https://www.zellon.top/rss.xml",
  },
  {
    title: "mikann_OWQ",
    imgurl: "https://mikann.fun/avatar.webp",
    desc: "是一位超级无敌可爱美少女",
    siteurl: "https://www.mikann.fun",
    rssurl: "https://www.mikann.fun/rss.xml",
  },
  {
    title: "Viki 写东西的地方",
    imgurl: "https://blog.viki.moe/avatar.png",
    desc: "生活需要记录。",
    siteurl: "https://blog.viki.moe",
    rssurl: "https://blog.viki.moe/rss",
  },
];

export const allFriendLinks: FriendLink[] = [myFriendLink, ...friendLinks];
export const SELF_SITE_URL = SITE_URL;
