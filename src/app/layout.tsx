import type { Metadata } from "next";
import "./globals.css";
import { Prompt } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "SupplementShop - อาหารเสริมคุณภาพ",
  description: "ร้านขายอาหารเสริม วิตามิน โปรตีน ลดน้ำหนัก บำรุงผิว คุณภาพพรีเมียม",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={prompt.className}>
      <body className="min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

