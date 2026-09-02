# MuscleMap

MuscleMap is a responsive anatomy and strength-training tool built with React, TypeScript, and Vite.

## What it includes

- Detailed interactive front and back maps with 89 anatomical regions
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

`check:data` verifies that every muscle has an exercise and every program item points to a valid exercise.

## Data and privacy

Workout history, preferences, and weekly completion are stored in the browser's `localStorage`. Clearing browser storage removes them.

## Anatomy artwork

The detailed anterior and posterior muscle vectors are provided by [body-muscles](https://github.com/vulovix/body-muscles), Copyright 2024 Ivan Vulović, under the Apache License 2.0. See `THIRD_PARTY_NOTICES.md`.
