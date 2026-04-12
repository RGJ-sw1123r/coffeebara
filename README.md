# Coffeebara

Coffeebara는 기존 저장소를 이어서 발전시키는 프로젝트입니다.

초기 v1은 Kakao Local API 기반의 카페 검색, 지도 탐색, 선호 카페 축적, 추천 지향 가설을 중심으로 진행되었습니다.  
이 단계는 폐기된 것이 아니라, 같은 저장소 안에 남아 있는 중요한 구현/학습 자산입니다.

현재 Coffeebara의 방향은 다음과 같습니다.

**카페 맥락을 포함한 개인 커피 아카이브 및 브루잉 기록 시스템**

이 프로젝트는 공개 추천 플랫폼이 아니라, 사용자가 나중에 다시 꺼내볼 수 있는 개인 커피 기록을 만드는 데 초점을 둡니다.

- 어떤 원두를 사용했는지
- 어떤 방식으로 추출했는지
- 어떤 맛과 향을 느꼈는지
- 어느 카페에서 샀는지
- 어느 카페에서 마셨는지
- 시간이 지나며 어떤 취향 경향이 나타나는지

제품 방향 메모는 [product-direction-notes.md](./product-direction-notes.md), 현재 작업 기준과 해석 원칙은 [AGENTS.md](./AGENTS.md)에 정리되어 있습니다.

## 현재 상태

현재 코드베이스는 “기록 제품”으로 가는 전환 단계에 있습니다.

이미 동작 중인 것:

- Kakao OAuth 로그인
- `app_user` 기반 계정 저장
- 카페 검색
- 지도 범위 카페 조회
- 키워드 + 지도 범위 조회
- `cafe` 테이블 기반 장소 캐시 적재
- DB 우선 카페 상세 조회 + stale 시 Kakao refresh
- 회원 저장 카페를 `user_saved_cafe`에 저장/조회/삭제
- 게스트 저장 카페를 localStorage에 유지
- 저장 카페 목록, 상세 진입 UI, 계정 메뉴 요약 UI

아직 완료되지 않은 것:

- 원두 기록 CRUD
- 브루잉 기록 CRUD
- 게스트 샘플/데모 기록 페이지
- 개인 아카이브 화면 완성
- 취향 분석/AI 요약

## 현재 제품 해석

현재 저장소를 설명할 때는 아래처럼 해석하는 것이 맞습니다.

- `cafe`는 장소 캐시/마스터 테이블입니다.
- `user_saved_cafe`는 회원이 저장한 카페 관계 테이블입니다.
- 게스트 저장 카페는 계정 데이터가 아니라 localStorage 기반 임시 상태입니다.
- 카페는 제품의 중심이 아니라, 기록을 위한 맥락 데이터입니다.

즉, “카페 추천 서비스”가 아니라 “개인 커피 기록 서비스”로 봐야 합니다.

## 기술 스택

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

## 주요 API

### Auth

- `GET /api/auth/status`
- `POST /api/auth/guest`
- `POST /api/auth/logout`
- `GET /api/auth/logout/kakao-account`
- `PATCH /api/auth/profile/display-name`

### Cafe

- `GET /api/cafes/search`
- `GET /api/cafes/{placeId}`
- `GET /api/cafes/map`
- `GET /api/cafes/map/search`
- `POST /api/cafes`

### Member Saved Cafes

- `GET /api/user-saved-cafes`
- `POST /api/user-saved-cafes`
- `DELETE /api/user-saved-cafes/{placeId}`

## 저장소 구조

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
├─ docs/
│  └─ archive/
├─ AGENTS.md
├─ product-direction-notes.md
└─ README.md
```

## 실행 방법

### Backend

저장소 루트에서:

```bash
./gradlew bootRun
```

### Frontend

`frontend/`에서:

```bash
cd frontend
npm install
npm run dev
```

## 로컬 실행에 필요한 것

최소한 아래 설정이 필요합니다.

- Kakao REST API Key
- Kakao JavaScript Key
- MariaDB 연결 정보

기본 포트:

- Backend: `18080`
- Frontend: `3000`

## 이 프로젝트가 아닌 것

현재 Coffeebara는 아래 방향을 목표로 하지 않습니다.

- 카페 추천 플랫폼
- 공개 리뷰 서비스
- 소셜 피드/팔로우 서비스
- 커뮤니티 중심 제품
- AI가 핵심 가치인 제품

## 정리

Coffeebara는 같은 저장소를 유지한 채 v1의 카페 탐색 자산을 재사용하면서, 개인 커피 기록 아카이브 쪽으로 방향을 재정의한 프로젝트입니다.

지금은 카페 검색, 지도 탐색, 장소 캐시, 회원 저장 카페, 게스트 저장 흐름까지 정리된 상태이고, 다음 단계는 기록 생성과 기록 허브를 실제로 붙여 나가는 일입니다.
