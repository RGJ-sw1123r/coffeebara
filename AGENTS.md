# AGENTS.md

## Project identity

This project continues from the existing **Coffeebara** repository.

It does **not** move to a separate v2 repository.
It does **not** preserve v1 mainly through branch strategy.

Instead:

- the current repository remains the main project
- the earlier cafe exploration and recommendation-oriented prototype is preserved as **v1**
- the product direction is being refocused **inside the same repository**

The current direction is:

**a personal coffee archive and brewing record system**

The product should help the user record and revisit:

- coffee beans
- brewing parameters
- tasting notes
- subjective impressions
- purchase places
- drinking places
- personal preference tendencies over time

The product should feel like a **personal coffee logbook with place context**, not a recommendation platform.

---

## Repository continuity rule

Do **not** treat this repository as abandoned.

Do **not** create a symbolic "fresh start" by pretending the earlier work has no value.

The correct interpretation is:

- Coffeebara v1 already exists in this repository
- v1 focused on cafe exploration, storage, map usage, and recommendation-oriented assumptions
- those assumptions were reviewed and partially rejected
- the repository now continues forward with a new product focus

Important:

- preserve v1 as a documented milestone
- keep repository continuity
- reuse working technical assets when they still fit
- do not rely on branches as the main preservation method
- preserve continuity through documentation, commit history, README framing, and ongoing code reuse

---

## What v1 means in this repository

**v1** refers to the earlier Coffeebara direction:

- Kakao Local API based cafe search
- map exploration
- place persistence
- guest-first flow
- recommendation-oriented product assumptions

v1 remains an important earlier phase.

However, v1 is **not** the current main direction.

Its role now is:

- implementation foundation
- technical asset base
- product-learning milestone

---

## Current product direction

The current direction of Coffeebara is:

**a personal brewing record and coffee archive system**

Primary value:

- help the user keep meaningful coffee records they actually care about
- make brewing history easy to revisit
- preserve context about beans, places, and impressions
- support later reflection on preference patterns
- optionally support lightweight AI-based summaries later

This project should solve a real personal need first.

It should not pretend to be a public recommendation platform.

---

## What to preserve from the existing codebase

These existing assets are worth keeping and reusing when practical:

- Kakao social login
- Kakao Map integration
- place search and place selection flow
- place master data using `kakao_place_id`
- Spring Boot + MyBatis + MariaDB base structure
- frontend app structure and current UI groundwork
- existing operational patterns such as caching, rate limiting, and structured persistence where relevant

Their **role** changes, but their **technical value** remains.

---

## Current auth and account direction

Kakao login remains valid.

Its role is now:

- personal identity
- restoring and syncing the user's archive
- protecting user-owned records

It is **not** for social identity, public review activity, or community features.

The current auth/account implementation includes:

- Kakao OAuth login through Spring Security
- automatic sign-up on first successful Kakao login
- local `app_user` storage keyed by `(auth_provider, provider_user_id)`
- `display_name` as the service-facing name
- `nickname` as the provider-facing raw Kakao nickname
- profile image support in the header
- `display_name` editing from the account menu
- logout that, for Kakao users, can include Kakao account logout for shared environments

When updating auth flows, maintain this distinction:

- `nickname` is provider data
- `display_name` is the user-facing Coffeebara profile name

Do not collapse them again unless explicitly intended.

---

## Current place direction

Kakao Map remains valid.

Its role is now:

- selecting where a bean was purchased
- selecting where a coffee was consumed
- attaching place context to a record
- saving coffee-related places as references

It is **not** for recommendation candidate discovery.

Places are supporting context, not the product center.

---

## Core scope

### Primary goal

Build a personal system where the user can record:

- which bean they used
- where they bought it
- where they drank it
- brewing method
- water temperature
- brew time
- dose / water amount
- aroma notes
- taste notes
- overall satisfaction
- one selected color representing the feeling of the coffee

### Secondary goal

Later, optionally add a lightweight AI feature that analyzes accumulated records and summarizes things like:

- what kinds of coffee the user tends to like
- what brewing conditions tend to produce higher satisfaction
- what mood/color patterns appear repeatedly

The AI feature is **secondary**.
The archive must still be useful without AI.

---

## What this project is NOT

Do **not** turn this project into:

- a cafe recommendation platform
- a public review service
- a social media product
- a follower / like / feed system
- a public discovery app
- a collaborative filtering system
- a scraping-heavy recommendation engine
- an AI gimmick product

Do **not** rebuild the failed assumptions from the recommendation phase.

The value of this project should come from:

- personal records
- direct user input
- reflection and recall
- structured brewing history

---

## MVP definition

### MVP must include

- Kakao login or another practical identity flow
- bean record creation
- brewing record creation
- purchase place selection
- drink place selection
- brewing history view
- bean detail view
- record detail view
- editable tasting notes
- one color-based mood selection per record
- basic filtering and sorting

### MVP should NOT include

- public sharing
- recommendation engine
- scraping pipelines
- social/community features
- complex dashboards too early
- unnecessary integrations

---

## Data philosophy

This project should store three kinds of data.

### 1. Objective bean data

Examples:

- bean name
- roastery or shop
- origin
- region
- process
- roast date
- purchase date

### 2. Objective brewing data

