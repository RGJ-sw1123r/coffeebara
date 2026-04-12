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

**a personal coffee archive and brewing record system with cafe context**

The product should eventually help the user revisit:

- coffee beans
- brewing parameters
- tasting notes
- subjective impressions
- which cafe the bean came from
- which cafe the coffee was consumed at
- personal preference tendencies over time

The product should feel like a **personal coffee logbook with cafe context**, not a recommendation platform.

---

## Important current-state rule

Do **not** describe the current runtime as if member saved-cafe persistence were already fully migrated to the database.

That would be inaccurate.

As of the current codebase state:

- cafe search is active
- map-based cafe lookup is active
- auth and account persistence are active
- frontend saved-cafe state is currently local-state / local-storage centered
- guest saved-cafe behavior is currently local-storage centered
- member-to-saved-cafe relational persistence is **not yet** the active runtime path
- the old persistence-oriented interpretation has already been partially removed, not merely "planned for decoupling"

If documentation or generated text describes the current project as still heavily centered on place persistence, that description should be corrected.

---

## Repository continuity rule

Do **not** treat this repository as abandoned.

Do **not** create a symbolic "fresh start" by pretending the earlier work has no value.

The correct interpretation is:

- Coffeebara v1 already exists in this repository
- v1 focused on cafe exploration, favorite-style cafe accumulation, map usage, and recommendation-oriented assumptions
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
- favorite-style cafe saving / preference accumulation
- guest-first flow
- recommendation-oriented product assumptions

v1 remains an important earlier phase.

However, v1 is **not** the current main direction.

Its role now is:

- implementation milestone
- technical asset base
- product-learning milestone
- archived reference for what was kept, removed, or reinterpreted

---

## Current codebase reality

When you analyze or describe the repository, use the following interpretation.

### Active backend reality

The currently active backend scope is centered on:

- Kakao OAuth login
- user account upsert / profile handling
- auth status and guest flow
- cafe keyword search
- cafe detail lookup
- map-bounds cafe lookup
- keyword-in-bounds cafe lookup
- caching and rate limiting around search flows
- legacy cafe upsert/cache structure still present in code, but not fully reconnected as the current saved-cafe runtime

### Active frontend reality

The currently active frontend scope is centered on:

- login and locale flow
- app shell and map UI
- keyword search
- map-based browsing
- saved-cafe UI flow backed by local state / local storage
- lightweight place-profile tagging in the frontend state

### Inactive or non-primary runtime reality

Do **not** present these as active product-complete features:

- member saved-cafe DB persistence as a completed product feature
- guest-to-member saved-cafe migration as a completed product feature
- recommendation engine behavior
- bean record CRUD
- brew record CRUD
- completed personal archive flows

If legacy schema, mapper, or compatibility paths still exist in the repository, do not confuse their presence with active product scope.

---

## Current implementation direction

The current agreed next-step implementation direction is:

- reactivate the v1-origin cafe upsert path so cafe data can be persisted one row at a time into `cafe`
- use the `cafe` table as a Kakao place cache / master layer to reduce repeated API calls
- load cafe detail from DB first, and refresh from Kakao only when the cached row is stale
- move member saved-cafe relationships out of frontend local storage into a dedicated `user_saved_cafe` style table connected to `app_user`
- keep guest saved-cafe storage in local storage
- allow guests to save cafes locally, but do not allow guests to create real archive records
- when a guest selects a saved cafe from the left menu, route them to a sample/demo-style page instead of a real record flow
- build the sample page frontend first, then attach real archive features incrementally

Important interpretation:

- `cafe` is not the user-owned record itself
- `cafe` is the shared place cache / master data layer
- user ownership and save state belong in a separate table linked to `app_user`
- guest demo behavior is an intentional product decision, not a temporary bug

---

## Special note about cafe persistence

There may still be remnants of earlier persistence-oriented structure in the repository.

Interpret them carefully.

Rules:

- do not describe member saved-cafe DB persistence as already fully shipped when it is still being reintroduced
- do not say the app is still primarily running on a storage-first v1 runtime path
- do not frame the project as merely waiting for decoupling if removal has already progressed in the live path
- distinguish between **legacy remnants**, **compatibility leftovers**, and **active runtime behavior**
- distinguish clearly between:
  - `cafe` as place cache / master data
  - `user_saved_cafe`-style relations as member-owned saved cafes
  - guest local-storage behavior as guest-only temporary storage

A leftover endpoint, schema file, mapper, or helper method does **not** automatically mean the feature is active.

---

## Current product direction

The current direction of Coffeebara is:

**a personal brewing record and coffee archive system**

Primary value:

- help the user keep meaningful coffee records they actually care about
- make brewing history easy to revisit
- preserve context about beans, cafes, and impressions
- support later reflection on preference patterns
- optionally support lightweight AI-based summaries later

This project should solve a real personal need first.

It should not pretend to be a public recommendation platform.

---

## What to preserve from the existing codebase

These existing assets are worth keeping and reusing when practical:

- Kakao social login
- account persistence through `app_user`
- Kakao Map integration
- cafe search and cafe selection flow
- Spring Boot + MyBatis + MariaDB base structure
- frontend app structure and current UI groundwork
- caching and rate limiting patterns where still relevant

Their **role** changes, but their **technical value** remains.

---

## Current auth and account direction

Kakao login remains valid.

Its role is now:

- personal identity
- restoring and syncing the user's archive later
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

## Current cafe direction

Kakao Map and cafe search remain valid.

Their role is now:

- finding cafes
- selecting cafes
- attaching cafe context to future records
- keeping the cafe layer available as reference context
- reducing unnecessary Kakao API calls through place caching in `cafe`

They are **not** currently to be described as an active large-scale persistence pipeline.
They are also **not** to be framed as recommendation-candidate accumulation.

Cafes are context, not the product center.

When discussing data modeling, use this distinction:

- `cafe`: shared place cache / master table
- `user_saved_cafe`: member-specific saved cafe relation
- future record tables: user-owned archive data linked to cafes as context
- guest saved cafes: local-only convenience state, not durable account data

---

## Core scope

### Primary goal

Build a personal system where the user can eventually record:

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

## MVP direction

### Near-term active reality

Right now, the repository is closer to:

- auth/account groundwork
- cafe search groundwork
- map-based interaction groundwork
- frontend shell refinement
- archive-oriented product reframing
- sample/demo record-page groundwork for guest education
- member saved-cafe persistence redesign

### Future MVP should include

- practical identity flow
- member saved-cafe persistence linked to `app_user`
- bean record creation
- brewing record creation
- cafe selection for purchase context
- cafe selection for drinking context
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
- unnecessary integrations

Guest policy for MVP:

- guests may search and save cafes locally
- guests may view sample pages that demonstrate the intended archive experience
- guests may not create durable personal records until they use a real account

---

## Data philosophy

This project should eventually combine three kinds of data.

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
- prefer honest current-state description over inflated scope
- prefer meaningful personal data over speculative intelligence
- prefer a product the user will genuinely return to

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

## Final rule

This project should continue by transforming the existing Coffeebara codebase into a meaningful personal coffee archive.

Every implementation decision should protect that continuity, describe the current state honestly, and support that new goal.
