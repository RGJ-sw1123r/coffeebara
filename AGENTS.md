# AGENTS.md

## Project status
- Root backend: Spring Boot 4.0.5, Java 21, Gradle
- Frontend will be implemented as a Next.js app under `frontend/`
- Current phase: initial setup

## Working style
- This project is developed through vibe coding.
- Generate a usable draft first, then I review and refine it manually.
- Prefer minimal changes over large refactors.

## Backend preferences
- Prefer MyBatis or explicit SQL over JPA/Hibernate.
- Avoid ORM-centered design unless explicitly requested.
- Favor transparent query flow and predictable SQL over abstraction-heavy persistence layers.

## Frontend preferences
- The front UI layout should follow a YouTube-style layout.
- Prefer a familiar content-first structure with header, sidebar, and main content area.
- Do not redesign the overall layout direction unless explicitly requested.

## Domain mapping
- Preferred cafes should be treated like subscribed channels in a YouTube-style experience.
- Cafe recommendation cards should play the role of content cards in the main feed.
- The UI should borrow the familiarity of YouTube, but the domain meaning must stay coffee-oriented.
- Do not copy YouTube literally; adapt its layout and interaction patterns to the cafe recommendation domain.

## Rules
- Keep backend under root project.
- Keep frontend inside `frontend/`.
- Do not introduce unnecessary libraries.
- Do not change project structure without clear reason.

## Git preferences
- Write commit messages in Korean.

## Commands
- Backend run: `./gradlew bootRun`
- Frontend run: `cd frontend && npm run dev` (after Next.js initialization)