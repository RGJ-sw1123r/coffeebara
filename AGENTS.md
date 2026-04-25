# AGENTS.md

## 1. Project interpretation

### Project identity

This project continues in the existing **Coffeebara** repository.

- the current repository remains the main project
- the earlier cafe exploration and recommendation-oriented phase may be referred to internally as **v1**
- the product direction is being refocused inside the same repository

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

### What v1 means in this repository

**v1** refers to the earlier Coffeebara direction:

- Kakao Local API based cafe search
- map exploration
- favorite-style cafe saving / preference accumulation
- guest-first flow
- recommendation-oriented product assumptions

v1 is an earlier phase, not the current main direction.

Its role now is:

- implementation milestone
- technical asset base
- product-learning milestone
- archived reference for what was kept, removed, or reinterpreted

### Repository continuity rule

The correct interpretation is:

- Coffeebara v1 already exists in this repository
- some v1-origin implementation still remains as preserved code, documentation, or technical assets
- those assumptions were reviewed and partially rejected
- the repository now continues forward with a different product center

- preserve v1 as a documented milestone when that context is useful
- keep repository continuity
- reuse working technical assets when they still fit
- do not rely on branches as the main preservation method
- preserve continuity through documentation, commit history, product-direction notes, internal working docs, and ongoing code reuse

### Documentation rule

When interpreting repository documents, use this distinction:

- `AGENTS.md` may use the term `v1` explicitly for internal interpretation
- `product-direction-notes.md` may mention the earlier phase when useful, but should emphasize the current product direction
- `README.md` should primarily describe the current product direction and current baseline runtime, and should not rely on `v1` framing as its main explanation

### Current product direction

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

## 2. Current runtime reality

As of the current codebase state:

- cafe search is active
- auth and account persistence are active
- cafe cache/master persistence into `cafe` is active
- member saved-cafe persistence into `user_saved_cafe` is active
- member cafe-linked record and note CRUD are active
- guest saved-cafe behavior is local-storage centered
- active archive-facing CRUD is now Prisma-based through frontend local routes
- the main remaining MyBatis boundaries are intentional exceptions, not unfinished migration by default

### Active backend reality

The currently active backend scope is centered on:

- Kakao OAuth login
- login-time `app_user` upsert / profile source handling
- auth status and guest flow
- cafe keyword search
- cafe detail lookup
- single-row or search-result cafe upsert into `cafe`
- DB-first cafe detail lookup with stale Kakao refresh
- caching and rate limiting around search flows
- place-cache logic reused to support the current cafe reference layer

Important interpretation:

- active saved-cafe, record, note, and attachment CRUD now run through frontend local routes backed by Prisma
- the backend is no longer the main runtime path for those archive-facing CRUD flows
- the main remaining MyBatis runtime boundaries are:
  - Kakao login-time `app_user` upsert inside the Spring Security flow
  - `cafe` cache/master upsert tied to Kakao place lookup and refresh handling
- those boundaries remain because moving them into the frontend/Next layer would require larger auth and ownership restructuring than the project currently needs

The repository may still contain map-related lookup paths, bounds-based search paths, and related compatibility logic.
Interpret those carefully.
Their presence does **not** automatically mean they define the current primary product baseline.

### Active frontend reality

The currently active frontend scope is centered on:

- login and locale flow
- app shell and current shell UI
- keyword search
- home search/map shared state managed through a narrow Zustand store
- member saved-cafe UI flow backed by frontend local routes and Prisma
- guest saved-cafe UI flow backed by local state / local storage
- member place detail page text-note flow backed by frontend local routes and Prisma
- member place detail page bean-record flow backed by frontend local routes and Prisma
- text-note create / edit / delete / reorder interactions in the place detail page
- bean-record create / edit / delete interactions in the place detail page
- bean-record image upload / preview / delete interactions backed by local routes, Prisma, and Spring media preprocessing
- member cafe-linked record detail / delete flow backed by frontend local routes and Prisma
- save-cafe delete-confirm modal instead of native browser confirm
- UI copy for the active shell / note flow should be interpreted through the locale message layer in `frontend/app/messages.js`
- lightweight place-profile tagging in the frontend state
- account menu summary UI for saved cafe count

Important interpretation:

- active CRUD migration is effectively complete for the current archive-facing UI
- new UI and new archive features should attach to Prisma by default
- bean-record image attachment upload and deletion are active in the current runtime

