# Coffeebara

Coffeebara는 Kakao Local API를 기반으로 카페를 검색하고, 지도에서 탐색하고, 카페 데이터를 저장하는 흐름을 만들기 위해 진행했던 프로젝트입니다.

이 프로젝트는 여기서 중단합니다.

중단 이유는 단순 구현 부족이 아니라, 제품의 중심 가정이 흔들렸기 때문입니다. 처음에는 `Kakao Local API + 추가 처리 + LLM` 조합으로 개인 취향 기반 카페 추천까지 자연스럽게 이어질 것이라 봤지만, 실제로는 추천의 핵심인 item-side 데이터가 충분하지 않았습니다. 이 상태에서 방향을 틀어 억지로 이어가면 원래 만들던 것도 흐려지고, 새로 붙이는 것도 애매해지고, 결국 무엇을 하려던 프로젝트인지 불분명해진다고 판단했습니다.

이 저장소에는 여전히 남길 가치가 있는 자산이 있습니다.

- Kakao 기반 검색/지도/저장 흐름
- 로그인/Auth 뼈대
- DB 적재 구조
- `AGENTS.md`를 통한 AI 협업 기록
- 카페 추천 가설이 왜 성립하지 않았는지에 대한 회고

설계 회고는 [failed-assumptions.md](./failed-assumptions.md) 에 정리했습니다.

## 프로젝트에서 확인된 것

- 사용자 선호(reason)는 어느 정도 구조화할 수 있습니다.
- 하지만 후보 카페를 비교할 만큼 풍부한 item-side 데이터는 확보되지 않았습니다.
- Kakao Local API는 장소 탐색과 수집에는 충분했지만, 카페의 성격을 추천 관점에서 비교하기에는 데이터가 얕았습니다.
- 크롤링/스크래핑과 LLM은 보강 수단일 수는 있어도, 빈약한 item-side를 안정적으로 해결하는 만능 수단은 아니었습니다.

## 그래서 바뀐 판단

현재 데이터 현실에 더 맞는 방향은 강한 추천 서비스가 아니라, 개인용 카페 탐색/기록 도구에 가깝습니다.

남길 수 있는 유효한 제품 축은 아래와 같습니다.

- 카페 검색
- 지도 탐색
- 카페 저장
- 선호 이유 기록
- 태그/메모
- 회고

추천은 당분간 보류하거나, 훨씬 약한 형태로 다시 정의해야 합니다.

## 남아 있는 구현 자산

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
- 제품 정의가 흔들릴 때 코드보다 가정을 먼저 점검해야 한다는 학습

## 현재 저장소를 보는 방법

이 저장소는 완성된 추천 서비스라기보다 아래 두 가지를 함께 담고 있습니다.

- Kakao 기반 카페 탐색/저장 시스템의 구현 자산
- 잘못된 제품 가정을 어떻게 확인했고 왜 접었는지에 대한 기록

따라서 이후 재사용 관점에서는 "무엇이 이미 동작하는가"와 "어떤 가정이 실패했는가"를 함께 보는 것이 맞습니다.

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
├─ failed-assumptions.md
└─ README.md
```

## 실행 메모

현재 저장소는 보존 목적이 크지만, 기존 구현을 확인하려면 아래 명령을 사용할 수 있습니다.

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

## 마지막 정리

이 프로젝트는 실패한 코드베이스라기보다, 실패한 가정을 비교적 명확하게 남긴 코드베이스에 가깝습니다.

남긴 구현 자산은 이후 다른 방향의 제품으로 이어질 수 있고, 남긴 회고는 같은 종류의 착각을 반복하지 않게 해 줍니다.
