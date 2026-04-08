import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteFoundry — Business Site Generator",
  description: "Create professional business websites in minutes with SiteFoundry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
