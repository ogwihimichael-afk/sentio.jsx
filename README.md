# Sentio — AI-Powered On-Chain Gifting

> **VBH3 Summer Solstice Hackathon** · Submitted under the **BOHBOOverse** ecosystem  
> Network: **Solana Devnet** · Stack: React · Firebase Auth · Phantom Wallet · Claude AI

---

## What Is Sentio?

Sentio is an AI-powered gifting platform built on Solana. It personalizes gift recommendations by fusing a recipient's social profile (interests, vibe, occasion) with their on-chain wallet signals, then delivers the gift via a Phantom-signed Devnet transaction and a shareable claim link.

The name *Sentio* — Latin for "I feel / I perceive" — reflects the core thesis: gifting should feel considered, not generic.

---

## The Four Hackathon Judge Criteria

These four pillars are non-negotiable throughout the build:

| # | Criterion | How Sentio Addresses It |
|---|-----------|------------------------|
| 1 | **Fused social + on-chain profile** | Step 1 of the Gift Wizard collects name, age, interests, vibe, occasion, and wallet address — fused into a unified recipient object passed to the AI |
| 2 | **AI recommendation engine (the "Zara Test")** | Claude `claude-sonnet-4-6` receives the fused profile and relationship context, returns 3 ranked, personalized gift picks with reasons, sender messages, and Summer Solstice tie-ins |
| 3 | **Phantom wallet + Devnet transaction** | Sender connects Phantom, enters recipient address, and a simulated Devnet transaction is broadcast with a real-format tx signature and Solana Explorer link |
| 4 | **Claim page flow** | A unique claim code is generated per gift; the shareable link resolves to a ClaimPage component where the recipient sees their personalized reveal |

---

## App Flow

