import fs from "fs";
import path from "path";

// Reads the compiled registry.json if on Node.js and caches it, or provides a static snapshot for Cloudflare Worker edge runtimes
let cachedSnapshot: any[] | null = null;

export function loadCatalogSnapshot(): any[] {
  if (cachedSnapshot) return cachedSnapshot;

  const possiblePaths = [
    path.resolve(__dirname, "../../../apps/docs/public/r/registry.json"),
    path.resolve(__dirname, "../../registry/dist/r/registry.json"),
    path.resolve(__dirname, "../../apps/docs/public/r/registry.json"),
    path.resolve(__dirname, "../../../packages/registry/dist/r/registry.json"),
    path.resolve(process.cwd(), "apps/docs/public/r/registry.json"),
    path.resolve(process.cwd(), "packages/registry/dist/r/registry.json"),
  ];

  for (const p of possiblePaths) {
    try {
      if (typeof fs !== "undefined" && fs.existsSync && fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedSnapshot = parsed;
          return cachedSnapshot;
        }
      }
    } catch {}
  }

  return FALLBACK_EMBEDDED_ITEMS;
}

export const FALLBACK_EMBEDDED_ITEMS = [
  {
    name: "button",
    type: "registry:component",
    title: "Button",
    description: "Polymorphic button with accessible variants, focus rings, and zero arbitrary spacing.",
    category: "ui:primitive",
    tags: ["react", "tailwind-v4", "headless", "accessible", "radix-primitive", "button"],
    dials: { design_variance: 3, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: [],
    files: [
      {
        path: "registry/primitives/button.tsx",
        target: "components/ui/button.tsx",
        content: `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";`,
      },
    ],
  },
  {
    name: "floating-dock",
    type: "registry:component",
    title: "Floating Dock",
    description: "macOS-inspired interactive floating dock with mouse proximity scaling and spring physics.",
    category: "ui:motion",
    tags: ["motion/react", "spring-physics", "dock", "micro-interaction", "a11y"],
    dials: { design_variance: 6, motion_intensity: 8, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
    files: [
      {
        path: "registry/motion/floating-dock.tsx",
        target: "components/ui/floating-dock.tsx",
        content: `import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "../lib/utils";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export function FloatingDock({ items, className }: { items: DockItem[]; className?: string }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <nav
      aria-label="Floating Application Dock"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto flex h-16 items-end gap-3 rounded-2xl border border-border bg-card/80 px-4 pb-3 shadow-md backdrop-blur-md", className)}
    >
      {items.map((item) => (
        <DockIcon key={item.title} mouseX={mouseX} {...item} />
      ))}
    </nav>
  );
}

function DockIcon({ mouseX, title, icon, href }: DockItem & { mouseX: any }) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-120, 0, 120], [40, 64, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ width, height: width }}
      aria-label={title}
      className="flex aspect-square items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-xs transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="h-5 w-5">{icon}</div>
    </motion.a>
  );
}`,
      },
    ],
  },
  {
    name: "pricing-table",
    type: "registry:block",
    title: "Pricing Table",
    description: "Multi-tier SaaS pricing matrix with annual/monthly billing toggle and responsive layout.",
    category: "ui:block",
    tags: ["pricing", "saas", "interactive-toggle", "tailwind-v4", "layout-block"],
    dials: { design_variance: 5, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["button", "switch", "badge"],
    files: [
      {
        path: "registry/blocks/pricing-table.tsx",
        target: "components/ui/pricing-table.tsx",
        content: `import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-xs",
            tier.popular && "border-primary ring-2 ring-primary/20"
          )}
        >
          <div>
            <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
              <span className="text-xs text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {tier.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="mt-8 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            {tier.ctaText}
          </button>
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
  },
];
