import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QuickKart Admin Panel",
    template: "%s | QuickKart Admin",
  },
  description:
    "QuickKart Admin Dashboard to manage products, orders, customers, inventory, and analytics efficiently.",
  keywords: [
    "QuickKart",
    "eCommerce Admin Panel",
    "Admin Dashboard",
    "Order Management",
    "Product Management",
    "Inventory System",
  ],
  authors: [{ name: "QuickKart Team" }],

  // 🔒 Prevent admin panel from showing in Google
  robots: {
    index: false,
    follow: false,
  },

  // Optional but good for branding
  applicationName: "QuickKart Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}