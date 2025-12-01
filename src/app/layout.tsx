import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FirebaseProvider } from "@/firebase";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}
