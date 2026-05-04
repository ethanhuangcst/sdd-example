# F4 — Reset Story: Tech Design

## Overview

F4 adds a "Start Over" button with a browser `confirm()` dialog. On confirmation, it calls `POST /api/reset`, then triggers `router.refresh()`. No new API routes needed — `/api/reset` already exists.

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/ResetButton.tsx` | New client component — button + confirm dialog |
| `src/app/page.tsx` | Add `<ResetButton />` below the form |

---

## Component: ResetButton

`'use client'` — needs `useState` for submitting state and `useRouter` for refresh.

```
On click:
  1. window.confirm("Start over? All sentences will be deleted.")
  2. If cancelled → do nothing
  3. If confirmed → POST /api/reset → router.refresh()
```

Styling: ghost button, muted border, turns red on hover (per UI guideline).