- the current Zustand usage is intentionally narrow
- Zustand is currently for home search/map shared state, not for every frontend domain
- `savedPlaces`, auth/account state, and broader AppShell concerns should not be moved into the home search/map store without a concrete reason
- page-local input UX state, timer refs, DOM refs, SDK refs, and map-internal rendering refs should remain local unless a real shared-ownership problem appears

Map UI, map browsing assets, and related place exploration code may still remain in the repository.
Do **not** treat them as the current primary UX baseline unless the active user flow clearly depends on them.

### Current data-model interpretation

When discussing data modeling, use this distinction:

- `cafe`: shared place cache / master table
- `user_saved_cafe`: member-specific saved cafe relation
- `cafe_record`: member-owned parent record layer for cafe-linked archive items
- `cafe_note`: member-owned cafe-linked text note prototype
- `media_asset`: local-file metadata table storing relative `storage_key`
- `media_attachment`: generic owner-link table between a domain owner and `media_asset`
- future record tables: user-owned archive data linked to cafes as context
- guest saved cafes: local-only convenience state, not durable account data

Important interpretation:

- `cafe` is not the user-owned record itself
- `cafe` is the shared place cache / master data layer
- user ownership and save state belong in a separate table linked to `app_user`
- `cafe_record` is the member-owned parent record layer for cafe-linked archive items
- `cafe_note` is an early member-owned text record layer, not the final archive model
- current attachment persistence is scoped to `CAFE_RECORD`, not to every future archive domain
- local file storage should use `app.media.storage-root` and persist only relative `storage_key` values
- text-note ordering and deletion should be interpreted through `cafe_record`, not as `cafe_note`-local concerns
- guest demo behavior is an intentional product decision, not a temporary bug

### Current auth and account direction

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

Important implementation boundary:

- login-time `app_user` upsert remains in Spring/MyBatis because it is part of the Kakao OAuth and Spring Security ownership boundary
- profile reads and edits used by the active frontend runtime can be handled outside that boundary

When updating auth flows, maintain this distinction:

- `nickname` is provider data
- `display_name` is the user-facing Coffeebara profile name

Do not collapse them again unless explicitly intended.

### Current cafe direction

Kakao Map and cafe search still have technical value.

Their role is now:

- finding cafes
- selecting cafes
- attaching cafe context to current or future records
- keeping the cafe layer available as reference context
- reducing unnecessary Kakao API calls through place caching in `cafe`

They are **not** currently to be described as the center of the product.
They are also **not** to be framed as recommendation-candidate accumulation.

Cafes are context, not the product center.

Important implementation boundary:

- `cafe` upsert remains in Spring/MyBatis because it is already stably coupled to Kakao place lookup, refresh, and cache/master handling
- new archive-facing CRUD should not be forced back through that boundary unless the feature genuinely depends on Kakao-side place synchronization

### Near-term active reality

Right now, the repository is closer to:

- auth/account groundwork
- cafe search groundwork
- archive-oriented product reframing
- frontend shell refinement
- active cafe cache/master persistence
- active member saved-cafe Prisma persistence
- active member cafe-linked record and text-note Prisma persistence
- guest sample/demo groundwork derived from the member note flow
- an archive-oriented interpretation of the existing place layer

---

## 3. Guardrails and non-goals

### Inactive or non-primary runtime reality

Do **not** present these as active product-complete features:

- guest-to-member saved-cafe migration as a completed product feature
- guest sample/demo page as a completed feature
- recommendation engine behavior
- brew record CRUD
- complete multi-record coffee archive domain
- completed personal archive flows

If legacy schema, mapper, endpoint, compatibility path, or helper method still exists in the repository, do not confuse its presence with active product scope.

### Special note about cafe persistence

Rules:

- do not describe member saved-cafe DB persistence as if it already means the archive product is complete
- do not say the app is still primarily running on a storage-first v1 runtime path
- do not frame the project as merely waiting for decoupling when active CRUD has already moved to Prisma
- distinguish between **legacy remnants**, **compatibility leftovers**, and **active runtime behavior**
- distinguish clearly between:
  - `cafe` as place cache / master data
  - `user_saved_cafe`-style relations as member-owned saved cafes
  - `cafe_record` as the shared parent layer for member-owned cafe-linked records
  - `cafe_note` as member-owned cafe-linked text notes
  - guest local-storage behavior as guest-only temporary storage

A leftover endpoint, schema file, mapper, or helper method does **not** automatically mean the feature is active.

### What this project is NOT

Do **not** turn this project into:

- a public recommendation or discovery platform
- a public review or social product
- a follower / like / feed system
- a scraping-heavy recommendation system
- an AI-first product

