# Coffeebara Product Direction Notes

> Korean version: [product-direction-notes.ko.md](./product-direction-notes.ko.md)

## 1. Starting Point

Coffeebara began from a simple desire:
while exploring and savoring coffee, I wanted to identify the kinds of cafes I personally prefer, and even in unfamiliar domestic areas, find the kind of cafe I would want without spending excessive effort.

That was the starting point of the earlier product direction.

At the time, the product assumption was that place search, saved cafes, preference signals, and later LLM support could grow into a personal cafe recommendation product.

Internally, we refer to that earlier phase as **v1**.

## 2. Why The Direction Changed

The direction changed because the recommendation idea was easier to imagine than to support well.

The main issues were:

- Kakao place data was useful for search and reference, but too thin for durable recommendation quality
- user preference input alone was not enough to make recommendations feel convincing
- stronger recommendation quality would require additional item-side data that was not naturally available
- crawling, scraping, or LLM enrichment could help later, but none of them justified the product on their own

In short, the recommendation direction depended too much on data that was weak, costly, or unstable.

## 3. What Remains From v1

The earlier work was not wasted.

Its results remain in the repository as preserved exploration-related implementation and archive material, and they still provide useful technical assets.
Some of that earlier work also remains in `docs/archive/`.

That earlier phase is no longer the baseline of the current product, but its technical outcomes are still reusable when needed.

What still carries forward:

- Kakao login
- place search and place persistence
- `kakao_place_id` based place handling
- Spring Boot + MariaDB structure
- a mostly completed Prisma migration path for active CRUD
- existing frontend interaction patterns
- implementation notes and AI collaboration records

## 4. Current Product Center

The current product center is not public recommendation.

Coffeebara now makes more sense as:

- a personal coffee archive
- a brewing record system
- a place-aware coffee log
- a product built around recall, reflection, and accumulated history

This direction is more reliable because it depends on data the user can actually provide, review, and care about directly.

## 5. What Kakao Now Means

Kakao integration is still important, but its role has changed.

### Kakao login
Its role is:

- user identity
- record ownership
- continuity across devices

### Kakao place data
Its role is:

- selecting where beans were purchased
- selecting where coffee was consumed
- attaching place context to personal records

It is no longer the center of a recommendation product.

## 6. Current Active Scope

The current active product scope should be understood as follows:

- member saved cafes
- guest saved cafes in local browser state
- member cafe-linked text records
- member cafe-linked bean records
- record image attachment upload, metadata, and linking
- place-aware archive flow
- archive-oriented account and profile structure

The current persistence model is:

- `cafe` as shared place cache/master data
- `user_saved_cafe` as member-owned saved cafe state
- guest saved cafes as temporary browser state
- `cafe_record` as the parent layer for member-owned cafe-linked records
- `cafe_note` as the current text-record payload layer
- `media_asset` as local file metadata
- `media_attachment` as the attachment link layer for record-owned files

The current runtime boundary is also important:

- the active `frontend` app now uses local Next.js route handlers plus Prisma for saved-cafe CRUD
- the active `frontend` app also uses local Next.js route handlers plus Prisma for cafe-note and record CRUD
- the active text-record payload returned to the frontend is now assembled from Prisma-backed routes
- guest saved cafes remain browser-local
- in practice, active CRUD should now be understood as Prisma-backed
- the remaining Spring/MyBatis boundaries are intentionally narrow:
  - Kakao login-time `app_user` upsert
  - `cafe` cache/master upsert

So the current project should be described this way:

- active archive-facing CRUD migration is effectively complete
- new UI and new feature slices should attach to Prisma by default
- the remaining MyBatis usage is an intentional exception boundary, not the center of ongoing CRUD work

That exception boundary was kept for a practical reason:

- Kakao OAuth and UserInfo handling are still deeply tied to the current Spring Security flow
- the `app_user` upsert happens naturally inside that login path
- the `cafe` master upsert is also already stably coupled to Kakao place lookup and refresh on the Spring side
- forcing those paths into the frontend layer right now would require a much larger ownership and architecture change than the project actually needs

So the project chose the boundary that best fits its current scale:

- archive-facing CRUD moved to Prisma
- Kakao-coupled login and place-master upsert remain on Spring/MyBatis
  because that is the lower-cost and more coherent structure for the current product

Future bean and brewing records should extend the same record-centered structure.

## 7. Search, Map, and Guest Mode

Search and map-related code still exists in the repository, but the current product baseline is **not** map-centered discovery.
The active baseline is the personal archive flow.

Search and place lookup should stay modest:

- cache what the user actually searched or viewed
- refresh details only when needed
- avoid broad place harvesting for its own sake

Guest mode should also be treated as intentional.

Its role is:

- let a user try search and saving without immediate account commitment
- preserve a lightweight local experience
- preview the archive direction before durable member records are required

But guest mode is still limited:

- guest data is not durable account ownership
- guest users are for preview/demo experience, not full archive ownership

## 8. AI Position

AI should remain secondary.

Useful AI roles are later-stage reflection, such as:

- summarizing repeated preference tendencies
- highlighting brewing conditions linked to satisfaction
- giving readable summaries of a user's own archive

AI should not replace record keeping or turn the product back into an AI-first recommendation system.

The archive must stand on its own without AI.

## 9. Next Product Slices

The next meaningful slices are:

- guest sample/demo record page
- brewing record creation
- purchase and drinking place selection
- archive detail views
- tasting note editing
- satisfaction input
- filtering and sorting

These are small enough to build realistically and meaningful enough to make the product personally useful.

## 10. Final Framing

The earlier phase, internally called **v1**, should be treated as a preserved implementation milestone rather than the current product baseline.
The current phase is a personal brewing record and coffee archive system built on the same repository continuity.
