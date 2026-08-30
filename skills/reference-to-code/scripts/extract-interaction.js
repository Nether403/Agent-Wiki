#!/usr/bin/env node
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Script to parse and extract interaction metadata from design specs or frame descriptions.
 */

const fs = require("fs");
const path = require("path");

function extractInteractionSpec(description) {
  const spec = {
    trigger: "hover",
    durationMs: 200,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    spring: {
      stiffness: 300,
      damping: 28,
      mass: 0.9,
    },
    states: {
      initial: { scale: 1, opacity: 1 },
      hover: { scale: 1.02, y: -2 },
      active: { scale: 0.98 },
    },
  };

  if (/click|tap/i.test(description)) {
    spec.trigger = "click";
  }
  if (/drag/i.test(description)) {
    spec.trigger = "drag";
  }
  if (/slow|subtle/i.test(description)) {
    spec.durationMs = 400;
    spec.spring.damping = 35;
  }
  if (/snappy|bouncy/i.test(description)) {
    spec.spring.stiffness = 400;
    spec.spring.damping = 22;
  }

  return spec;
}

const inputArg = process.argv[2] || "hover button with snappy spring feedback";
const result = extractInteractionSpec(inputArg);
console.log("Extracted Interaction Specification:");
console.log(JSON.stringify(result, null, 2));
