# MyPace — Health & Wellness App — Design Plan

## Overview
A cross-platform mobile + web health app targeting **older adults** with a focus on simplicity, readability, and daily health tracking. Built with **React Native + Expo** for iOS, Android, and Web from a single codebase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native with Expo (SDK 52+) |
| **Language** | TypeScript |
| **Navigation** | React Navigation (bottom tabs) |
| **Local Storage** | SQLite via `expo-sqlite` (primary) |
| **Cloud Sync** | Supabase (optional — PostgreSQL + Auth + Realtime) |
| **Food API** | USDA FoodData Central API (free, no key limits) |
| **Notifications** | `expo-notifications` (push + local) |
| **Charts** | `react-native-chart-kit` or `victory-native` |
| **State Management** | Zustand (lightweight, simple) |
| **Styling** | NativeWind (Tailwind for RN) or StyleSheet with design tokens |
| **Exercise Images** | Open-source library (e.g., wger.de API) + placeholder system for custom replacements |

---

## App Structure — Bottom Tab Navigation (5 Tabs)

### Tab 1: 🏠 Home / Dashboard
- **Daily summary card**: calories consumed, protein, sodium, exercises completed, walk time
- **Quick action buttons**: "Log Food", "Log Exercise", "Start Walk"
- **Walking program progress bar** (e.g., "Week 3 of 12 — 20 min/day")
- **Motivational message / streak counter**

### Tab 2: 🍎 Nutrition
- **Food search** — powered by USDA FoodData Central API
  - Search by food name, get results with: calories, protein (g), sodium (mg), serving size
  - Tap to add to today's log with serving quantity
- **Daily food log** — list of everything eaten today with running totals
- **Daily targets display** — calories, protein, sodium goals (user-configurable)
- **Meal grouping** (optional): Breakfast, Lunch, Dinner, Snacks
- **Favorites / Recent foods** — quick re-add for common items

### Tab 3: 🚶 Walking Program
- **Structured multi-week progression plan**
  - Example: 12-week program starting at 5-10 min/day, building to 30-45 min/day
  - Weekly milestones with encouragement
- **Today's walk goal** displayed prominently
- **Start/Stop walk timer** with elapsed time display (large font)
- **Walk history** — log of completed walks with duration
- **Progress visualization** — weekly chart of walk times vs. goals

### Tab 4: 💪 Exercises
- **Exercise catalog** — browsable list with:
  - Exercise name (large text)
  - Photo/illustration showing the movement
  - Brief description / instructions
  - Category tags (e.g., Balance, Strength, Flexibility, Cardio)
- **Filter/search** by category or name
- **Log exercise** — tap to add to today's log with sets/reps/duration
- **Image source**: wger.de open exercise database initially; replaceable with custom images
- **Suggested daily routine** based on walking program week (optional)

### Tab 5: 📊 Progress / History
- **Daily view** — summary of a specific day's activity
- **Weekly/monthly trend charts**:
  - Calories over time
  - Protein intake over time
  - Sodium intake over time
  - Walk duration over time
  - Exercise frequency over time
- **Calendar view** — tap any date to see that day's log
- **Export data** option (CSV) for sharing with doctors

---

## UI / UX Design Principles (Older Adult Audience)

### Typography
- **Minimum font size**: 18px for body text, 24px+ for headers
- **Font**: System default (San Francisco on iOS, Roboto on Android) — familiar and well-hinted
- **Font weight**: Medium/Semi-bold for better legibility
- **Line spacing**: 1.5x minimum

### Touch Targets
- **Minimum button/tap target**: 48x48dp (per WCAG), prefer 56x56dp+
- **Generous padding** between interactive elements
- **No tiny icons** without labels — always pair icons with text labels

