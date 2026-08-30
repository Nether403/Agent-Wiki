/**
 * @license MIT
 * @origin Tripwire Security (https://tripwire.sh)
 * @author Tripwire & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface SecurityHoneypotProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onBotTrapTriggered?: (trapValue: string) => void;
}

export function SecurityHoneypotInput({
  onBotTrapTriggered,
  className,
  ...props
}: SecurityHoneypotProps) {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    if (val.length > 0 && onBotTrapTriggered) {
      onBotTrapTriggered(val);
    }
  };

  return (
    <div
      style={{
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <label htmlFor="website_hp_field">Leave this field blank to verify human request</label>
      <input
        id="website_hp_field"
        name="website_hp_field"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}