Do **not** rebuild the failed assumptions from the recommendation phase.

The value of this project should come from:

- personal records
- direct user input
- reflection and recall
- structured brewing history

### Guest policy

Guest policy for MVP and current interpretation:

- guests may search and save cafes locally
- guests may view sample pages that demonstrate the intended archive experience
- guests may not create durable personal records until they use a real account

Guest mode should be treated as intentional preview behavior, not as durable archive ownership.

### AI / LLM policy

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

### Design principles

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

## 4. Working rules

### Core scope

#### Primary goal

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

#### Secondary goal

Later, optionally add a lightweight AI feature that analyzes accumulated records and summarizes things like:

- what kinds of coffee the user tends to like
- what brewing conditions tend to produce higher satisfaction
- what mood/color patterns appear repeatedly

The AI feature is **secondary**.
The archive must still be useful without AI.

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

### Data philosophy

This project should eventually combine three kinds of data.

#### 1. Objective bean data

Examples:

- bean name
- roastery or shop
- origin
- region
- process
- roast date
- purchase date

#### 2. Objective brewing data

Examples:

- brewer
- dose
- water amount
- water temperature
- total brew time
- grind setting
- brewed-at timestamp

#### 3. Subjective impression data

Examples:

- aroma notes
- taste notes
- memo
- satisfaction rating
- one selected mood color

The product should combine objective facts and subjective impressions without overcomplicating the model.

### Mood color feature

The mood color feature is an important identity element of the current Coffeebara direction.

#### Intent

Allow the user to record the overall feeling of a coffee by selecting one color from a circular color UI.

#### Important rule

The UI may feel like free color selection, but stored values should map to a **limited meaningful palette**.

Store both:

- color value
- semantic label

### What to preserve from the existing codebase

These existing assets are worth keeping and reusing when practical:

- Kakao social login
- account persistence through `app_user`
- Kakao Map integration
- cafe search and cafe selection flow
- Spring Boot + MariaDB base structure
- Prisma-based archive CRUD structure in the frontend local-route layer
- frontend app structure and current UI groundwork
- caching and rate limiting patterns where still relevant

Their **role** changes, but their **technical value** remains.

### Development style

- Prefer minimal changes over large refactors where practical.
- Reuse working structure when it still fits.
- Do not destroy current assets just because the product direction changed.
- Remove or replace only what no longer serves the new goal.
- Keep the codebase understandable.
- Avoid over-abstraction too early.
- Do not introduce unnecessary libraries, but Prisma is an explicitly allowed exception for the current database-access direction.
- Active archive-facing CRUD has already moved to Prisma.
- New UI and new archive features should default to Prisma unless they clearly belong to an intentional Spring/Kakao boundary.
- Keep MyBatis only where it is structurally justified, especially:
  - Kakao login-time `app_user` upsert in Spring Security
  - `cafe` cache/master upsert tied to Kakao place synchronization
- Do not widen Zustand usage unless it clearly reduces split ownership or prop drilling in an active user flow.
- Build useful slices end-to-end.

When in doubt, ask:

**"Does this help turn the current Coffeebara codebase into a better personal coffee archive?"**

If the answer is no, do not prioritize it.

### Encoding and multilingual text handling

- Never judge Korean or Japanese text corruption from terminal rendering alone.
- When editing files that contain non-ASCII text, read and write them only with UTF-8-safe tooling.
- Assume NFC normalization for all text files.
- Before editing any file containing Korean or Japanese text, verify the file is valid UTF-8 and preserve its existing normalization form unless explicitly asked to normalize.
- If a patch fails on a non-ASCII file, do not retry with broad text replacement; inspect the file with Python and make a minimal exact edit.
- Never rewrite an entire multilingual file just to change one line.
- For multilingual content, prefer line-precise edits based on exact file contents read via Python.

### Commit message policy

When I ask you to commit or push, generate the commit message in Korean in this exact structure:

<type>: <short Korean summary>

- <detail 1>
- <detail 2>
- <detail 3>
- <detail 4>

Rules:
- Use conventional commit types such as feat, fix, refactor, docs, style, test, chore.
- Write the subject line in Korean.
- Add 1 to 4 concise bullet points in Korean describing the concrete changes.
- Keep the summary and bullet points specific and ready to use without further editing.
- Do not add extra explanations outside the commit message.

### Final rule

This project should continue by transforming the existing Coffeebara codebase into a meaningful personal coffee archive.

Every implementation decision should protect that continuity, describe the current state honestly, and support that new goal.
