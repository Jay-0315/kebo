
# KEBO

환율 기능이 있는 가계부 서비스 `KEBO`의 모노레포입니다. 현재 구조는 사용자 웹, 관리자 웹, API 앱으로 분리되어 있고, 이후 `Capacitor`로 모바일 앱 패키징을 염두에 두고 있습니다.

## Apps

- `apps/user-web`: 사용자용 가계부/커뮤니티 웹앱
- `apps/admin-web`: 관리자용 운영 웹앱 스캐폴드
- `apps/api`: 백엔드 API 스캐폴드

## Stack

- Frontend: `React 18`, `TypeScript`, `Vite`, `Tailwind CSS v4`
- Admin Frontend: `React 18`, `Vite`
- Backend scaffold: `Node.js`
- Database: `MySQL`

## Local Run

```bash
npm install
npm run dev:user
```

관리자 웹:

```bash
npm run dev:admin
```

API:

```bash
npm run dev:api
```

Prisma client 생성:

```bash
npm run prisma:generate --workspace @kebo/api
```

## Docker Run

1. 환경 파일을 준비합니다.

```bash
cp .env.example .env
```

2. 사용자 웹, API, MySQL을 같이 실행합니다.

```bash
docker compose up --build
```

3. 접속 주소

- 사용자 웹: `http://localhost:5173`
- 관리자 웹: 아직 도커 미포함
- API: `http://localhost:4000/api`
- MySQL: `localhost:3306`

## Notes

- 현재 `docker-compose.yml`은 `user-web + api + MySQL`을 포함합니다.
- 프론트는 아직 일부 로컬 상태 기반 동작이 남아 있고, API 연동은 다음 단계입니다.
- 백엔드는 `NestJS + Prisma + MySQL` 기준으로 스캐폴딩되었습니다.
- 초기 MySQL 스키마는 [docs/mysql-schema.sql](/Users/jay/Desktop/kebo/docs/mysql-schema.sql:1)에 있습니다.
  
