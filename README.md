# Coffeebara

Coffeebara는 사용자가 좋아하는 카페를 저장하고, 지도 기반으로 카페를 탐색하며, Kakao Local API를 기준으로 카페 데이터를 수집하고 적재하는 프로젝트입니다.

현재 단계에서는 추천 점수 계산이나 LLM 분석보다 아래 흐름에 집중하고 있습니다.

- 카카오 검색 결과 수집
- 카페 데이터 DB 적재
- 내 취향 카페 저장
- 내 취향 카페 주변 카페 추가 수집
- stale 카페 데이터 갱신

백엔드는 Spring Boot 4.0.5, Java 21, Gradle 기반이고, 프런트엔드는 `frontend/` 아래 Next.js 앱으로 구성되어 있습니다.

## 개발 방식

이 프로젝트는 OpenAI Codex CLI를 활용한 AI-assisted vibe coding 실험을 포함합니다.

이 저장소에서 확인하고자 한 것은
'AI가 작성한 코드는 결국 사람이 직접 읽고 확인해야 한다'는 전제가
항상 필요한가 하는 점이었습니다.

이번 프로젝트에서는 의도적으로 코드 자체를 직접 읽고 수정하는 방식보다,
생성형 도구에 충분한 맥락, 제약, 목표를 어떻게 전달해야
원하는 구조와 흐름을 얻을 수 있는지에 집중했습니다.

즉, 이 프로젝트의 초점은
코드를 사람이 일일이 검토하며 통제하는 개발 방식이 아니라,
적절한 지시 설계만으로 어느 수준까지 결과물의 방향성과 품질을 통제할 수 있는지를 확인하는 데 있습니다.

AGENTS.md는 그 과정에서 생성형 도구에 제공한 작업 원칙과 제약을 기록한 문서입니다.
따라서 이 저장소는 기능 결과물과 함께,
AI-assisted 개발 방식을 어떻게 실험했는지도 보여주는 프로젝트입니다.

## 현재 구현 상태

### Backend

- Spring Boot 4.0.5 + Java 21 + Gradle
- MariaDB + MyBatis 기반 `cafe` 테이블 upsert 구조
- Kakao Local API 연동
- `GET /api/cafes/search` 검색 API
- `GET /api/cafes/{placeId}` 상세 조회 API
- `GET /api/cafes/map` 지도 영역 조회 API
- `GET /api/cafes/map/search` 지도 영역 + 검색어 조회 API
- 검색 결과를 `kakao_place_id` 기준으로 중복 제거 후 `cafe` 테이블에 upsert
- 카카오 키워드 검색 상한에 맞춰 최대 3페이지, 최대 45건까지 수집 및 적재
- 검색 API에 10초 TTL 메모리 캐시 적용
- CORS 허용 origin을 `app.cors.allowed-origins` 프로퍼티로 외부화
- 내 취향 카페 저장 시 해당 카페 주변 카페도 추가 수집 후 `cafe` 테이블에 upsert
- 지도 bounds 기반 조회(`GET /api/cafes/map`, `GET /api/cafes/map/search`) 결과도 `cafe` 테이블에 upsert
- 30일이 지난 카페 데이터는 상세 조회 시 Kakao Local API 기준으로 refresh

### Frontend

- Next.js 16 기반 UI
- 헤더 + 좌측 사이드바 + 메인 컨텐츠 영역 구조
- 카카오맵 기반 카페 탐색 UI
- 검색 중 전체 화면 로딩 오버레이 표시
- 검색 결과가 많을 때 지도 중앙 토스트 안내 표시
- `현재 위치에서 검색` 버튼 제공
- 지도에는 검색 결과 전체 마커 표시
- 하단 카페 정보 영역은 검색 결과 또는 현재 위치 조회 결과를 최대 10건까지만 표시
- 헤더에 `KO / EN / JA` locale 드롭다운 제공
- `messages.js` 기반 UI 다국어 연결 완료

## 다국어 상태

현재 다국어는 프런트 UI 문구 기준으로 적용되어 있습니다.

- 헤더
- 지도 영역 설명
- 검색 결과 영역
- 카페 정보 영역
- 토스트 / 로딩 / 오류 문구
- 사이드바 문구

