"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="NinerWatch Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold">NinerWatch</h1>
            </div>
          </Link>
          <nav className="ml-3 hidden md:flex gap-6">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "text-foreground transition ease-in-out duration-300 tracking-tight"
                  : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
              }
            >
              Dashboard
            </Link>
            <Link
              href="/incidents"
              className={
                pathname === "/incidents"
                  ? "text-foreground transition ease-in-out duration-300 tracking-tight"
                  : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
              }
            >
              Incidents
            </Link>
            <Link
              href="/statistics"
              className={
                pathname === "/statistics"
                  ? "text-foreground transition ease-in-out duration-300 tracking-tight"
                  : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
              }
            >
              Statistics
            </Link>
            <div className="border-l border-border h-6" />
            <Link
              href="/terms"
              className={
                pathname === "/terms"
                  ? "text-foreground transition ease-in-out duration-300 tracking-tight"
                  : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
              }
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className={
                pathname === "/privacy"
                  ? "text-foreground transition ease-in-out duration-300 tracking-tight"
                  : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
              }
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
