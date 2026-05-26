import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ring Designer",
  description: "Design a custom ring with geographic map engraving",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 font-sans">
        <header className="h-[60px] flex items-center px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shrink-0">
          <Link href="/design" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white tracking-tight">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="3" x2="12" y2="8" />
              <line x1="12" y1="16" x2="12" y2="21" />
              <line x1="3" y1="12" x2="8" y2="12" />
              <line x1="16" y1="12" x2="21" y2="12" />
            </svg>
            Ring Designer
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
