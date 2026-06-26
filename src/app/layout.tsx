import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leads — B&F Intelligence",
  description: "Internal Sales Operating System",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" class="dark bg-neutral-950 antialiased selection:bg-blue-500/30">
      <body class="min-h-screen text-neutral-100 font-sans pb-12">{children}</body>
    </html>
  );
}
