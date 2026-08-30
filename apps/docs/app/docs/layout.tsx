import Link from "next/link";
import { BookOpen, ShieldAlert, Sliders, Server, ArrowLeft, Workflow, Layers } from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Introduction", href: "/docs", icon: BookOpen },
    { label: "Harvester Pipeline", href: "/docs/harvester-pipeline", icon: Workflow },
    { label: "Registry Compilation", href: "/docs/registry-compilation", icon: Layers },
    { label: "Anti-Slop Rules", href: "/docs/anti-slop-rules", icon: ShieldAlert },
    { label: "Taste-Dial Matrix", href: "/docs/taste-dials", icon: Sliders },
    { label: "MCP Setup", href: "/docs/mcp-setup", icon: Server },
    { label: "Agent Ecosystem", href: "/docs/agent-ecosystem", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Showcase</span>
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-sm font-bold tracking-tight">Documentation</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/llms.txt"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              /llms.txt
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="sticky top-20 space-y-1">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Navigation
              </span>
              <nav className="mt-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="md:col-span-9 max-w-3xl prose dark:prose-invert">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
