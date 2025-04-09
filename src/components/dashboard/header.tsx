"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub } from "react-icons/si";

export default function Header() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    pathname === path
      ? "text-foreground transition ease-in-out duration-300 tracking-tight"
      : "text-muted-foreground hover:text-foreground transition ease-in-out duration-300";

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
            <Link href="/" className={linkStyle("/")}>
              Dashboard
            </Link>
            <Link href="/incidents" className={linkStyle("/incidents")}>
              Incidents
            </Link>
            <Link href="/statistics" className={linkStyle("/statistics")}>
              Statistics
            </Link>
            <div className="border-l border-border h-6" />
            <Link href="/terms" className={linkStyle("/terms")}>
              Terms of Service
            </Link>
            <Link href="/privacy" className={linkStyle("/privacy")}>
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* Source link positioned on the right */}
        <div className="hidden md:block">
          <Link
            href="https://github.com/brandonsaldan/ninerwatch"
            className={linkStyle("https://github.com/brandonsaldan/ninerwatch")}
          >
            <div className="flex items-center gap-1.5">
              <SiGithub className="h-5 w-5" />
              <span>Source</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
