import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "katex/dist/katex.min.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/config/site";

const bebasNeue = localFont({
  src: "../fonts/BebasNeue-Regular.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

// Syne: geometric, architectural — replaces Space Grotesk for a sharper ETO feel
const syne = localFont({
  src: "../fonts/Syne-Variable.woff2",
  variable: "--font-heading",
  display: "swap",
  weight: "400 800",
});

const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${bebasNeue.variable} ${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="min-h-screen flex flex-col"
        style={{
          fontFamily:
            "var(--font-body), -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
          fontSize: "16px",
          lineHeight: "1.75",
        }}
      >
        <StarField />
        <NavBar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