다만 실제 카페 데이터는 Kakao Local API 원문을 그대로 사용합니다.

- 카페 이름
- 주소
- 카카오 상세 링크 대상 정보

즉 현재 상태는 "UI 다국어 지원"이며, "카페 실데이터 다국어 지원"은 아닙니다.

## 현재 범위

현재는 아래 범위까지만 구현 대상으로 봅니다.

- 카페 검색 및 카페 데이터 적재
- 내 취향 카페 저장
- stale 카페 refresh
- 내 취향 카페 주변 카페 수집
- DB 적재

아직 범위 밖인 항목은 아래와 같습니다.

- feature extraction
- recommendation ranking
- LLM 분석
- 사용자 계정 기반 선호 카페 서버 저장
- 소셜 로그인

## 데이터 모델 방향

현재는 `cafe` 테이블 하나를 카페 마스터 데이터 풀처럼 사용합니다.

- 검색 결과 적재
- 내 취향 카페 적재
- 내 취향 카페 주변 카페 적재

현재 단계에서는 위 경로 모두 `cafe` 테이블에 upsert 됩니다.

사용자별 `내 취향 카페` 관계 테이블은 아직 만들지 않았습니다. 이 부분은 추후 소셜 로그인과 사용자 모델이 들어온 뒤 별도 테이블로 분리할 예정입니다.

## 주요 동작 방식

### 1. 검색

- 프런트에서 검색어를 입력하면 `/api/cafes/search`를 호출합니다.
- 백엔드는 Kakao 키워드 검색 결과를 최대 3페이지까지 수집합니다.
- 카카오 키워드 검색 특성상 현재 상한은 최대 45건입니다.
- 수집 결과를 `kakao_place_id` 기준으로 중복 제거 후 `cafe` 테이블에 upsert 합니다.
- 같은 검색 파라미터가 짧은 시간 내 반복되면 10초 메모리 캐시를 사용합니다.

### 1-1. 현재 위치에서 검색

- 지도 좌측 상단의 `현재 위치에서 검색` 버튼으로 현재 보고 있는 지도 범위 기준 카페를 조회할 수 있습니다.
- 이 동작은 키워드 검색 input/query를 비우고, 현재 지도 bounds 기준으로 `/api/cafes/map`를 호출합니다.
- 조회 결과도 `cafe` 테이블에 upsert 됩니다.
- 이 모드에서는 지도가 첫 결과로 자동 이동하지 않고 현재 화면을 유지합니다.
- 결과 카운트와 카드 목록은 하단 패널에서만 보여주며, 지도 상단에는 중복 표시하지 않습니다.

### 2. 내 취향 카페 저장

- 사용자가 카페를 `내 취향 카페`에 추가하면 `POST /api/cafes`를 호출합니다.
- 선택한 카페 1건을 `cafe` 테이블에 upsert 합니다.
- 그 다음 해당 카페의 `latitude`, `longitude`를 기준으로 주변 카페를 추가 수집합니다.
- 주변 카페도 `cafe` 테이블에 upsert 합니다.

### 3. 상세 조회와 freshness

- `GET /api/cafes/{placeId}` 호출 시 저장된 카페를 조회합니다.
- `last_fetched_at` 기준 30일 이상 지난 데이터는 Kakao Local API로 다시 조회해 갱신합니다.

## 프런트 UI 메모

- 헤더 타이틀은 `취향 카페 탐색`
- 지도 영역 문구는 현재 설계에 맞게 간결하게 정리됨
- 검색 결과 뱃지는 `총 검색 결과 N곳` 또는 `총 검색 결과 45곳 이상`으로 표시
- 하단 검색 결과 카드는 최대 10건만 표시
- 현재 위치에서 검색 결과도 같은 하단 카드 UI를 사용
- 지도에는 검색 결과 전체를 마커로 표시
- 지도 최대 zoom-out은 과도하게 멀어지지 않도록 제한
- locale 드롭다운은 실제 UI 문구 전환과 연결되어 있음
- 토스트 안내는 상황별로 분리됨
  - 빈 입력 검색: 카페명/지역명 입력 안내
  - 키워드 검색 45건 이상: 지역명 추가 검색 안내
  - 현재 위치 검색 45건 이상: 지도 조정 또는 검색 기능 사용 안내
