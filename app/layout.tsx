import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redefine",
  description: "Every minute on social media costs real money.",
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
