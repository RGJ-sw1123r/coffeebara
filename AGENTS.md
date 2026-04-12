# AGENTS.md

## Project identity

This project continues from the existing **Coffeebara** repository.

It does **not** move to a separate v2 repository.
It also does **not** preserve v1 through branch strategy.

Instead:

- the current repository remains the main project
- the earlier cafe exploration / recommendation prototype is preserved as **v1**
- the product direction is now being **refocused inside the same repository**

The current product direction is:

**a personal coffee archive and brewing record system**

This project should help the user record and reflect on:

- coffee beans
- brewing parameters
- tasting notes
- subjective impressions
- purchase places
- drinking places
- personal preference tendencies over time

The project should feel like a **personal coffee logbook with place context**, not a recommendation platform.

---

## Repository continuity rule

Do **not** treat the current repository as abandoned.

Do **not** create a symbolic “fresh start” by pretending the earlier work has no value.

The correct interpretation is:

- Coffeebara v1 already exists in this repository
- v1 focused on cafe exploration, storage, and recommendation-oriented assumptions
- those assumptions were reviewed and partially rejected
- the repository now continues forward with a new product focus

Important:
- preserve v1 as a documented milestone
- keep the continuity of the project
- reuse the working technical assets
- do not rely on branches as the main way to preserve v1
- preserve v1 through documentation, commit history, README framing, and repository continuity

---

## What v1 means in this repository

**v1** refers to the earlier Coffeebara direction:

- Kakao Local API based cafe search
- map exploration
- place persistence
- guest-first flow
- recommendation-oriented product assumptions

v1 should remain acknowledged as an important earlier phase of the project.

The repository should not erase that history.

However, v1 is **not** the current main direction anymore.

Its role now is:
- implementation foundation
- technical asset base
- product-learning milestone

---

## New product direction

The current direction of Coffeebara is:

**a personal brewing record and coffee archive system**

Primary value:
- help the user store meaningful coffee records they actually care about
- make brewing history easy to revisit
- preserve context about beans, places, and impressions
- make later reflection possible
- optionally support lightweight AI-based preference summaries later

This project should solve a real personal need first.

It should not pretend to be a public recommendation platform.

---

## What to preserve from the existing Coffeebara codebase

The following existing assets are worth keeping and reusing when practical:

- Kakao social login
- Kakao Map integration
- place search and place selection flow
- place master data handling using `kakao_place_id`
- Spring Boot + MyBatis + MariaDB base structure
- frontend app structure and current UI groundwork
- existing operational patterns such as caching, rate limiting, and structured persistence where relevant

These remain valuable even though the product definition has changed.

Their **role** changes, but their **technical value** remains.

---

## Role of Kakao login and Kakao Map in the new direction

### Kakao login
Kakao login remains valid.

Its role is now:
- personal account identity
- syncing records across browser/device usage
- protecting and restoring the user’s archive

It is **not** for social networking, community identity, or public review activity.

### Kakao Map
Kakao Map also remains valid.

Its role is now:
- selecting where a bean was purchased
- selecting where a coffee was consumed
- attaching place context to a record
- searching and saving coffee-related places as references

It is **not** for recommendation candidate discovery.

---

## Core product scope

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
Later, optionally add a lightweight AI feature that analyzes the user’s accumulated records and summarizes things like:

- what kinds of coffee they tend to like
- what brewing conditions tend to produce higher satisfaction
- what mood/color patterns appear repeatedly

The AI feature is **secondary**.
The core product must still be useful without AI.

---

## What this project is NOT

Do **not** turn this project into:

- a cafe recommendation platform
- a public review service
- a social media product
- a follower / like / feed system
- a large public discovery app
- a collaborative filtering system
- a scraping-heavy recommendation engine
- an AI gimmick product

Do **not** rebuild the failed assumptions from the earlier recommendation direction.

The value of this project should come from:
- personal records
- direct user input
- reflection and recall
- structured brewing history

---

## MVP definition

The MVP should remain small, useful, and realistic.

### MVP must include
- Kakao login or a practical user identity flow
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
- complex dashboarding in the early phase
- unnecessary integrations

---

## Data philosophy

This project should store three categories of data.

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
- brewed at timestamp

### 3. Subjective impression data
Examples:
- aroma notes
- taste notes
- memo
- satisfaction rating
- one selected mood color

The product should combine objective facts and subjective impressions without overcomplicating the model.

---

## Place context policy

Place context is part of the product, but it is **supporting context**, not the product center.

Places may be used for:
- where the bean was purchased
- where the coffee was consumed
- where a memorable experience happened

Reuse Kakao place data for:
- place name
- address
- coordinates
- place URL
- Kakao place id