### Color & Contrast
- **Light mode**: White/off-white backgrounds, dark text (#1A1A1A), high-contrast accent colors
- **Dark mode**: Dark gray backgrounds (#121212), light text (#E0E0E0)
- **Contrast ratio**: Minimum 4.5:1 (WCAG AA), target 7:1 (WCAG AAA)
- **Primary accent**: Calming blue or teal (#0077B6 or similar)
- **Success/positive**: Green (#2E7D32)
- **Warning**: Orange (#E65100)
- **Error**: Red (#C62828)
- **Toggle**: User can switch light/dark in Settings

### Navigation
- **Bottom tab bar** with 5 large icons + text labels
- **Simple, linear flows** — avoid nested navigation depth > 2 levels
- **Back buttons** always visible and large
- **Confirmation dialogs** for destructive actions

### Accessibility
- Full VoiceOver / TalkBack support
- Support for system font scaling
- No color-only indicators (always use icons + text + color)

---

## Data Model (SQLite Local)

### Tables

```
users
  - id (PK)
  - name
  - calorie_goal
  - protein_goal
  - sodium_goal
  - walking_program_start_date
  - walking_program_week
  - theme_preference (light/dark)
  - notifications_enabled
  - created_at

food_log
  - id (PK)
  - user_id (FK)
  - date
  - meal_type (breakfast/lunch/dinner/snack)
  - food_name
  - usda_fdc_id (nullable — for API-sourced items)
  - serving_size
  - serving_unit
  - calories
  - protein_g
  - sodium_mg
  - created_at

exercise_log
  - id (PK)
  - user_id (FK)
  - date
  - exercise_id (FK to exercise catalog)
  - exercise_name
  - sets (nullable)
  - reps (nullable)
  - duration_seconds (nullable)
  - notes (nullable)
  - created_at

walk_log
  - id (PK)
  - user_id (FK)
  - date
  - duration_seconds
  - program_week (which week of the walking program)
  - goal_duration_seconds
  - notes (nullable)
  - created_at

exercise_catalog
  - id (PK)
  - name
  - description
  - instructions
  - category (balance/strength/flexibility/cardio)
  - image_uri (local asset or remote URL)
  - difficulty_level (beginner/intermediate/advanced)
  - source (wger/custom)

walking_program
  - week_number (PK)
  - daily_goal_minutes
  - description
  - tips

favorite_foods
  - id (PK)
  - user_id (FK)
  - food_name
  - usda_fdc_id
  - serving_size
  - serving_unit
  - calories
  - protein_g
  - sodium_mg
```

---

## Walking Program Structure (Example 12-Week Plan)

| Week | Daily Goal | Notes |
|------|-----------|-------|
| 1 | 5 min | Start slow, focus on form and comfort |
| 2 | 8 min | Slight increase, maintain comfortable pace |
| 3 | 10 min | Building a routine |
| 4 | 12 min | Adding a couple minutes |
| 5 | 15 min | Quarter-hour milestone! |
| 6 | 18 min | Steady progression |
| 7 | 20 min | Great progress — 20 minutes! |
| 8 | 22 min | Keep it up |
| 9 | 25 min | Nearing the 30-min goal |
| 10 | 28 min | Almost there |
| 11 | 30 min | Half-hour walks — excellent! |
| 12 | 30-35 min | Maintain and enjoy |

*(This can be customized or multiple difficulty tiers can be offered)*

---

## Notifications Plan

| Notification | Default Time | Content |
|---|---|---|
| Morning walk reminder | 8:00 AM | "Good morning! Today's walk goal: X minutes 🚶" |
| Meal logging reminder | 12:30 PM | "Don't forget to log your lunch! 🍎" |
| Exercise reminder | 3:00 PM | "Time for today's exercises! 💪" |
| Evening summary | 7:00 PM | "Great day! You logged X calories and walked Y minutes 📊" |

- All times user-configurable in Settings
- Can enable/disable each notification type independently

---

## Cloud Sync (Optional — Supabase)

- **Auth**: Email/password or phone number (simple for older users)
- **Sync strategy**: Local-first; sync on-demand or on Wi-Fi
- **Conflict resolution**: Last-write-wins with timestamps
- **Tables mirrored**: All local tables synced to Supabase PostgreSQL
- **Benefits**: Data backup, device migration, potential for caregiver/family dashboard later

---

## Project Structure

```
alpine-labs/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/             # Tab navigation group
│   │   ├── index.tsx       # Home/Dashboard
│   │   ├── nutrition.tsx   # Nutrition tab
│   │   ├── walking.tsx     # Walking program tab
│   │   ├── exercises.tsx   # Exercise catalog tab
│   │   └── progress.tsx    # Progress/History tab
│   ├── food-search.tsx     # Food search modal
│   ├── exercise-detail.tsx # Exercise detail view
│   ├── settings.tsx        # Settings screen
│   └── _layout.tsx         # Root layout
├── components/             # Reusable UI components
│   ├── ui/                 # Buttons, Cards, Inputs (large, accessible)
│   ├── charts/             # Chart wrapper components
│   ├── food/               # Food-related components
│   ├── exercise/           # Exercise-related components
│   └── walking/            # Walking-related components
├── lib/                    # Business logic
│   ├── database.ts         # SQLite setup & queries
│   ├── usda-api.ts         # USDA FoodData Central client
│   ├── notifications.ts    # Notification scheduling
│   ├── sync.ts             # Supabase sync logic
│   └── walking-program.ts  # Walking program progression logic
├── stores/                 # Zustand state stores
│   ├── user-store.ts
│   ├── food-store.ts
│   ├── exercise-store.ts
│   └── walk-store.ts
├── assets/                 # Images, fonts
│   └── exercises/          # Exercise images
├── constants/              # Colors, typography, walking program data
│   ├── theme.ts
│   ├── walking-program.ts
│   └── exercises.ts
└── types/                  # TypeScript type definitions
```

---

## Implementation Phases

### Phase 1 — Foundation
- [ ] Initialize Expo project with TypeScript
- [ ] Set up bottom tab navigation (5 tabs)
- [ ] Create design system (theme, typography, accessible components)
- [ ] Set up SQLite database with schema
- [ ] Build Home/Dashboard screen (static mockup)

### Phase 2 — Nutrition
- [ ] Integrate USDA FoodData Central API
- [ ] Build food search screen
- [ ] Build food logging flow (search → select → add serving → save)
- [ ] Display daily food log with calorie/protein/sodium totals
- [ ] Favorite/recent foods feature

### Phase 3 — Walking Program
- [ ] Define 12-week walking program data
- [ ] Build walking program screen with current week/goal
- [ ] Build walk timer (start/stop with elapsed time)
- [ ] Save walk logs to database
- [ ] Show progress vs. weekly goals

### Phase 4 — Exercise Catalog & Logging
- [ ] Source exercise images (wger.de API or open assets)
- [ ] Build exercise catalog browse/search screen
- [ ] Build exercise detail view (image + instructions)
- [ ] Build exercise logging flow
- [ ] Daily exercise log display

### Phase 5 — Progress & History
- [ ] Build daily summary view
- [ ] Integrate charting library
- [ ] Build weekly/monthly trend charts
- [ ] Calendar view for historical browsing
- [ ] Data export (CSV)

### Phase 6 — Polish & Notifications
- [ ] Implement push/local notifications
- [ ] User settings screen (goals, notifications, theme toggle)
- [ ] Light/dark mode theming
- [ ] Accessibility audit (font scaling, screen readers, contrast)
- [ ] Performance optimization

### Phase 7 — Cloud Sync (Optional)
- [ ] Set up Supabase project
- [ ] Implement user authentication
- [ ] Build sync logic (local ↔ cloud)
- [ ] Test offline-first behavior

### Phase 8 — App Store Preparation
- [ ] App icons and splash screens
- [ ] App Store / Google Play metadata and screenshots
- [ ] Privacy policy and terms
- [ ] Beta testing via TestFlight / Google Play internal testing
- [ ] Submit to stores

---

## Key APIs & Resources

| Resource | URL | Notes |
|---|---|---|
| USDA FoodData Central | https://fdc.nal.usda.gov/api-guide | Free API, get key at https://fdc.nal.usda.gov/api-key-signup |
| wger Exercise DB | https://wger.de/api/v2/ | Open-source exercise database with images |
| Expo Docs | https://docs.expo.dev/ | Framework documentation |
| Supabase | https://supabase.com/ | Backend-as-a-service (free tier) |

---

## Open Questions / Future Considerations

- Should the walking program support multiple difficulty tiers (e.g., "Easy Start" vs. "Active")?
- Barcode scanning for food items? (possible with `expo-camera` + Open Food Facts API)
- Water intake tracking?
- Blood pressure / weight logging?
- Sharing progress with a caregiver or family member?
- Wearable integration (Apple Watch / Fitbit) for automatic walk tracking?
