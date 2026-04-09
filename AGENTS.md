# AGENTS.md

## Project status
- Root backend: Spring Boot 4.0.5, Java 21, Gradle
- Frontend app: Next.js under `frontend/`
- Current phase: guest-first cafe collection and persistence phase
- Backend and frontend are partially integrated
- Current verified integration is limited to cafe sync and persistence-related flows
- Social login, account-based favorite persistence, recommendation ranking, attribute extraction, and LLM-based analysis are not implemented yet

## Working style
- This project is developed through vibe coding.
- Generate a usable draft first, then I review and refine it manually.
- Prefer minimal changes over large refactors.
- Do not rewrite working code without a clear reason.
- Keep the existing code flow when possible.

## Backend preferences
- Prefer MyBatis or explicit SQL over JPA/Hibernate.
- Avoid ORM-centered design unless explicitly requested.
- Favor transparent query flow and predictable SQL over abstraction-heavy persistence layers.
- Prefer numeric column types for coordinates and queryable fields.
- Avoid runtime schema mutation during normal startup/runtime flow.

## Frontend preferences
- The front UI layout should follow a YouTube-style layout direction.
- Prefer a familiar content-first structure with header, sidebar, and main content area.
- Reuse YouTube-like information hierarchy only.
- Do not copy YouTube branding, icons, colors, or wording literally.
- Do not redesign the overall layout direction unless explicitly requested.

## Domain mapping
- Preferred cafes should be treated like subscribed channels in a YouTube-style experience.
- Cafe recommendation cards should play the role of content cards in the main feed.
- The UI should borrow the familiarity of YouTube, but the domain meaning must stay coffee-oriented.
- Do not copy YouTube literally; adapt its layout and interaction patterns to the cafe recommendation domain.

## Repository structure rules
- Keep backend under the repository root project.
- Keep frontend inside `frontend/`.
- Do not change project structure without a clear reason.
- Do not introduce unnecessary libraries.
- Run Codex from the repository root when possible so it can see both backend and frontend context.
- The repository root is not the frontend app directory.
- Frontend commands must be executed inside `frontend/`.
- Do not assume `npm run dev` works from the repository root.

## Encoding and text handling rules
- Treat UTF-8 as the default encoding for text files.
- Do not trust PowerShell console output alone when checking Korean or Japanese text.
- Verify the source file directly when encoding looks suspicious.
- When reading or writing text through scripts or shell commands on Windows, prefer explicit UTF-8 handling.
- If text appears mojibake-corrupted, replace the affected strings or rewrite the file in UTF-8 instead of copying garbled console output back into the source.
- Prefer centralizing UI copy in dedicated message files when possible so multilingual text can be reviewed and fixed in one place.

## Git preferences
- Write commit messages in Korean.

## Secrets and config rules
- Never hardcode API keys, OAuth secrets, database credentials, or session secrets.
- Use environment variables or example config files only.
- Do not commit real secret values.
- Move environment-specific settings out of source code when practical.

## Verification rules
- After backend changes, run a relevant backend verification command before claiming completion.
- After frontend changes, run a relevant frontend verification command before claiming completion.
- Prefer the smallest meaningful verification command for the files changed.
- Do not claim integration is complete unless it has actually been verified.

## Commands
- Backend run: `./gradlew bootRun`
- Frontend run: `cd frontend && npm install && npm run dev`
- Frontend build: `cd frontend && npm run build`
- Frontend lint: `cd frontend && npm run lint`

## Frontend-only work before account integration
- Frontend layout and UI work can proceed independently when account/auth integration is not available yet.
- Do not block frontend work waiting for social login or account DB models.
- Use local mock data or localStorage when account-specific backend endpoints do not exist yet.
- Do not assume account integration exists unless it is explicitly implemented.

## Current implementation direction
For now, focus on:
- cafe data collection
- cafe master data persistence
- nearby cafe candidate collection
- guest-first usage using localStorage on the frontend

Do not implement the following yet unless explicitly requested:
- social login
- user account DB model
- guest session DB model
- feature extraction
- mood/tag analysis
- recommendation ranking logic
- LLM processing
- recommendation explanation generation

If any future design note below conflicts with the current implementation direction, the current implementation direction takes precedence.

## Current completion status
- Preferred cafe sync: completed
- DB persistence and 30-day refresh flow: completed
- Nearby cafe collection on preferred cafe save: completed
- Separate recommendation candidate relation table: not started
- Feature extraction / recommendation scoring / LLM analysis: not started
- User-specific favorite cafe DB model: not started
- Social login: not started

## Current implementation snapshot
- `GET /api/cafes/search`
  - Kakao keyword search based
  - current fetch cap: up to 3 pages / up to 45 results
  - current behavior: search results are upserted into `cafe` before response returns
  - current cache: in-memory TTL cache for repeated search parameters
- `GET /api/cafes/map` / `GET /api/cafes/map/search`
  - current behavior: current map bounds queries also upsert collected cafes into `cafe`
  - frontend exposes a current-area search action on top of the map
  - current-area search clears the keyword input/query and keeps map focus in the current bounds
