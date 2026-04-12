# Coffeebara

Coffeebara is continuing forward inside the same repository.

Earlier work in this repository focused on cafe search, map exploration, place persistence, and recommendation-oriented assumptions built on top of Kakao Local API. That phase remains an important v1 milestone. It is not being erased, and its working assets still matter.

The current direction is more grounded and more personal:

**Coffeebara is now being shaped into a personal coffee archive and brewing record system.**

The goal is to help the user keep coffee records they actually want to revisit:

- beans
- brewing parameters
- tasting notes
- subjective impressions
- purchase places
- drink places
- personal preference tendencies over time

This project should feel like a personal coffee logbook with place context, not a public recommendation platform.

Product direction notes from the earlier phase are still kept in [product-direction-notes.md](./product-direction-notes.md). The working rules and current product framing are documented in [AGENTS.md](./AGENTS.md).

## How To Read This Repository

This repository should be read in continuity, not as a reset.

- v1 remains here as a documented implementation milestone
- the repository itself remains the main project
- the current direction reuses the existing technical assets where they still fit
- the product focus has changed from recommendation assumptions to personal archive value

In practice, that means existing place-search, map, persistence, and authentication-related groundwork still has value. Their role is changing, not disappearing.

## What Exists Today

The repository already contains working implementation around the earlier cafe exploration direction.

### Backend assets

- Spring Boot 4.0.5 + Java 21 + Gradle
- MariaDB + MyBatis based persistence structure
- Kakao Local API integration
- `GET /api/cafes/search`
- `GET /api/cafes/{placeId}`
- `GET /api/cafes/map`
- `GET /api/cafes/map/search`
- `POST /api/cafes`
- place upsert flow keyed by `kakao_place_id`
- freshness-based refresh flow for persisted place data

### Frontend assets

- Next.js based UI
- header + sidebar + main content layout
- Kakao Map based exploration screen
- keyword search and current-area search flow
- locale selection UI
- local state patterns and existing UI groundwork that can be reused

### Collaboration assets

- [AGENTS.md](./AGENTS.md)
- implementation constraints, product framing, and AI collaboration rules
- written records of what was validated, what changed, and why

## Current Product Direction

The repository is now being refocused toward a smaller and more durable product.

### Primary value

- store meaningful coffee records
- make brewing history easy to revisit
- preserve context about beans, places, and impressions
- support later reflection on personal preference patterns

### Product center

The center of the product is no longer recommendation logic.

The center is:

- bean records
- brew records
- place context
- tasting notes
- satisfaction and mood
- personal history

### Role of Kakao assets now

Kakao integration still matters, but for different reasons.

- Kakao login supports personal identity and archive continuity across devices
- Kakao Map supports selecting where a bean was purchased or where a coffee was consumed
- Kakao place data should be treated as reference data connected to personal records

It is no longer the main basis for recommendation candidate discovery.

## Early MVP Direction

The MVP should stay small and useful.

It should focus on:

- practical user identity flow
- bean record creation
- brewing record creation
- purchase place selection
- drink place selection
- record history view
- bean detail view
- record detail view
- editable tasting notes
- one mood color per record
- basic filtering and sorting

It should avoid early expansion into:

- public sharing
- social/community features
- recommendation engines
- scraping-heavy data collection
- AI-first product behavior

## Data Shape That Fits The New Direction

The current direction combines three kinds of information.

### 1. Objective bean data

- bean name
- roastery or shop
- origin
- region
- process
- roast date
- purchase date

### 2. Objective brewing data

- brewer
- dose
- water amount
- water temperature
- total brew time
- grind setting
- brewed timestamp

### 3. Subjective impression data

- aroma notes
- taste notes
- memo
- satisfaction rating
- mood color

This balance matters. The project should preserve real facts and real impressions without pretending one can replace the other.

## Mood Color

The mood color feature is part of the new identity of Coffeebara.

The UI may feel expressive and freeform, but stored values should still map to a limited meaningful palette so the data remains useful later. The point is not decoration alone. The point is to capture something about the coffee that plain text does not capture as well.

## AI Policy

AI is not the core product.

If added later, it should act as a lightweight reflection layer over accumulated records. Good uses include summarizing recurring preferences or identifying brewing conditions that often lead to higher satisfaction. It should not generate fake notes, replace real records, or become the main reason the product exists.

The archive must remain useful even without AI.

## Technical Stack

### Backend

- Java 21
- Spring Boot 4.0.5
- Gradle
- MyBatis
- MariaDB
- p6spy

### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4
- ESLint 9

## Project Structure

```text
coffeebara/
├─ src/
│  └─ main/
│     ├─ java/com/coffeebara/
│     └─ resources/
├─ frontend/
│  ├─ app/
│  ├─ public/
│  └─ package.json
├─ db/
│  └─ schema.sql
├─ AGENTS.md
├─ product-direction-notes.md
└─ README.md
```

## Run Notes

### Backend

Run from the repository root:

```bash
./gradlew bootRun
```

### Frontend

Run inside `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

## Summary

This repository still contains the earlier Kakao-based cafe exploration and persistence work, and that work remains useful. But the project is no longer being framed primarily as a recommendation platform.

The direction now is quieter and more personal: turning the existing Coffeebara codebase into a meaningful coffee archive where beans, brews, places, notes, and mood can be recorded and revisited over time.
