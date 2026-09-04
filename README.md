# MuscleMap

MuscleMap is a responsive anatomy and strength-training tool built with React, TypeScript, and Vite.

## What it includes

- Detailed interactive front and back muscle maps with traced muscle overlays
- Mobile-first exact-target selection for muscle heads, fiber regions, and component muscles
- Complete English and Arabic interfaces with persistent language choice and native RTL layout
- Search across 34 muscle regions and 66 exercises
- Exercise setup cues and common-mistake guidance
- Four-day upper/lower program with weekly completion tracking
- Validated workout logging in kilograms or pounds
- Per-exercise working-weight and volume charts
- Searchable history with reversible deletion
- Device-local storage with no account or backend required

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run check:data
npm run build
```

`check:data` verifies that every target has structured anatomy metadata and an exercise, every program item points to a valid exercise, and every muscle and exercise has Arabic content.

## Data and privacy

Workout history, preferences, and weekly completion are stored in the browser's `localStorage`. Clearing browser storage removes them.

## Anatomy artwork

The illustrated body artwork and traced muscle masks are adapted from
[js-rich-body-highlighter](https://github.com/crmapache/js-rich-body-highlighter),
Copyright 2026 js-rich-body-highlighter contributors, under the MIT License.
The source and license notice are recorded in `THIRD_PARTY_NOTICES.md`.
