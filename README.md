# Coffeebara

Coffeebara는 Kakao Local API를 기반으로 카페를 검색하고, 지도에서 탐색하고, 선택한 카페를 저장하는 흐름을 구현한 프로젝트입니다.

이 저장소의 핵심은 아래 세 가지입니다.

- Kakao 기반 카페 검색과 지도 탐색 UX
- Spring Boot + MyBatis 기반의 카페 마스터 데이터 적재와 갱신 흐름
- guest-first 전제의 프론트엔드 상태 관리와 AI 협업 기록

제품 방향을 검토하며 정리한 메모는 [product-direction-notes.md](./product-direction-notes.md) 에 남겨 두었습니다.

## 무엇을 구현했는가

- Kakao 키워드 검색 결과를 수집하고 DB에 upsert하는 검색 API
- 지도 현재 영역 기준으로 카페를 다시 수집하는 map search 흐름
- 선택한 카페를 저장할 때 주변 카페까지 함께 수집하는 persistence 흐름
- `kakao_place_id` 기준 중복 방지와 30일 freshness 재조회 정책
- guest-first 전제의 localStorage 기반 선호 카페 흐름
- locale 선택이 가능한 Next.js 기반 탐색 UI
- `AGENTS.md`에 남긴 AI 협업 기준과 작업 기록

## 구현 자산

### Backend

- Spring Boot 4.0.5 + Java 21 + Gradle
- MariaDB + MyBatis 기반 적재 구조
- Kakao Local API 연동
- `GET /api/cafes/search`
- `GET /api/cafes/{placeId}`
- `GET /api/cafes/map`
- `GET /api/cafes/map/search`
- `POST /api/cafes`
- `kakao_place_id` 기준 카페 upsert
- 30일 freshness 기반 재조회 흐름

### Frontend

- Next.js 기반 UI
- 헤더 + 사이드바 + 메인 컨텐츠 구조
- Kakao Map 기반 탐색 화면
- 검색/현재 영역 검색 흐름
- locale 선택 UI
- guest-first 전제의 localStorage 기반 선호 카페 흐름

### Collaboration

- [AGENTS.md](./AGENTS.md)
- AI와 협업하며 어떤 제약과 기준으로 작업했는지에 대한 기록
- 구현 과정에서 제품 가정과 데이터 조건을 함께 점검한 흔적

## 프로젝트 포인트

- 백엔드에서는 외부 API 수집 결과를 투명하게 저장하고 갱신하는 흐름에 집중했습니다.
- 프론트엔드에서는 YouTube식 정보 위계를 응용한 카페 탐색 화면과 guest-first UX를 만들었습니다.
- 추천 시스템까지 무리해서 확장하기보다, 실제로 검증된 탐색/저장 자산을 명확히 남기는 방향으로 정리했습니다.

## 현재 저장소를 보는 방법

이 저장소는 카페 탐색과 저장에 필요한 실제 구현 결과물을 중심으로 보면 됩니다. 동시에 향후 추천 기능이나 제품 확장 방향을 검토할 때 참고할 수 있도록 별도 메모도 함께 정리해 두었습니다.

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

## 프로젝트 구조

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
├─ AGENTS.md
├─ product-direction-notes.md
└─ README.md
```

## 실행 메모

현재 구현을 확인하려면 아래 명령을 사용할 수 있습니다.

### Backend

프로젝트 루트에서 실행:

```bash
./gradlew bootRun
```

### Frontend

`frontend/`에서 실행:

```bash
cd frontend
npm install
npm run dev
```

## 정리

이 저장소는 Kakao 기반 카페 탐색, 지도 검색, 데이터 적재, guest-first UX를 실제로 구현한 결과물입니다. 추천 확장 가능성에 대한 판단 메모도 포함되어 있지만, README에서는 무엇이 동작하고 무엇이 남아 있는 자산인지에 초점을 맞췄습니다.
