# Coffeebara

커피바라는 사용자가 선호하는 카페를 저장하고, 지도 기반으로 주변 카페를 탐색하는 커피 추천 서비스입니다.

현재는 초기 개발 단계이며, 프론트엔드 UI 초안과 지도 탐색 기능이 먼저 구현되어 있습니다. 백엔드는 Spring Boot 프로젝트가 구성되어 있지만 아직 프론트엔드와 API 연동은 진행되지 않았습니다.

## 현재 개발 상태

### Backend
- Spring Boot 4.0.5 기반 프로젝트 초기 설정 완료
- Java 21, Gradle 환경 구성
- 기본 애플리케이션 실행 가능
- API, DB 연동, 도메인 로직은 아직 본격 구현 전

### Frontend
- Next.js 16 기반 앱 구성 완료
- YouTube 스타일을 참고한 `헤더 + 사이드바 + 메인 콘텐츠` 레이아웃 초안 구현
- 카카오맵 기반 주변 카페 탐색 화면 구현
- 카페 검색 기능 구현
- 선택한 카페 상세 정보 표시 구현
- 선호 카페 저장/해제 기능 구현
- 선호 카페 목록을 로컬 스토리지에 유지하도록 구현

## 기술 스택

### Backend
- Java 21
- Spring Boot 4.0.5
- Gradle
- Lombok
- MariaDB Driver

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
│  │  ├─ components/
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  └─ page.js
│  ├─ public/
│  └─ package.json
├─ build.gradle
├─ settings.gradle
└─ README.md
```

## 실행 방법

### Backend 실행

프로젝트 루트에서 실행:

```bash
./gradlew bootRun
```

- 기본 주소: `http://localhost:18080`

### Frontend 실행

`frontend/` 디렉터리에서 실행:

```bash
cd frontend
npm install
npm run dev
```

- 기본 주소: `http://localhost:3000`

## 프론트엔드 환경 변수

카카오맵 기능을 정상적으로 사용하려면 `frontend/.env.local` 파일에 아래 값을 설정해야 합니다.

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

참고:
- 카카오 개발자 콘솔에 `http://localhost:3000`을 허용 도메인으로 등록해야 합니다.
- 키가 없으면 지도 영역은 렌더링되지만 실제 카카오맵 데이터는 로드되지 않습니다.

## 참고 사항

- 현재 백엔드와 프론트엔드는 분리되어 개발 중입니다.
- 프론트엔드는 목업/외부 지도 데이터를 기준으로 먼저 작업되고 있습니다.
- 추천 로직은 UI 흐름 중심으로 준비되어 있으며, 실제 개인화 추천 기능은 이후 구현 대상입니다.
