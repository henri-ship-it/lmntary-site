# Learn platform auth — architecture

Stripe checkout + Kit.com tag + magic-link JWT. No passwords, no LMS.

Based on the Visualize Value "course platform without LMS" and "zero-password auth" workflows. Note: I couldn't fetch the reference articles from this network — this is the canonical pattern those posts describe, assembled from what's already standard for this kind of stack. Treat the exact details below as the first draft; once you can hand me the VV articles, I'll reconcile any divergence.

## The flow, end to end

1. **Customer clicks "Enrol"** on `/programmes` or `/learn/limitless`.
2. **Stripe Checkout** opens (hosted, hosted-mode). On the Stripe side, `metadata.course = "limitless"` is attached to the Price so the webhook knows what to unlock.
3. **Stripe webhook → our API** fires `checkout.session.completed`. Our handler:
   - Creates or updates a Kit.com subscriber with the customer's email.
   - Adds a tag like `limitless-member` (one tag per paid course).
   - Optionally triggers a Kit automation that sends a "welcome + here's your sign-in link" email.
4. **Customer visits `/learn/sign-in`**, enters their email, submits.
5. **Our `/api/auth/magic-link` endpoint**:
   - Looks up the email on Kit, checks for the appropriate member tag.
   - Signs a short-lived (15 min) JWT containing `{ email, tags: ["limitless-member"] }` with our `AUTH_SECRET`.
   - Sends an email containing a link: `https://lmntary-site.vercel.app/api/auth/verify?token=<jwt>`.
   - Returns a generic "check your inbox" response either way — **never leak whether the email is a customer**.
6. **Customer clicks the link** from the email.
7. **Our `/api/auth/verify` endpoint**:
   - Verifies the JWT.
   - Issues a longer-lived (30-day) session JWT.
   - Sets it as an `HttpOnly; Secure; SameSite=Lax` cookie named `lmntary_session`.
   - Redirects to `/learn/<course>/<first-lesson>`.
8. **Lesson pages** read the cookie server-side (in the RSC) and decide whether to render the content or the gate.

## Why this shape

- **Stripe = source of truth for payment.** Webhook is idempotent — replay it and nothing breaks.
- **Kit = source of truth for "is this email a member".** We already have Kit wired up for the newsletter. Adding tags for paid courses gives us segmentation for free (can email Limitless members directly from Kit, trigger drip sequences, etc.).
- **JWT in an HttpOnly cookie** = no DB needed, no sessions table, no expiry cleanup. If we ever want revocation we add a signing-version field and bump it.
- **Kit also sends the magic-link email.** We don't need SendGrid/Resend/Postmark at all — we just trigger a Kit transactional send with the signed URL, or we use a Kit template and pass the URL as a merge field.

## What needs to exist in the codebase

```
src/
  lib/
    auth.ts                 // sign/verify JWT helpers (jose lib)
    kit-members.ts          // check + set tags via Kit API
    stripe.ts               // checkout session helpers
  app/
    api/
      auth/
        magic-link/route.ts // POST { email } -> send link
        verify/route.ts     // GET  ?token=   -> set cookie, redirect
        sign-out/route.ts   // POST           -> clear cookie
      stripe/
        webhook/route.ts    // POST           -> tag member in Kit
        checkout/route.ts   // POST { course } -> create Stripe session
    learn/
      [course]/[lesson]/page.tsx  // reads cookie, decides content vs gate
```

## Env vars to add to Vercel

```
AUTH_SECRET=<openssl rand -base64 48>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LIMITLESS_CORE=price_...
# KIT_API_KEY / KIT_API_SECRET already exist
```

## Open questions for Chris / Henri before building

1. **Which Kit tag names?** Suggest: `limitless-member`, `pop-member` (for the free Principles course we still want the tag for segmentation, but the lesson content stays unlocked for everyone).
2. **What's the Stripe account setup?** Live account exists? Test-mode for dev?
3. **Do we need refund handling?** If so: `charge.refunded` webhook removes the Kit tag.
4. **Community access?** If Limitless includes a Circle/Slack/Discord, does purchasing also invite them? If yes, the webhook needs another branch.
5. **Cookie domain?** If the site is at `lmntaryperformance.com` and Learn stays on the same domain, this is trivial. Cross-subdomain needs `domain=.lmntaryperformance.com`.

## What's already in place (this commit)

- `/learn` index, `/learn/[course]`, `/learn/[course]/[lesson]` routes all render.
- Course & lesson data lives in `src/lib/courses.ts` as plain TS. Swap the body strings for MDX or a CMS later.
- Paid lessons show a gate component (`styles.gate`) when `access: 'paid'` — right now that's just a static render; wiring the cookie check is the one-line change once auth is built.
- `/learn/sign-in` has the UI and captures email; the form handler is a stub that resolves to "check your inbox" without sending anything. Hooking up `/api/auth/magic-link` makes it real.