Examples:

- brewer
- dose
- water amount
- water temperature
- total brew time
- grind setting
- brewed-at timestamp

### 3. Subjective impression data

Examples:

- aroma notes
- taste notes
- memo
- satisfaction rating
- one selected mood color

The product should combine objective facts and subjective impressions without overcomplicating the model.

---

## Mood color feature

The mood color feature is an important identity element of the current Coffeebara direction.

### Intent

Allow the user to record the overall feeling of a coffee by selecting one color from a circular color UI.

### Important rule

The UI may feel like free color selection, but stored values should map to a **limited meaningful palette**.

That means:

- visually: circular color picker or radial color selection
- internally: map the selected position to a semantic mood bucket

Examples:

- `bright_floral`
- `juicy_fruity`
- `berry_like`
- `winey`
- `herbal`
- `clean_cool`
- `nutty_balanced`
- `dull_flat`

Store both:

- color value
- semantic label

---

## AI / LLM policy

LLM usage should only be added later as a **lightweight reflection layer**.

### Acceptable AI use

- summarize brewing history
- identify repeated preference patterns
- explain what kinds of coffee the user seems to prefer
- generate a short preference summary
- reflect recurring brewing conditions associated with high satisfaction

### Unacceptable AI use

- generating fake tasting notes
- replacing actual records
- acting as the main product value
- pretending to infer facts not present in user history
- reviving recommendation logic from the old direction

### Rule

The core archive and logging experience must remain useful without AI.

AI is optional enhancement, not foundation.

---

## Design principles

- prefer usefulness over novelty
- prefer continuity over unnecessary restart
- prefer refactoring over symbolic reinvention
- prefer stable storage over flashy features
- prefer meaningful personal data over speculative intelligence
- prefer a product the user will genuinely return to

The project should feel:

- personal
- deliberate
- tactile
- calm
- coffee-focused

Avoid making it feel like:

- a recommendation startup demo
- social media
- public review software
- AI theater
- generic CRUD with no identity

---

## Development style

- Prefer minimal changes over large refactors where practical.
- Reuse working structure when it still fits.
- Do not destroy current assets just because the product direction changed.
- Remove or replace only what no longer serves the new goal.
- Keep the codebase understandable.
- Avoid over-abstraction too early.
- Do not introduce unnecessary libraries.
- Build useful slices end-to-end.

When in doubt, ask:

**"Does this help turn the current Coffeebara codebase into a better personal coffee archive?"**

If the answer is no, do not prioritize it.

---

## Technical direction

### Backend

- Java
- Spring Boot
- MyBatis preferred over ORM-heavy design
- transparent SQL flow
- practical schema design
- reliable storage of user-owned records
- reuse existing persistence patterns when practical

### Frontend

- modern, clean UI
- easy record creation flow
- record-first interaction model
- place selection should feel natural
- mood color selection should feel satisfying but not noisy

### Migration mindset

This is not "old project dead, new project from scratch."

This is:

- current Coffeebara codebase
- updated product definition
- reused working assets
- removed recommendation assumptions
- added brewing archive direction

---

## Current schema direction

### `cafe`

Reference place data reused from Kakao.

Current important fields include:

- `kakao_place_id`
- `place_name`
- `address_name`
- `road_address_name`
- `latitude`
- `longitude`
- `place_url`

### `app_user`

Current user/account table.

Important fields:

- `id`
- `auth_provider`
- `provider_user_id`
- `nickname`
- `display_name`
- `profile_image_url`
- `role`
- `created_at`
- `updated_at`
- `last_login_at`

When extending user data, keep the separation between provider profile data and Coffeebara-owned profile data.

### Suggested future entities

#### Bean

- `id`
- `roastery_or_shop`
- `bean_name`
- `country`
- `region`
- `process`
- `roast_date`
- `purchase_date`
- `purchase_place_id`
- `memo`

#### BrewRecord

- `id`
- `bean_id`
- `brewed_at`
- `brewer`
- `dose_gram`
- `water_gram`
- `water_temp_celsius`
- `total_time_seconds`
- `grind_setting`
- `aroma_note`
- `taste_note`
- `satisfaction_rating`
- `mood_color_hex`
- `mood_color_label`
- `drink_place_id`
- `memo`

#### PreferenceSummary

- `id`
- `generated_at`
- `summary_text`
- `summary_json`
- `based_on_record_count`

---

## What success looks like

A successful Coffeebara should let the user say:

- "I can keep using the same project without throwing everything away."
- "I can record beans, brews, and places in one system."
- "I can look back and compare my coffee experiences meaningfully."
- "The color feature captures something text alone misses."
- "The AI summary helps me reflect on my coffee preferences without replacing my judgment."

---

## What failure looks like

- the project becomes another vague recommendation idea again
- the direction change causes unnecessary full rewrites
- useful assets are discarded for no reason
- the logging flow becomes annoying
- the AI feature becomes the center instead of the archive
- the color feature becomes decorative but useless
- the user stops wanting to use it personally

If the current Coffeebara repository becomes harder to use and harder to evolve after the direction change, something is wrong.

---

## Final rule

This project should continue by transforming the existing Coffeebara codebase into a meaningful personal coffee archive.

Every implementation decision should protect that continuity and that new goal.