- 토스트는 `toast catalog + event trigger` 구조로 관리됨
  - 문구 정의는 한곳에서 관리
  - 각 기능은 필요한 토스트 key만 호출
  - 비동기 완료 후 띄워야 하는 토스트는 별도 trigger로 한 번만 표시
- 로고 영역과 사이드바 `Home`은 초기 진입 상태처럼 홈 뷰를 리셋함
- 사이드바에는 `Kakao Map` 링크가 있으며:
  - 기본 상태에서는 `https://map.kakao.com/`로 이동
  - 검색, 현재 위치 검색, 카페 선택 상태에서는 현재 지도 중심 좌표 기준 링크로 이동
- 사이드바 하단에는 정책 안내가 표시됨
  - 커피바라는 사용자를 직접 식별할 수 있는 정보, 사용자 동선, 검색 내역, 검색 지역, 사용자 좌표를 서버에 저장하지 않음
  - 게스트 이용 중 생성된 정보는 브라우저 환경이나 운영 정책에 따라 초기화될 수 있음
  - 데이터 수집은 공식 API 우선, 추가 수집 시 공개 범위/이용 정책/robots 확인 후 최소 정보만 처리
- `page.js` 책임 분리를 시작했고, 현재는 헤더/검색 토스트/검색 로딩 오버레이가 별도 컴포넌트로 분리된 상태

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
├─ build.gradle
├─ settings.gradle
└─ README.md
```

## 실행 전 준비

### 1. MariaDB 준비

```sql
CREATE DATABASE coffeebara CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

스키마는 아래 둘 중 하나로 준비할 수 있습니다.

- 수동 실행: [db/schema.sql](/E:/DevTeam/workspace/coffeebara/db/schema.sql)
- 백엔드 초기화용: [src/main/resources/schema.sql](/E:/DevTeam/workspace/coffeebara/src/main/resources/schema.sql)

### 2. 백엔드 설정

`src/main/resources/application-local.properties`를 로컬 환경에 맞게 준비합니다. 예시 파일은 `src/main/resources/application-local.properties.example`입니다.

```properties
kakao.local.rest-api-key=YOUR_KAKAO_REST_API_KEY
spring.datasource.url=jdbc:p6spy:mariadb://localhost:3306/coffeebara?sslMode=trust
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.datasource.driver-class-name=com.p6spy.engine.spy.P6SpyDriver
spring.sql.init.mode=never
app.search-cache.ttl-seconds=10
app.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

### 3. 프런트 환경 변수

`frontend/.env.local`에 아래 값을 설정합니다.

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
NEXT_PUBLIC_API_BASE_URL=http://localhost:18080
```

## 실행 방법

### Backend

프로젝트 루트에서 실행합니다.

```bash
./gradlew bootRun
```

기본 주소:

- `http://localhost:18080`

### Frontend

`frontend/`에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

기본 주소:

- `http://localhost:3000`

## 주요 API

- `GET /api/cafes/search`
  - 검색어 기반 카페 검색
  - 카카오 키워드 검색 결과를 최대 3페이지, 최대 45건까지 수집
  - 응답 전에 `cafe` 테이블에 upsert

- `GET /api/cafes/{placeId}?query=...`
  - 특정 카페 상세 조회
  - stale 데이터면 Kakao API 재조회 후 갱신

- `GET /api/cafes/map`
  - 현재 지도 영역 내 카페 조회
  - 응답 전에 `cafe` 테이블에 upsert

- `GET /api/cafes/map/search`
  - 현재 지도 영역 내 검색어 기반 카페 조회
  - 응답 전에 `cafe` 테이블에 upsert

- `POST /api/cafes`
  - 선택한 카페 1건 저장
  - 저장 후 주변 카페를 추가 수집해 `cafe` 테이블에 upsert

## 참고

- 프런트와 백엔드는 같은 저장소에 있지만 실행은 각각 별도입니다.
- 프런트 명령은 반드시 `frontend/`에서 실행해야 합니다.
- 현재는 카페 데이터 수집과 적재가 중심이고, 추천 알고리즘은 아직 본격적으로 구현하지 않았습니다.
