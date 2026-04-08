# Coffeebara

**커피바라**

커피 취향을 바탕으로 좋아할 만한 카페를 추천하는 서비스를 목표로 합니다.  
백엔드는 Spring Boot, 프론트엔드는 Next.js 기반으로 구성한 개인 프로젝트입니다.

## Project Overview

Coffeebara는 커피 관련 정보와 사용자 취향을 바탕으로 기능을 확장해 나가는 웹 프로젝트입니다.

현재는 프로젝트 초기 세팅 단계이며, 아래와 같은 구조로 개발을 진행합니다.

- 백엔드: Spring Boot
- 프론트엔드: Next.js
- 개발 구조: 모노레포 구조로, 백엔드 루트 아래 `frontend` 폴더를 분리하여 관리

또한 이 프로젝트는 바이브 코딩 기반으로 초안을 빠르게 만들고, 이후 직접 검토하고 수정해 나가며 발전시키는 방식으로 개발합니다.

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Gradle
- Lombok
- MariaDB Driver

### Frontend
- Next.js
- React
- Node.js / npm

## Project Structure

```text
coffeebara
├─ src
│	├─ main
│	│	├─ java
│	│	└─ resources
│	└─ test
├─ frontend
│	├─ app
│	├─ public
│	├─ package.json
│	└─ ...
├─ build.gradle
├─ settings.gradle
└─ README.md
```

## Getting Started

### Backend

프로젝트 루트에서 Spring Boot 애플리케이션을 실행합니다.  
또는 Eclipse에서 `CoffeebaraApplication`을 실행합니다.

기본 백엔드 주소: `http://localhost:18080`

### Frontend

프론트엔드는 `frontend` 폴더에서 별도로 구성 및 실행합니다.

기본 프론트엔드 개발 서버 주소: `http://localhost:3000`