```
Splash Screen (2.8s animated)
    ↓
Login / Sign Up
    ├─ Email + Password (Firebase Auth)
    ├─ Phantom Wallet connect
    └─ Demo mode (no credentials needed)
    ↓
Dashboard
    ├─ Stats: gifts sent, claimed, network
    └─ Recent activity feed
    ↓
Gift Wizard (4 steps)
    ├─ Step 1 — Recipient Profile
    │   Name, age, occasion, interests (multi-select),
    │   social vibe, personal note, wallet address
    │
    ├─ Step 2 — AI Recommends
    │   Fused profile → Claude API → 3 ranked gift picks
    │   Each pick includes: type, title, amount, reason,
    │   sender message, recipient reveal, Solstice tie-in
    │
    ├─ Step 3 — Deliver
    │   Connect Phantom → enter recipient wallet →
    │   simulated Devnet tx → tx signature + Explorer link
    │
    └─ Step 4 — Claim Link
        Unique code generated → shareable URL →
        gift saved to history
    ↓
History · Analytics · Settings
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React (hooks: `useState`, `useEffect`, `useCallback`) |
| Styling | Inline CSS-in-JS + injected `<style>` tag (Space Grotesk font) |
| Authentication | Firebase Auth (email/password) via CDN-injected SDK |
| Wallet | Phantom Wallet (`window.solana`) — Solana Devnet |
| AI Engine | Anthropic Claude API (`claude-sonnet-4-6`) — called client-side |
| Persistence | `window.storage` (artifact persistent key-value store) |
| Network | Solana Devnet (simulated transactions with real-format signatures) |

---

## File Structure

Sentio ships as a **single `.jsx` file** — intentional for hackathon portability.

```
Sentio.jsx
├── FIREBASE_CONFIG          — paste your Firebase project credentials here
├── CSS                      — all styles injected as a <style> tag
├── Utility functions        — sleep(), genCode(), genTx(), storageGet/Set()
├── AI mock fallback         — mockRecs() fires if Claude API call fails
├── Splash                   — animated opening screen (2.8s)
├── LoginPage                — Firebase auth + Phantom connect + demo mode
├── Dashboard                — stats grid + recent activity
├── GiftWizard               — 4-step gift flow (core feature)
├── ClaimPage                — recipient-facing gift reveal
├── History                  — table + mobile card view of sent gifts
├── Analytics                — claim rate stats + 7-day bar chart
├── Settings                 — profile, notifications, logout
└── App                      — root router + nav shell
```

---

## Splash Screen

The opening screen runs for **2.8 seconds** with a layered animation sequence:

- Pulsing gold orb with expanding concentric rings
- SVG gift icon centered in the orb
- "Sentio" wordmark with a gold shimmer sweep
- 12 floating gold particle dots rising from the bottom
- Staggered slide-up reveals for subtitle and loading dots
- Bouncing three-dot loader
- Full fade-out before routing to Login

---

## AI Gift Recommendation Engine

When the sender completes the recipient form, Sentio sends a structured prompt to Claude that includes:

- Recipient name, age, interests, vibe, occasion, personal note, wallet address
- Sender relationship type (partner, friend, parent, colleague, etc.)
- Explicit instruction that relationship type must meaningfully differentiate recommendations

Claude returns a JSON object with 3 ranked gifts. Each gift includes:

- `type` — SOL Gift, SPL Token, or NFT Mint
- `title` — specific gift name
- `amount` — estimated cost in SOL or USDC
- `reason` — 2 sentences grounding the pick in their profile
- `senderMessage` — a personal message from the sender
- `claimReveal` — one-line AI explanation shown to the recipient
- `themeConnection` — Summer Solstice event tie-in

If the API call fails, `mockRecs()` provides a graceful fallback with three pre-written gifts tailored to the recipient name, interests, and vibe still pulled from the live form data.

---

## Authentication Modes

| Mode | Behavior |
|------|----------|
| Email + Password | Full Firebase Auth — creates account, sends email verification, supports password reset |
| Phantom Wallet | Connects via `window.solana.connect()`, derives identity from public key |
| Demo Mode | One-click access with no credentials — bypasses all auth for judges and reviewers |
| Placeholder Config | If `FIREBASE_CONFIG` still has `YOUR_API_KEY`, falls back to demo login automatically |

---

## Setup

### 1. Firebase

Replace the placeholder values in `FIREBASE_CONFIG` at the top of `Sentio.jsx`:

```js
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

Enable **Email/Password** sign-in under Firebase Console → Authentication → Sign-in methods.

### 2. Phantom Wallet

Install the [Phantom browser extension](https://phantom.app/) and switch to **Devnet** in wallet settings.

### 3. Run

Drop `Sentio.jsx` into any React environment (Vite, CRA, or the Claude artifact runner). No additional dependencies beyond React itself.

---

## Gift Types

| Type | Example | Network |
|------|---------|---------|
| SOL Gift | Direct SOL transfer | Solana Devnet |
| SPL Token | USDC, $BOHBOO | Solana Devnet |
| NFT Mint | Summer Solstice limited edition | Solana Devnet |

---

## Design System

- **Background:** `#080810` deep dark navy
- **Gold accent:** `#c9a96e` — used for CTAs, stats, badges, highlights
- **Font:** Space Grotesk (400–800 weight)
- **Panels:** `rgba(255,255,255,.03)` with subtle white borders
- **Badges:** Gold (pending) · Green (claimed)
- **Motion:** Spring bounce-ins, shimmer sweeps, float animations, particle systems

---

## BOHBOOverse

Sentio is submitted as part of the **BOHBOOverse** — a suite of Solana-native products built around the `$BOHBOO` token ecosystem. The platform is designed to sit alongside other BOHBOOverse tools as the gifting and social-layer primitive.

---

## Hackathon

**Event:** VBH3 Summer Solstice  
**Network:** Solana Devnet  
**Submitted by:** BOHBOOverse  
**Demo mode:** Available — no wallet or Firebase account required for judges
