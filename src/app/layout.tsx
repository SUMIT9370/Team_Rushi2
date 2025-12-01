import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MITRAM",
  description: "Your Digital Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