Treat place records as **reference data** connected to personal records.

Do not treat place records as recommendation candidates.

---

## Mood color feature

The mood color feature is an important identity element of the new Coffeebara direction.

### Intent
Allow the user to record the overall feeling of a coffee by selecting one color from a circular color UI.

### Important rule
The visual UI may feel like free color selection, but stored values should map to a **limited meaningful palette**.

This means:
- visually: circular color picker / radial color selection
- internally: map the selected position to one semantic mood bucket

Example labels:
- bright_floral
- juicy_fruity
- berry_like
- winey
- herbal
- clean_cool
- nutty_balanced
- dull_flat

Store both:
- color value
- semantic label

This makes the feature expressive without destroying data usefulness.

---

## AI / LLM policy

LLM should only be added later as a **lightweight reflection layer**.

### Acceptable AI use
- summarize the user’s brewing history
- identify repeated preference patterns
- explain what kinds of coffee the user seems to prefer
- generate a short natural-language preference summary
- reflect recurring brewing conditions associated with high satisfaction

### Unacceptable AI use
- generating fake tasting notes
- replacing actual records
- acting as the main product value
- pretending to infer facts not present in the user’s own history
- reviving weak recommendation logic from the previous direction

### Rule
The core archive and logging experience must remain useful without AI.

AI is optional enhancement, not foundation.

---

## Suggested AI feature design

If AI is added later, the safest version is:

1. store all records normally
2. compute simple aggregates in application code first
3. send summarized patterns to the LLM
4. store the generated preference summary
5. show it as an optional insight feature

Possible AI output:
- “You seem to prefer brighter and cleaner coffees.”
- “Higher satisfaction appears more often around 90–91°C brews.”
- “Your records repeatedly favor floral/fruit-like impressions.”
- “You tend to enjoy coffees from specific shops or places.”

Do not send raw unbounded history every time.
Prefer:
- cached summary generation
- regeneration only when the archive changes meaningfully

---

## Design principles

- prefer usefulness over novelty
- prefer continuity over unnecessary restart
- prefer refactoring over symbolic reinvention
- prefer stable storage over flashy features
- prefer meaningful personal data over speculative intelligence
- prefer a product the user will genuinely return to

This project should feel:
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

- Prefer minimal changes over large refactors where possible.
- Reuse existing working structure when it still fits.
- Do not destroy current assets just because the product direction changed.
- Remove or replace only what no longer serves the new goal.
- Keep the codebase understandable.
- Avoid over-abstraction in early phases.
- Do not introduce unnecessary libraries.
- Build useful slices end-to-end.

When in doubt, ask:
**“Does this help turn the current Coffeebara codebase into a better personal coffee archive?”**

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
This is not “old project dead, new project from scratch.”
This is:
- current Coffeebara codebase
- product definition updated
- working assets reused
- recommendation assumptions removed
- brewing archive direction added

---

## Suggested early entity direction

### Place
Stores reference place data reused from Kakao.

Potential fields:
- id
- kakao_place_id
- place_name
- address_name
- road_address_name
- latitude
- longitude
- place_url

### Bean
Stores bean identity and purchase context.

Potential fields:
- id
- roastery_or_shop
- bean_name
- country
- region
- process
- roast_date
- purchase_date
- purchase_place_id
- memo

### BrewRecord
Stores one actual brewing or drinking record.

Potential fields:
- id
- bean_id
- brewed_at
- brewer
- dose_gram
- water_gram
- water_temp_celsius
- total_time_seconds
- grind_setting
- aroma_note
- taste_note
- satisfaction_rating
- mood_color_hex
- mood_color_label
- drink_place_id
- memo

### PreferenceSummary
Optional future AI-generated summary.

Potential fields:
- id
- generated_at
- summary_text
- summary_json
- based_on_record_count

---

## What success looks like

A successful Coffeebara after this direction change should let the user say:

- “I can keep using the same project without throwing everything away.”
- “I can record beans, brews, and places in one system.”
- “I can look back and compare my coffee experiences meaningfully.”
- “The color feature captures something text alone misses.”
- “The AI summary helps me reflect on my coffee preferences without pretending to replace my own judgment.”

---

## What failure looks like

- the project becomes another vague recommendation idea again
- the direction change causes unnecessary full rewrites
- useful existing assets are discarded for no reason
- the logging flow becomes annoying
- the AI feature becomes the center instead of the archive
- the color feature becomes decorative but useless
- the user stops wanting to use it personally

If the current Coffeebara repository becomes harder to use and harder to evolve after the direction change, something is wrong.

---

## Final rule

This project should continue by transforming the existing Coffeebara codebase into a meaningful personal coffee archive.

Every implementation decision should protect that continuity and that new goal.
