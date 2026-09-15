# RCSS Hackathon Results Reveal (In-Universe Prop UI)

A static Next.js single-page application built as an on-camera UI prop for a short film.

## Quick Start for the Shoot

1. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

3. Open **`http://localhost:3000`** in Google Chrome or your default browser.

4. **Prepare for Filming:**
   - Press **`F11`** (or **`F`**) on the keyboard to put the browser into borderless fullscreen.
   - The screen is calibrated with high-contrast cinema typography and ambient backlighting for direct-to-sensor filming.

---

## Filming & Retake Controls

Everything is controlled seamlessly client-side with instant state toggling:

| Action | Control / Shortcut | Notes |
| :--- | :--- | :--- |
| **Stage 1: Show Button** | Press <kbd>Space</kbd> or <kbd>Enter</kbd> | The glowing **"Reveal Results"** button smoothly appears into the poster |
| **Stage 2: Reveal Winners** | Press <kbd>Space</kbd> again or click **"Reveal Results"** | Smooth 500ms cinematic transition to Screen 2 with soft audio sweep |
| **Reset for Retake** | Press <kbd>R</kbd>, <kbd>Esc</kbd>, or click **↺ Reset Screen** | Instantly resets all the way back to initial clean poster (no button) |
| **Fullscreen** | Press <kbd>F11</kbd> or <kbd>F</kbd> (or click **⛶ Fullscreen**) | Removes all browser window chrome for a clean sensor shot |

---

## Screen Breakdown

### Screen 1 — Initial Landing Poster
- Eyebrow: `RCSS — DEPARTMENT OF COMPUTER SCIENCE PRESENTS`
- Title: `HACK-A-THON`
- Subtitle: `Day 1 — Ideation Phase Results`
- Button Slot: Hidden initially -> Blooms into view upon first <kbd>Space</kbd> press

### Screen 2 — Winner Announcement
- Badge: `WINNER — IDEATION PHASE`
- Primary Focal Point: `TEAM 5`
- 4 Team Members:
  - `Prithvin`
  - `Sreerag Belraj`
  - `Aldrin`
  - `Sreerag S`
- Congratulatory line: `Congratulations!`

