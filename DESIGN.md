# Design System: Ascend OS

## Visual World & Aesthetics
Ascend OS is built on a dark, sleek cybernetic aesthetic with crisp luminous accents, subtle layered glassmorphism, dynamic data telemetry, and responsive micro-interactions.

---

## 🎨 Color Palette & Tokens

- **Background**:
  - Base Deep Void: `#030712` / `#050914`
  - Elevated Card Deck: `linear-gradient(135deg, rgba(10, 16, 36, 0.95), rgba(6, 11, 24, 0.98))`
  - Backdrop Blur: `backdrop-blur-xl` or `backdrop-blur-2xl`
- **Borders & Dividers**:
  - Subtle Grid Lines: `rgba(255, 255, 255, 0.08)` / `border-white/10`
  - Active/Focused Glows: `rgba(6, 182, 212, 0.4)` (Cyan), `rgba(139, 92, 246, 0.4)` (Violet)
- **Primary Energy Accents**:
  - **Cyan / Neon Blue** (`#06b6d4`, `#3b82f6`): System state, telemetry, intelligence, focus.
  - **Violet / Amethyst** (`#8b5cf6`, `#6366f1`): Rank awakenings, EXP, shadow magic.
  - **Amber / Gold** (`#f59e0b`, `#fbbf24`): Currency (Gold), achievements, streaks.
  - **Crimson / Rose** (`#ef4444`, `#f43f5e`): Boss damage, health pools, critical alerts.
  - **Emerald / Jade** (`#10b981`, `#059669`): Fresh recovery (100%), verified completions.

---

## 🔤 Typography & Hierarchy

- **Font Families**:
  - Headings / Display: Modern geometric sans-serif (`font-heading`, `Outfit` / `Inter`) with high weight contrast (700-900).
  - Code / Telemetry / Stats: Monospace (`font-mono`, `JetBrains Mono` / `Fira Code`) for numbers, coordinates, timers, and stat tiers.
  - Body Text: Clean readable sans (`font-sans`, `Inter`) with `text-slate-300` / `text-slate-400`.
- **Numbers & Metrics**:
  - `font-variant-numeric: tabular-nums` to eliminate jitter in real-time clocks and stat counts.

---

## ⚡ Interaction & Accessibility Rules

- **Interactive Targets**: Minimum hit targets ≥ 24px (mobile ≥ 44px).
- **Focus States**: Visible focus rings on all keyboard-navigable elements (`focus-visible:ring-2 focus-visible:ring-cyan-500`).
- **Feedback Loops**: Instant visual and optional audio feedback (`playUIMenuSFX`, `playBuffSFX`) on key actions.
- **Form Safeguards**: Inline validation next to fields, disabled submit states with loading spinners, and honeypot bot trap protections.
- **Empty States**: Every view must design an engaging, stylized empty state with a clear call-to-action (never a blank void).

---

## 🚫 Anti-Patterns & Bans

- ❌ **No Bland Default Card Grids**: Every card must have purposeful hierarchy, subtle borders, and contextual visual cues.
- ❌ **No Arbitrary Unbounded Gradients**: All color gradients must serve meaning (e.g. fatigue state, elemental alignment, currency type).
- ❌ **No Layout Jitter**: Reserve skeleton space or fixed dimensions for dynamic charts and images.
- ❌ **No Mismatched Dark Mode Controls**: Native `<select>` and `<input>` elements must explicitly define background and text colors to prevent OS-level white flashes.
