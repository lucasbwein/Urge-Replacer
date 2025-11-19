# Replace the Urge

We all tend to distract ourselves from what is really going on. Whether that be with social
media, shows, gaming, or etc.. This app serves as a tool to make your time more intentional,
helping you find the root of what you tend to numb out with and why.

Live here: https://vercel.com/lucasbweins-projects/urge-replacer/deployments

## Overview
This react app helps with the overwhelming feeling we often get, giving questions to
face the problems and possible alternatives that are healthier.

The way it works is when a urge arises:
- Prompts user to pause and really look within of what you are avoiding
- Choose a different healthier option
- Then tracks how you feel afterwards
- Also provides a overview on progress overtime

## Features

### Core Functionality
- **5 Urge Types:** Gaming, scrolling, shows, food, avoiding tasks
- **Reason Identification:** Select from 8 common root causes (avoiding discomfort, boredom, suppressing emotion, etc.)
- **Curated Alternatives:** 25-30 specific alternatives per reason category
- **Reflection Timer:** 15-second pause before continuing (encourages genuine reflection)
- **1-10 Rating System:** Track satisfaction with your choice
- **Notes:** Optional journaling for each redirect

### Analytics & Tracking
- **Dashboard:** View most recent redirect with reason, alternative chosen, and rating
- **Pattern Analysis:** Track most common reasons and average feelings per urge type
- **Best Alternatives:** Identify which redirects leave you feeling best
- **History:** Complete sortable list of all redirects (newest, oldest, highest rating, by urge type)

### Mobile Integration (iOS)
- **Social Media Intention-Setting:** Special flow for Instagram/YouTube with iOS Shortcuts automation
- **Focus Mode Integration:** Set intentions before opening social apps, with automatic app opening after setting Focus Mode
- **Manual or Automated:** Works on desktop for tracking, enhanced on mobile with automation

### UI/UX
- Responsive design optimized for mobile use
- localStorage for data persistence (no backend required)
- Clean multi-screen flow with progress tracking
- Delete redirects with confirmation
- Dark theme optimized for intentional use

## Tech Stack

- **React** (useState, useEffect hooks)
- **JavaScript** (localStorage, iOS URL schemes)
- **CSS** (responsive design, animations)
- **iOS Shortcuts API** (optional mobile automation)
- **Vercel** (deployment)

## Why I Built This

This app originated from recognizing my own patterns of avoidance - gaming, scrolling social media, and binge-watching shows when I didn't want to face discomfort. Rather than just tracking "bad" habits, I wanted a tool that:

1. Forces a pause and reflection (the 15-second timer)
2. Identifies the actual reason (not just the surface behavior)
3. Provides specific, actionable alternatives (not generic advice)
4. Tracks what actually works (data-driven behavior change)

After building and deploying it, I've been using it regularly and iterating based on real-world feedback - adding the reason-tracking feature, expanding alternatives, and building the iOS automation integration.

## Installation & Usage

### Web Version (All Platforms)

