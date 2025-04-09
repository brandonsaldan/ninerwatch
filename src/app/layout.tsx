import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IncidentsProvider } from "@/context/incidents-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NinerWatch - UNC Charlotte Campus Safety",
  description:
    "Real-time crime and accident monitoring for UNC Charlotte campus",
  keywords: [
    "UNC Charlotte",
    "UNC Charlotte crime",
    "University of North Carolina at Charlotte crime",
    "UNC Charlotte safety",
    "UNC Charlotte incidents",
    "UNC Charlotte news",
    "UNC Charlotte alerts",
    "UNC Charlotte police",
    "UNC Charlotte security",
    "UNC Charlotte emergency",
    "UNC Charlotte campus safety",
    "UNC Charlotte crime reports",
    "UNC Charlotte crime statistics",
    "UNC Charlotte crime map",
    "UNC Charlotte crime news",
  ],
  openGraph: {
    title: "NinerWatch - UNC Charlotte Campus Safety",
    description:
      "Track, monitor, and discuss campus safety incidents in real-time",
    url: "https://ninerwatch.vercel.app",
    siteName: "NinerWatch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NinerWatch - UNC Charlotte Campus Safety",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NinerWatch - UNC Charlotte Campus Safety",
    description: "Stay informed about safety incidents at UNC Charlotte",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  creator: "NinerWatch Team",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IncidentsProvider>{children}</IncidentsProvider>
      </body>
    </html>
  );
}