- Search cache
  - property-based TTL
  - current default is 10 seconds
- CORS
  - current behavior: allowed origins are property-based, not hardcoded
  - current property: `app.cors.allowed-origins`
- Frontend locale
  - current locale selector: `KO / EN / JA`
  - current behavior: UI copy is connected through `frontend/app/messages.js`
  - current scope: header, sidebar, map section, bottom panels, toast, loading, and error copy
  - current limitation: cafe names, addresses, and provider detail data still come from Kakao source data and are not translated
- Frontend map search UX
  - current area search button is locale-aware
  - result count cards are shown in the bottom panel, not duplicated on the map header
  - over-limit toast is split by source:
    - keyword search: suggest adding a region
    - current-area search: suggest adjusting the map or using keyword search
  - empty keyword submit shows an input guidance toast instead of sending a request
- Preferred cafe save
  - current entry point: `POST /api/cafes`
  - current behavior: upsert selected cafe, then collect nearby cafes and upsert them into `cafe`
- Nearby cafe collection
  - current trigger: preferred cafe save
  - current cap: up to 3 pages / up to 45 nearby cafes
  - current storage: `cafe` table only
- Cafe schema
  - unique key: `kakao_place_id`
  - freshness fields exist
  - current coordinate columns are still string-based, not numeric

## Guest-first policy
- The current product should behave as a guest-first service.
- Guest favorite cafes should be stored in frontend localStorage, not in DB.
- Do not create guest session tables or guest favorite tables in DB for the current phase.
- Guest data is browser-local and device-local by design.
- Clearing browser storage may remove guest favorites, and that is acceptable in the current phase.
- The server must not trust localStorage values blindly; validate request inputs on every API boundary.
- When social login is introduced later, account favorites may then be persisted to DB.
- If needed later, localStorage guest favorites may be migrated once into the logged-in account favorites table.

## LocalStorage rules
- Use localStorage only for guest preference state and UI convenience state.
- Do not store secrets, access tokens, or sensitive personal data in localStorage.
- Prefer a versioned key format so future migration is easier, for example:
  - `coffeebara.guestFavorites.v1`
- Keep the stored structure simple and stable.
- Prefer storing lightweight favorite references rather than large duplicated payloads when possible.
- When schema changes, add migration or reset handling instead of silently breaking old local data.

## Active implementation details

### 1. Preferred cafe sync
When a user adds a cafe to `내 취향 카페` in the frontend:
- store the guest favorite list in localStorage
- sync the selected cafe to the backend as needed for cafe master persistence / refresh / nearby collection flow

Use Kakao Local API as the source of truth for cafe data.

Persist the following fields for each cafe in the backend master cafe table:
- `kakao_place_id`
- `name`
- `category_name`
- `phone`
- `address_name`
- `road_address_name`
- `latitude`
- `longitude`
- `place_url`

Status: completed

### 2. DB persistence and refresh policy
Store cafe master data in the database.

Add a freshness column such as `last_fetched_at`.

If the stored cafe data is older than 30 days, call Kakao Local API again and refresh the DB row before using it.

Use Kakao place ID as the unique identifier when possible.

Status: completed

### 3. Nearby cafe candidate collection
When a preferred cafe is saved, fetch nearby cafes from Kakao Local API based on that cafe's coordinates.

For the current phase:
- collect up to 45 nearby cafes per preferred cafe based on the current Kakao paging cap used by the implementation
- save them to the DB as candidate/master cafe data
- avoid duplicate inserts for the same Kakao place ID

Status: partially completed
- Nearby cafe collection on preferred cafe save is implemented.
- Collected nearby cafes are currently upserted into the `cafe` table.
- A separate recommendation candidate relation table is not being used in the current phase.

### 4. Current recommendation request model
- The frontend may use guest favorites from localStorage as the source for recommendation requests.
- The backend should treat recommendation input as request data, not as durable guest account data.
- Do not introduce guest DB persistence only to support current recommendation flows.

### 5. Out of scope for now
Do not implement the following yet:
- social login
- account/session persistence
- guest DB session model
- guest favorite DB table
- feature extraction
- mood/tag analysis
- recommendation ranking logic
- LLM processing
- public popularity aggregation
- provider-level multilingual place data rollout

## Future design reference only
The sections below are architecture notes for future phases.

Do not implement them unless I explicitly request that phase.

These notes are meant to guide future design discussions, not current execution.

## Planned work items

### 1. Social login and minimal identifier storage
- Use OAuth 2.0 and, when available, OpenID Connect as the default authentication model.
- Do not store unnecessary personal profile data.
- Persist only minimal identifiers in DB:
  - `provider` as extensible string
  - `subject_hash` as HMAC-SHA256 of OIDC `sub` or provider user id using a server-side secret
  - optional `created_at`
  - optional `last_login_at`
- Do not store raw provider user ids when hashed identifiers are sufficient.

