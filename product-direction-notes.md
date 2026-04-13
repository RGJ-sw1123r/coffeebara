# Coffeebara Product Direction Notes

## 1. Earlier Working Assumption

The earlier product assumption was that Kakao Local API based place search, additional processing, and later LLM support could grow into a personal cafe recommendation product.

The rough idea was:

- collect cafes the user likes
- store preference signals and reasons
- build a preference profile
- use that profile to drive recommendations

This was not an unreasonable place to start, but it turned out to be a weaker product center than expected.

## 2. What The Implementation Actually Validated

The implementation work still validated several useful things.

- Kakao Local API works well for place search and place collection
- map exploration is a practical and usable interaction model
- place persistence keyed by `kakao_place_id` is a stable technical asset
- user-side notes, reasons, and saved items can be structured to some extent
- the repository already contains useful backend and frontend groundwork

So the earlier work was not wasted. It produced real technical assets and clarified what the product can support reliably.

## 3. What Did Not Hold Up Well

The weaker part was the leap from place collection to meaningful recommendation quality.

- Kakao place data is useful for discovery and reference, but too thin to compare cafes deeply and consistently
- user preference input alone was not enough to make recommendation quality feel convincing
- item-side data required for stronger recommendation logic was not naturally available from the current collection model
- crawling, scraping, or LLM enrichment could add support later, but none of them justified the product on their own

In short:

the recommendation idea was easier to imagine than to support with durable data.

## 4. The More Reliable Product Center

The more reliable center of the project is not public recommendation.

It is personal record keeping.

That means Coffeebara makes more sense as:

- a personal coffee archive
- a brewing record system
- a place-aware coffee logbook
- a product built around recall, reflection, and accumulated history

This direction is more stable because it depends on data the user can actually provide and care about directly.

## 5. Why This Direction Fits Better

The personal archive direction has a clearer value proposition.

- the user can record beans they used
- the user can record brewing conditions
- the user can attach purchase place and drink place context
- the user can keep tasting notes and subjective impressions
- the user can revisit patterns over time

This is useful even without recommendation logic.
It is also useful even without AI.

That makes it a stronger foundation.

## 6. What Still Carries Forward From v1

The earlier repository work remains important as v1.

What still carries forward:

- Kakao login as a practical account identity option
- Kakao Map as a place selection tool
- place search and place persistence flow
- `kakao_place_id` based place master handling
- Spring Boot + MyBatis + MariaDB application structure
- existing frontend groundwork and interaction patterns
- implementation notes and AI collaboration records

The product direction changed, but the technical continuity remains valid.

## 7. How Kakao Assets Should Be Reinterpreted

Kakao integration is still useful, but its role is different now.

### Kakao login

Its role is:

- user identity
- record ownership
- archive continuity across devices

It is not primarily about public identity or social features.

### Kakao Map and place data

Its role is:

- selecting where beans were purchased
- selecting where coffee was consumed
- attaching place context to personal records

It is not primarily about generating recommendation candidates.

## 8. What The Product Should Focus On Next

The next meaningful product slices are:

- guest sample/demo record page
- member text-note record flow entered from saved cafes
- bean record creation
- brewing record creation
- place selection for purchase and drinking context
- brewing history view
- bean detail view
- record detail view
- tasting note editing
- satisfaction input
- one mood color per record
- basic filtering and sorting

These are small enough to build realistically and meaningful enough to make the product personally useful.

## 9. What Has Already Been Reconnected

The direction shift is no longer only conceptual. Several important pieces have already been reconnected in code.

- cafe search and map lookup remain active
- `cafe` is now functioning again as a place cache / master table
- search and map results are being upserted into `cafe`
- cafe detail now prefers DB data first and refreshes from Kakao when stale
- member saved cafes are now persisted through `user_saved_cafe`
- guest saved cafes remain local-storage based
- frontend saved-cafe behavior is now intentionally split by auth mode
- member cafe-linked text notes are now persisted through `cafe_record` + `cafe_note`
- saved-cafe deletion now checks linked member records before removal
- account/profile UI is being reshaped around the personal archive direction

This matters because the repository is no longer merely "planning" to move away from the earlier recommendation framing.
The implementation path has already started changing in concrete ways.

## 10. How Current Persistence Should Be Understood

The current persistence model should be described carefully.

- `cafe` is shared place cache/master data
- `user_saved_cafe` is member-owned saved cafe state
- guest saved cafes are temporary local browser state
- `cafe_record` is the current shared parent layer for member-owned cafe-linked records
- `cafe_note` is the current text-record payload layer under `cafe_record`
- future bean/brew record tables should follow the same parent-child record structure

This is an important distinction.

It means the app is not returning to the old "save every place because places are the product" interpretation.
It is using place persistence to support archive flows more reliably and to reduce repeated Kakao API calls.

## 11. Search And Map Scope Should Stay Modest

The current direction also implies a different attitude toward Kakao API usage.

- search does not need recommendation-style deep page crawling
- map lookup does not need broad candidate harvesting
- it is enough to cache what the user actually searched or viewed
- detail refresh should happen when needed, not through aggressive place accumulation

This makes the system simpler and keeps the place layer aligned with the archive product goal.

## 12. Guest Mode Should Be Treated As Intentional

Guest mode is not just a temporary workaround.

Its current role is:

- let a user explore cafe search and saving without immediate account commitment
- preserve a lightweight local experience in the browser
- preview the product direction before durable archive features are available

But guest mode still has limits:

- guest saved cafes are not durable account records
- guest mode should not be treated as real record ownership
- guest users should eventually be directed to sample/demo archive flows rather than full member record creation

## 13. Mood Color As Product Identity

One of the more distinctive parts of the new direction is the mood color feature.

The point is not just visual styling.
The point is to let the user capture the felt character of a coffee in a way that sits beside text rather than replacing it.

That is why the feature should remain expressive in the UI, while still mapping internally to a limited meaningful palette.

## 14. AI Should Remain Secondary

AI still has a place in the product, but not as the foundation.

The strongest use of AI here is later-stage reflection, for example:

- summarizing repeated preference tendencies
- describing brewing conditions often associated with higher satisfaction
- giving the user a readable summary of their own archive

The weakest use of AI would be:

- inventing tasting notes
- replacing record keeping
- turning the project back into an AI-first recommendation idea

The archive must stand on its own without AI.

## 15. Practical Conclusion

The important conclusion is not that the earlier direction failed completely.

The more accurate conclusion is:

- some assumptions were validated
- some assumptions were too optimistic
- the repository already contains useful assets
- the strongest next step is to turn those assets toward a personal coffee archive

That gives the project a calmer and more durable purpose.

## 16. Final Framing

Coffeebara should continue as the same repository, with the earlier work preserved as v1 and the next phase focused on a personal brewing record and coffee archive system.

The goal is not to throw away what exists.
The goal is to make the existing codebase serve a better product center.