Simply visit [urge-replacer.vercel.app](https://urge-replacer.vercel.app) - no installation needed. Data persists in your browser's localStorage.

### Mobile Automation Setup (iOS Only)

**Prerequisites:**
- iOS device with Shortcuts app
- Create a Focus Mode called "Intentional Use"

### Step 1: Create Focus Mode

1. Settings → Focus → + (top right)
2. Name it: **"Intentional use"**
3. Skip customization options
4. Tap "Done"

### Step 2: Import Shortcuts (One-Click Install)

Click these links on your iPhone to import pre-built shortcuts:

**For opening apps after setting intention:**
- [Open Instagram Intentional](https://www.icloud.com/shortcuts/e9c81ab45cc84f66bcf9dac153ce229f)
- [Open YouTube Intentional](https://www.icloud.com/shortcuts/e78cf7d12509465294f8b283aa7c8bd9)
- [Open Tiktok Inentional](https://www.icloud.com/shortcuts/ba484295636949a6a9dc8a7c33765fb6)
- [Open Snapchat Inentional](https://www.icloud.com/shortcuts/647ced7555f641e18af40e428115870f)
- [Get Current Focus](https://www.icloud.com/shortcuts/2cd633bd9b394e5d8f06ec159e04c403) (needed for automations)
- [Turn Off Intentional use](https://www.icloud.com/shortcuts/00efb8fdbb5248d2b03aff92d7b2396a)

### Step 3: Create Automations

**For Instagram:**
1. Open Shortcuts app → Automation tab → +
2. Tap "App" → Choose Instagram and/or Other Apps → "Is Opened"
3. Tap "Next"
4. Add action: Search "Get Current Focus" → Add it
5. Add action: Search "If" → Tap it
6. Set condition: "Current Focus" "does not have any value"
7. Inside the If block, add: "Open URLs"
8. Change URL to: `https://urge-replacer.vercel.app?app=Instagram`
9. **Important:** Turn OFF "Ask Before Running"
10. Tap "Done"

**For YouTube or Other apps:**
Repeat steps above, but:
- Choose App instead of Instagram in step 2
- Change URL to: `https://urge-replacer.vercel.app?app=YouTube`

**For other apps (Snapchat, TikTok, etc.):**
Follow the same pattern, changing the app name and URL parameter.

### Step 4: Add to Home Screen (Recommended)

For fastest access:
1. Open urge-replacer.vercel.app in Safari
2. Tap Share button → "Add to Home Screen"
3. Name it "Replace Urge" → Add

### How It Works

1. You open Instagram → Automation fires
2. If Focus Mode is OFF → Redirects to intention-setting page
3. You write your intention and time limit
4. Tap "Set Intention & Open Instagram"
5. Shortcut enables Focus Mode → Opens Instagram
6. You use Instagram with intention
7. When Focus Mode expires → Next time triggers redirect again

### Troubleshooting

**Q: It keeps redirecting even after I set an intention**
A: Make sure Focus Mode is actually enabled. Check Control Center.

**Q: The automation doesn't work**
A: Ensure "Ask Before Running" is OFF in the automation settings.

**Q: Focus Mode doesn't turn on automatically**
A: The shortcut can't auto-enable Focus Mode - you may need to manually turn it on after setting intention, or grant Shortcuts permission in Settings → Shortcuts → Advanced.

**Q: Can I use this without iOS automation?**
A: Yes! Just manually visit the site when you feel an urge. The automation is optional convenience.

## Local Development
```bash
# Clone the repository
git clone https://github.com/lucasbwein/Urge-Replacer.git
cd Urge-Replacer

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

## Project Structure
```
src/
├── App.js           # Main component with all screens and state management
├── App.css          # Styling for all screens
└── index.js         # Entry point
```

## Key Learnings

This was my first original React project built completely from scratch (not a tutorial). Key technical implementations:

- **Multi-screen state management** without React Router (using conditional rendering)
- **localStorage patterns** for data persistence and state restoration
- **iOS URL scheme integration** for native app communication
- **Analytics calculations** (averaging, sorting, filtering by multiple criteria)
- **Iterative development** based on actual usage patterns

The biggest learning wasn't technical - it was building something I actually use, which led to discovering features I didn't initially plan (like reason-tracking) that made the app significantly more valuable.

## Future Improvements

- Backend integration for cross-device sync
- Calendar view of redirects over time
- Customizable alternatives (user-defined options)
- Reminders for checking in on long-standing patterns
- Export data functionality
- Android automation support

## Related Projects

After building this, I applied similar patterns to create:
- [Questions Worth Asking](https://authentic-conversation-starter.vercel.app) - Conversation starter app
- [Portfolio Website](your-portfolio-url) - Showcasing these projects

## License

MIT License - see LICENSE file for details

## Connect

- Portfolio: [lucasweinsteinportfolio.vercel.app]
- GitHub: [@lucasbwein](https://github.com/lucasbwein)
- LinkedIn: [Lucas Weinstein](https://linkedin.com/in/lucasweinstein)