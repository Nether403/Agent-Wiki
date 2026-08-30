/**
 * SPDX-License-Identifier: MIT
 * Source: Machine-First Design Agent Wiki (Inspired by launch-ui & page-ui & shadcnblocks.com)
 * Category: ui:block
 * Description: Multi-tier plan comparator with monthly/annual billing cycle toggle, feature breakdown list with tooltips, and highlighted tier callout.
 */

import * as React from "react";
import { Check, HelpCircle, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

interface PricingTierFeatureMatrixProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PricingTierFeatureMatrix({
  plans,
  title = "Predictable, transparent pricing",
  subtitle = "Choose the plan that fits your engineering team's scale.",
  className,
}: PricingTierFeatureMatrixProps) {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual");

  return (
    <section
      aria-labelledby="pricing-heading"
      className={cn("w-full py-12 px-4 max-w-7xl mx-auto flex flex-col items-center", className)}
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 id="pricing-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{subtitle}</p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={cn("text-xs font-medium", billingCycle === "monthly" ? "text-foreground font-semibold" : "text-muted-foreground")}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={billingCycle === "annual"}
            onClick={() => setBillingCycle(billingCycle === "annual" ? "monthly" : "annual")}
            aria-label="Toggle annual billing discount"
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              billingCycle === "annual" ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
                billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
          <span className={cn("text-xs font-medium flex items-center gap-1.5", billingCycle === "annual" ? "text-foreground font-semibold" : "text-muted-foreground")}>
            <span>Annual</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
        {plans.map((plan) => {
          const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl border p-8 bg-card text-card-foreground shadow-sm transition-all",
                plan.popular
                  ? "border-primary ring-1 ring-primary shadow-md scale-105 z-10"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground min-h-[32px]">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono tracking-tight text-foreground">
                    ${price}
                  </span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>

                <ul className="mt-8 space-y-3 border-t border-border pt-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href={plan.ctaHref}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                  )}
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
