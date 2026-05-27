import type { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";
import { addMessage, getMessages } from "@/lib/storage";
import type { Message } from "@/types/message";

// ── mail (optional) ───────────────────────────────────────────────────────────
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || "465");
const SMTP_SECURE = process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM;
const OWNER_EMAIL = process.env.MAIL_NOTIFY_TO || process.env.BLOG_OWNER_EMAIL;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) return;
  if (!isEmail(opts.to)) return;
  try {
    const nodemailer = (await import("nodemailer")).default;
    const t = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await t.sendMail({ from: MAIL_FROM, ...opts });
  } catch (e) {
    console.error("[mail]", e);
  }
}

// ── GET /api/messages?slug=xxx ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? undefined;
  const raw = await getMessages(slug);

  // Build tree: root messages sorted newest-first, replies oldest-first
  const map = new Map<string, Message>();
  for (const m of raw) {
    map.set(m.id, { ...m, replies: [] });
  }
  const roots: Message[] = [];
  for (const m of raw) {
    const node = map.get(m.id)!;
    if (m.parentId && map.has(m.parentId)) {
      map.get(m.parentId)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  }
  roots.sort((a, b) => b.createdAt - a.createdAt);
  for (const m of map.values()) {
    m.replies?.sort((a, b) => a.createdAt - b.createdAt);
  }

  return Response.json(roots);
}

// ── POST /api/messages ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nickname, qq, content, email, website, parentId, slug } = body;

    if (!nickname?.trim() || !content?.trim()) {
      return Response.json({ error: "昵称和内容不能为空" }, { status: 400 });
    }
    if (content.length > 800) {
      return Response.json({ error: "内容不能超过800字" }, { status: 400 });
    }

    const finalQQ = qq ? String(qq).trim() : undefined;
    if (finalQQ && !/^\d{5,11}$/.test(finalQQ)) {
      return Response.json({ error: "QQ号格式不正确" }, { status: 400 });
    }

    const finalEmail = email ? String(email).trim().toLowerCase() : undefined;
    if (finalEmail && !isEmail(finalEmail)) {
      return Response.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    let finalWebsite = website ? String(website).trim().slice(0, 100) : undefined;
    if (
      finalWebsite &&
      !finalWebsite.startsWith("http://") &&
      !finalWebsite.startsWith("https://")
    ) {
      finalWebsite = `https://${finalWebsite}`;
    }

    const avatar = finalQQ
      ? `https://q1.qlogo.cn/g?b=qq&nk=${finalQQ}&s=100`
      : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(nickname)}`;

    const ua = new UAParser(req.headers.get("user-agent") ?? "");
    const browser = ua.getBrowser();
    const os = ua.getOS();
    const device = ua.getDevice();

    const newMsg = await addMessage({
      nickname: String(nickname).slice(0, 30),
      qq: finalQQ,
      content: String(content).slice(0, 800),
      email: finalEmail?.slice(0, 100),
      website: finalWebsite,
      avatar,
      parentId,
      slug,
      browser: browser.name ? `${browser.name} ${browser.major ?? ""}`.trim() : undefined,
      os: os.name ? `${os.name} ${os.version ?? ""}`.trim() : undefined,
      device: device.model ? `${device.vendor ?? ""} ${device.model}`.trim() : undefined,
    });

    // ── email notifications (best-effort) ─────────────────────────────────────
    if (OWNER_EMAIL) {
      const allMsgs = await getMessages();
      const ownerEmailNorm = OWNER_EMAIL.trim().toLowerCase();
      const senderEmail = finalEmail;
      const senderIsOwner = senderEmail === ownerEmailNorm;

      if (parentId) {
        // notify the parent comment author
        const parent = allMsgs.find((m) => m.id === parentId);
        const replyTo = parent?.email?.trim().toLowerCase();
        if (parent && replyTo && replyTo !== senderEmail) {
          await sendMail({
            to: replyTo,
            subject: "你收到了一条新回复",
            text: `${parent.nickname} 你好，${newMsg.nickname} 回复了你：\n\n${newMsg.content}\n\n原留言：${parent.content}`,
            html: `<p>${esc(parent.nickname)} 你好，<strong>${esc(newMsg.nickname)}</strong> 回复了你：</p><blockquote>${esc(newMsg.content)}</blockquote><p>原留言：${esc(parent.content)}</p>`,
          });
        }
      } else if (!senderIsOwner) {
        // notify the blog owner
        await sendMail({
          to: OWNER_EMAIL,
          subject: `新留言来自 ${newMsg.nickname}`,
          text: `${newMsg.nickname} 留言：\n\n${newMsg.content}\n\n页面：${slug ?? "留言板"}`,
          html: `<p><strong>${esc(newMsg.nickname)}</strong> 留言：</p><blockquote>${esc(newMsg.content)}</blockquote><p>页面：${esc(slug ?? "留言板")}</p>`,
        });
      }
    }

    return Response.json(newMsg, { status: 201 });
  } catch (e) {
    console.error("[messages POST]", e);
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
