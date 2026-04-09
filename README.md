# Coffeebara

Coffeebara는 사용자가 좋아하는 카페를 저장하고, 지도 기반으로 카페를 탐색하며, 카카오 Local API를 기준으로 카페 데이터를 수집하는 프로젝트입니다.

현재 단계에서는 추천 점수 계산이나 LLM 분석보다 아래 작업에 집중하고 있습니다.

- 카카오 검색 결과 수집
- 카페 데이터 DB 적재
- 선호 카페 저장
- 선호 카페 주변 카페 추가 수집
- stale 카페 데이터 갱신

백엔드는 Spring Boot 4.0.5, Java 21, Gradle 기반이고, 프런트엔드는 `frontend/` 아래 Next.js 앱으로 구성되어 있습니다.

## 현재 구현 상태

### Backend

- Spring Boot 4.0.5 + Java 21 + Gradle 구성
- MariaDB + MyBatis 기반 `cafe` 테이블 upsert 구조 구현
- Kakao Local API 연동 구현
- `GET /api/cafes/search` 검색 API 구현
- `GET /api/cafes/{placeId}` 상세 조회 API 구현
- `GET /api/cafes/map` 지도 영역 조회 API 구현
- 검색 결과를 `kakao_place_id` 기준으로 중복 제거 후 `cafe` 테이블에 upsert
- 카카오 키워드 검색 상한에 맞춰 최대 3페이지, 최대 45건까지 수집 및 적재
- 검색 API에 10초 메모리 캐시 적용
- 선호 카페 저장 시 해당 카페 주변 카페를 추가 수집 후 `cafe` 테이블에 upsert
- 저장된 카페 데이터가 30일 이상 오래되면 재조회 후 갱신

### Frontend

- Next.js 16 기반 UI 구현
- 헤더 + 좌측 사이드바 + 메인 콘텐츠 레이아웃 구성
- 카카오 지도 기반 카페 검색 UI 구현
- 검색 중 전체 화면 오버레이 로딩 표시
- 검색 결과가 많을 때 지도 중앙 토스트 안내 표시
- 지도에는 검색 결과 전체 마커 표시
- 하단 카페 정보 영역에는 검색 결과 일부만 표시
- 좌측 사이드바에 `내 취향 카페` 목록 표시
- 헤더에 언어 선택 UI `KO / EN / JA` 드롭다운 껍데기 추가

## 현재 범위

현재는 아래 범위까지만 구현 대상으로 보고 있습니다.

- 카페 검색 및 카페 데이터 적재
- 선호 카페 저장
- stale 카페 데이터 refresh
- 선호 카페 주변 카페 수집
- DB 저장

아직 범위 밖인 항목은 아래와 같습니다.

- feature extraction
- recommendation ranking
- LLM 분석
- 사용자 계정 기반 선호 카페 서버 저장

## 데이터 모델 방향

현재는 `cafe` 테이블 하나를 카페 데이터 풀처럼 사용합니다.

- 검색 결과 적재
- 선호 카페 적재
- 선호 카페 주변 카페 적재

현재 단계에서는 위 경로 모두 `cafe` 테이블에 upsert 됩니다.

사용자별 `내 취향 카페` 관계 테이블은 아직 만들지 않았습니다.  
이 부분은 이후 소셜 로그인과 사용자 모델이 추가된 뒤 별도 테이블로 분리할 예정입니다.

## 검색/적재 동작 방식

### 1. 검색

- 프런트에서 검색어를 입력하면 `/api/cafes/search`를 호출합니다.
- 백엔드는 Kakao 키워드 검색 결과를 최대 3페이지까지 수집합니다.
- 카카오 API 특성상 최대 45건까지만 노출 가능하므로, 현재 수집 상한도 45건입니다.
- 수집 결과는 `kakao_place_id` 기준으로 중복 제거 후 `cafe` 테이블에 upsert 됩니다.
- 같은 검색 파라미터가 짧은 시간 내 반복되면 10초 메모리 캐시를 사용합니다.

### 2. 선호 카페 저장

- 사용자가 카페를 `내 취향 카페`에 추가하면 `POST /api/cafes`를 호출합니다.
- 선택한 카페 1건을 `cafe` 테이블에 upsert 합니다.
- 그 다음 해당 카페의 `latitude`, `longitude`를 기준으로 주변 카페를 추가 수집합니다.
- 주변 카페도 `cafe` 테이블에 upsert 합니다.

### 3. 상세 조회와 freshness

- `GET /api/cafes/{placeId}` 호출 시 저장된 카페를 조회합니다.
- `last_fetched_at` 기준 30일 이상 지난 데이터는 Kakao Local API를 다시 호출해 갱신합니다.

## 프런트 UI 메모

- 헤더 타이틀은 `취향 카페 탐색`
- 지도 영역 문구는 현재 설계에 맞춰 간결하게 정리됨
- 검색 결과 뱃지는 `총 검색 결과 N곳` 또는 `총 검색 결과 45곳 이상`으로 표시
- 하단 검색 결과 카드는 최대 10건만 노출
- 지도는 검색 결과 전체를 마커로 표시
- 지도 줌아웃 최대 레벨은 과도하게 멀어지지 않도록 제한
- 언어 토글은 현재 UI 껍데기만 있고, 실제 다국어 전환은 아직 연결하지 않음

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
  검색어 기준 카페 검색
  카카오 키워드 검색 결과를 최대 3페이지, 최대 45건까지 수집
  응답 전에 `cafe` 테이블에 upsert

- `GET /api/cafes/{placeId}?query=...`
  특정 카페 상세 조회
  stale 데이터면 Kakao API 재조회 후 갱신

- `GET /api/cafes/map`
  현재 지도 영역 내 카페 조회

- `GET /api/cafes/map/search`
  현재 지도 영역 내 검색어 기반 카페 조회

- `POST /api/cafes`
  선택한 선호 카페 1건 저장
  저장 후 주변 카페를 추가 수집하여 `cafe` 테이블에 upsert

## 참고

- 프런트와 백엔드는 같은 저장소에 있지만 실행은 각각 별도입니다.
- 프런트 명령은 반드시 `frontend/`에서 실행해야 합니다.
- 현재는 카페 데이터 수집과 적재가 중심이고, 추천 알고리즘은 아직 본격적으로 구현하지 않았습니다.
