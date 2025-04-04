import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="NinerWatch Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">NinerWatch</h1>
          </div>
          <nav className="ml-3 hidden md:flex gap-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary/80 transition ease-in-out duration-300 tracking-tight"
            >
              Dashboard
            </Link>
            <Link
              href="/incidents"
              className="text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
            >
              Incidents
            </Link>
            <Link
              href="/statistics"
              className="text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
            >
              Statistics
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition ease-in-out duration-300"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
