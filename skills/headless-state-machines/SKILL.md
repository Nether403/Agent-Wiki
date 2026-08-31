---
name: headless-state-machines
description: "Zag.js and finite state machine design patterns for rock-solid UI states, transition guards, and accessibility event handling."
risk: safe
source: "https://github.com/chakra-ui/zag"
date_added: "2026-08-31"
---

# Headless State Machines Skill

This skill governs the implementation of deterministic, finite state machines (FSM) for interactive web components using **Zag.js** and **Ark UI** patterns.

---

## 1. Why State Machines for AI-Generated UI?

When AI agents improvise component state with ad-hoc `useState` flags (`isLoading`, `isOpen`, `isError`, `isSubmitting`), it leads to **illegal state combinations** (e.g. `isLoading=true` and `isSuccess=true` simultaneously).

State machines prevent state drift by defining:
1. **Explicit States**: A component is strictly in one state at a time (`idle`, `active`, `pending`, `resolved`, `rejected`).
2. **Deterministic Transitions**: State changes can only occur in response to declared events (`TRIGGER`, `CANCEL`, `RESOLVE`, `RETRY`).
3. **Guards & Actions**: Pre-transition condition checks (e.g. form validity) and side-effects.

---

## 2. Standard State Machine Pattern

```typescript
type MachineState = "idle" | "loading" | "success" | "error";
type MachineEvent = { type: "FETCH" } | { type: "RESOLVE" } | { type: "REJECT"; error: string } | { type: "RESET" };

interface MachineContext {
  retries: number;
  errorMessage?: string;
}

export function createInteractiveStateMachine() {
  let state: MachineState = "idle";
  let context: MachineContext = { retries: 0 };

  return {
    getState: () => state,
    getContext: () => context,
    send: (event: MachineEvent) => {
      switch (state) {
        case "idle":
          if (event.type === "FETCH") state = "loading";
          break;
        case "loading":
          if (event.type === "RESOLVE") state = "success";
          if (event.type === "REJECT") {
            state = "error";
            context.errorMessage = event.error;
            context.retries += 1;
          }
          break;
        case "error":
          if (event.type === "FETCH") state = "loading";
          if (event.type === "RESET") state = "idle";
          break;
        case "success":
          if (event.type === "RESET") state = "idle";
          break;
      }
    },
  };
}
```
