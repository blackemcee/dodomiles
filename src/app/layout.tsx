import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dodomiles.com"),
  title: {
    default: "DodoMiles — Trail running trips",
    template: "%s — DodoMiles",
  },
  description:
    "Small-group trail running trips in the mountains. Self-paced running, all logistics handled.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
