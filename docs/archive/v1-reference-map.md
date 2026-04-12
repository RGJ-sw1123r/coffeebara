# Coffeebara v1 Reference Map

## Purpose

This document records which parts of the current codebase belong to the earlier v1 cafe exploration direction, which parts still remain useful in the new product direction, and which parts should later be separated from the active path.

This is a preservation map, not a deletion list.

## Current status

The repository still runs on top of a v1-shaped execution path.
That means most v1 code is not yet archive-only.
It is still wired into the active frontend and backend flow.

Because of that, the correct sequence is:

1. classify
2. rename and reinterpret where possible
3. decouple active runtime paths
4. move true legacy assets into archive areas

## Backend classification

### Keep as active foundation

- `src/main/java/com/coffeebara/auth/controller/AuthController.java`
- `src/main/java/com/coffeebara/config/*`
- `src/main/java/com/coffeebara/common/*`
- `src/main/java/com/coffeebara/kakao/client/KakaoLocalClient.java`

Reason:
These are still useful for identity flow, app configuration, request handling, and Kakao place integration.

### Keep, but reinterpret later

- `src/main/java/com/coffeebara/cafe/domain/CafeCategoryConstants.java`
- `src/main/java/com/coffeebara/cafe/mapper/CafeMapper.java`
- `src/main/java/com/coffeebara/cafe/vo/CafeUpsertRequest.java`
- `src/main/java/com/coffeebara/kakao/controller/KakaoCafeSearchController.java`
- `src/main/java/com/coffeebara/kakao/service/KakaoCafeSearchService.java`
- `src/main/java/com/coffeebara/kakao/vo/*`

Reason:
These still provide practical place collection and place master persistence, but they are still named and shaped around the old cafe-centered direction.
Later, these should move toward place-oriented naming and responsibility.

### Archive candidate later, not now

- nearby-cafe collection assumptions inside `KakaoCafeSearchService`
- recommendation-oriented comments and naming tied to saved cafes

Reason:
These parts are too coupled to the current runtime path to move immediately, but they should not remain core forever.

## Frontend classification

### Keep as active foundation

- `frontend/app/components/home/HeaderBar.js`
- `frontend/app/components/home/MapPanel.js`
- `frontend/app/components/home/SearchLoadingOverlay.js`
- `frontend/app/components/home/SearchResultNotice.js`
- `frontend/app/components/KakaoMap.js`
- `frontend/app/login/page.js`

Reason:
These still support login, locale, map interaction, search, and place selection.

### Keep, but reinterpret later

- `frontend/app/messages.js`
- `frontend/app/page.js`
- `frontend/app/hooks/useHomePageState.js`
- `frontend/app/components/home/BottomPanel.js`
- `frontend/app/components/home/Sidebar.js`
- `frontend/app/components/home/StatusNotice.js`

Reason:
These files still power the active home flow, but their state model and UI structure are strongly shaped by:

- guest-first saved cafe flow
- saved cafe sync
- recommendation-preparation assumptions
- favorite-based naming

They are not archive-only yet because the current app still depends on them.

### Archive candidate later, not now

- recommendation-oriented sidebar section in `frontend/app/components/home/Sidebar.js`
- guest favorite hydration and sync assumptions in `frontend/app/hooks/useHomePageState.js`
- backend favorite fetch status handling in `frontend/app/hooks/useHomePageState.js`
- favorite-centric button semantics in `frontend/app/components/KakaoMap.js`
- favorite-centric selected-place actions in `frontend/app/components/home/BottomPanel.js`

Reason:
These represent completed v1 behavior that should be preserved as reference, but not kept forever in the active product path once record-first flows replace them.

## What should happen next

### Step 1: active-path cleanup

Replace or reduce the following in the live UI:

- favorite-centric wording
- recommendation-preparation wording
- guest-only framing when account-based archive flow becomes ready

### Step 2: state decoupling

Split `useHomePageState.js` into:

- place search and place selection state
- session and locale state
- legacy saved-cafe sync state

The legacy saved-cafe sync slice becomes much easier to archive once it is isolated.

### Step 3: archive extraction

Once no longer referenced by the live path, move legacy-only assets into archive locations such as:

- `docs/archive/v1-*`
- `frontend/archive/v1/`
- `src/archive/v1/` or another non-runtime reference area

## Rule for future extraction

Do not move code into archive while it is still imported by the running app.
First make the live path independent.
Only then move the separated legacy slice as reference material.
