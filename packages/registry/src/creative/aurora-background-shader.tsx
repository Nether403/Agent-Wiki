/**
 * @license MIT
 * @origin React Bits & Magic UI (https://reactbits.dev / https://magicui.design)
 * @author React Bits & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface AuroraBackgroundShaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackgroundShader({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundShaderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col h-[100dvh] items-center justify-center bg-background text-foreground transition-bg overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className={cn(
            "filter blur-[60px] opacity-50 absolute -inset-[10px]",
            "[--white-gradient:repeating-linear-gradient(100deg,var(--color-primary)_0%,var(--color-primary)_7%,transparent_10%,transparent_12%,var(--color-primary)_16%)]",
            "[--dark-gradient:repeating-linear-gradient(100deg,var(--color-primary)_0%,var(--color-primary)_7%,transparent_10%,transparent_12%,var(--color-primary)_16%)]",
            "[--aurora:repeating-linear-gradient(100deg,#38bdf8_10%,#818cf8_15%,#c084fc_20%,#e879f9_25%,#22d3ee_30%)]",
            "[background-image:var(--white-gradient),var(--aurora)]",
            "dark:[background-image:var(--dark-gradient),var(--aurora)]",
            "[background-size:300%,_200%]",
            "[background-position:50%_50%,50%_50%]",
            "animate-aurora will-change-transform"
          )}
          style={{
            animation: "aurora 60s linear infinite",
          }}
        />
      </div>

      {showRadialGradient && (
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 w-full flex flex-col items-center">{children}</div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes aurora {
            from {
              background-position: 50% 50%, 50% 50%;
            }
            to {
              background-position: 350% 50%, 350% 50%;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-aurora {
              animation: none !important;
              background-position: 50% 50% !important;
            }
          }
        `,
      }} />
    </div>
  );
}
