// src/app/layout.tsx
import RootClientShell from "@/components/RootClientShell";
import "./globals.css";

export const metadata = {
  title: "Football League",
  description: "Management UI for the football league",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/5starslogo.svg" type="image/svg+xml" />
      </head>
      <body>
        {/* RootClientShell is a client component that provides Header, Sidebar and AuthProvider */}
        <RootClientShell>{children}</RootClientShell>
      </body>
    </html>
  );
}
