---
name: Toast position preference
description: User wants toasts bottom-right, not top-center
type: feedback
---

Toasts must be positioned bottom-right. Was previously top-center and user was frustrated it wasn't already correct.

**Why:** User preference for less intrusive notification placement.
**How to apply:** Never change the Toaster position. If adding new toast calls, they'll inherit bottom-right from the global Sonner config in layout.tsx.
