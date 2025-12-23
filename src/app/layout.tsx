import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="th">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