### 2. Transition from guest-first mode to account mode
- Keep guest favorites in localStorage before login is introduced.
- After login/account support is added, persist account favorites to DB.
- Do not backfill guest data to DB automatically unless explicitly implemented.
- If migration is added, treat it as a one-time import from localStorage to the user favorites table.
- Guest mode may continue to exist even after login support is added, but it should remain localStorage-based unless explicitly redesigned.
- When guest mode is visible in the UI later, clearly state that personal information and user coordinates are not stored in DB.

### 3. CORS externalization
- Current localhost-specific CORS configuration should be moved to application properties.
- Avoid hardcoded `localhost:3000` assumptions so deployment config is less error-prone.

### 4. Cafe table and map-query improvements
- Promote `lat` / `lng` from string-like storage to numeric types suitable for range queries.
- Add a composite bounding-box-friendly index such as `(lat, lng)`.
- Add DB-backed map bounds query support.
- Current schema still stores cafe coordinates as strings, so this remains a pending alignment task.
- Treat this as a high-priority improvement because it improves recommendation quality, cost, and map performance.

### 5. Remove runtime ALTER behavior
- Avoid runtime schema mutation during normal app startup/runtime flow.
- Prefer explicit schema migration or managed initialization paths instead.

### 6. API responsibility split after account introduction
- Keep cafe data endpoints under `/api/cafes/*`.
- After account support exists, split preference/recommendation responsibilities into dedicated endpoints:
  - `/api/me/favorites`
  - `/api/recommendations`
- Do not introduce `/api/guest/favorites` backed by DB unless explicitly requested later.
- Guest-mode requests may continue to send favorite references directly from localStorage-backed client state.

### 6-1. Map / provider abstraction direction
- Current implementation is Kakao-specific in both map rendering and place data collection.
- If provider switching is needed later, prefer introducing:
  - a `PlaceProvider` abstraction on the backend
  - a `MapAdapter` abstraction on the frontend
- Do not assume OpenLayers alone solves provider switching.
- Keep this as a future refactor only; do not implement provider abstraction unless explicitly requested.

### 7. Crawling / scraping and enrichment strategy
- Keep Kakao Local API as the primary source of truth for cafe collection.
- Use scraping only for enrichment fields needed for recommendations.
- Respect `robots.txt`, site terms, and legal constraints.
- Preserve reproducibility by storing source snapshots or source hashes, for example in `cafe_source_snapshots`.

Recommended operating model:
- 1st collection: Kakao Local API
  - keyword/category search
  - on-demand search plus periodic refresh of popular areas/cafes
- 2nd enrichment: official cafe websites or publicly allowed menu/info pages
  - only for robots-allowed, non-login-required pages
  - lower-frequency refresh such as every 7 to 30 days
- Use standard crawling infrastructure when scale grows:
  - BeautifulSoup for simple static parsing
  - browser rendering only when necessary
  - Scrapy for scheduling, retry, rate limiting, and pipelines

### 8. Legal / compliance checklist
- Respect `robots.txt`.
- Avoid storing or redistributing copyright-sensitive expressive content such as long review text or images.
- Normalize and store factual attributes instead.
- Avoid building large-scale copy/republication behavior.
- Store source provenance and keep request volume controlled.
- Exclude personal data such as reviewer nicknames or user-generated identity information from storage.

### 9. Cafe attribute extraction model
- Proposed attribute groups:
  - VIBE: `vibe_cozy`, `vibe_quiet`, `vibe_view`
  - BREW: `brew_handdrip`, `brew_espresso`
  - WORK: `work_good`, `work_outlet`
  - DESSERT: `dessert_good`, `dessert_cake`
  - ETC: `pet_friendly`, `parking`
- Recommended persistence:
  - store scores in `cafe_attribute_map.score`
  - store lightweight evidence labels in `cafe_attribute_map.evidence`
  - keep raw payload or payload hash in `cafe_source_snapshots`

### 10. Recommendation algorithm MVP
- Input:
  - localStorage guest favorites in the current phase
  - `user_favorite_cafes` after account mode is implemented
- Candidate pool:
  - `cafes` table
  - optionally filtered by same administrative area, nearby radius, or recent collection
- Scoring:
  - attribute-vector similarity
  - distance penalty
  - optional popularity adjustment later
- Output:
  - top-N cafes with explanation of why they were recommended

Practical MVP scoring idea:
- `user_profile[attr] = Σ favorite_cafe_attribute_score`
- `score(cafe) = cosine(user_profile, cafe_vector) - β*distance_km`
- After account scale grows, popularity terms can be added separately.
- Candidate quality can improve immediately by limiting recommendation candidates to areas near preferred cafes.

### 11. Proposed DB schema expansion for account phase
- `users`
  - internal user key only
- `user_identities`
  - minimal identity storage with `provider` and `subject_hash`
  - unique `(provider, subject_hash)`
- `auth_sessions`
  - store only hashed session tokens in DB
- `cafes`
  - continue as master cafe pool
  - migrate `lat/lng` to numeric columns
- `cafe_source_snapshots`
  - source payload or source hash for reproducibility/audit
- `cafe_attributes`
  - attribute dictionary such as `vibe_cozy`, `brew_handdrip`
- `cafe_attribute_map`
  - scored attribute mapping per cafe
- `user_favorite_cafes`
  - authenticated user favorites
