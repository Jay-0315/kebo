# KEBO

환율 기능이 있는 가계부&커뮤니티 서비스 `KEBO`의 모노레포입니다. 현재 구조는 사용자 웹, 관리자 웹, API 앱으로 분리되어 있고, 이후 `Capacitor`로 모바일 앱 패키징을 염두에 두고 있습니다.

## Apps

- `apps/user-web`: 사용자용 가계부/커뮤니티 웹앱
- `apps/admin-web`: 관리자용 운영 웹앱 스캐폴드
- `apps/api`: 백엔드 API 스캐폴드

## Stack

- Frontend: `React 18`, `TypeScript`, `Vite`, `Tailwind CSS v4`
- Admin Frontend: `React 18`, `Vite`
- Backend: `NestJS`, `Prisma ORM`
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

## Features

### 커뮤니티 탭

- 게시글 카테고리 3종: 자랑(`brag`) / 팁 공유(`tip`) / 잡담(`chat`)
- 게시글 작성 시 이미지(jpg, png) 첨부 가능 — 클라이언트에서 1280px·75% JPEG로 압축 후 base64 저장
- 좋아요 토글
- 댓글 + 대댓글(1단계) — 댓글에도 이미지 첨부, 수정/삭제 가능
- 목록에서 최근 댓글 3개 미리보기
- 게시글 상세 페이지: 전체 댓글 페이지네이션 (페이지당 10개, 번호 버튼)

### 그룹 탭

- 그룹 생성 / 삭제 / 탈퇴
- 초대 코드로 즉시 입장 또는 가입 신청 → 호스트 승인/거절
- 공개 그룹 검색
- 호스트 권한 이전
- 그룹별 공유 지출 내역 관리

## Database Migration

| 상황 | 방법 |
|------|------|
| **신규 설치** | `docker compose up --build` — `mysql-schema.sql`이 자동 적용됨, 마이그레이션 파일 불필요 |
| **기존 DB 업그레이드** (커뮤니티 기능 추가 전 스키마) | 아래 명령으로 마이그레이션 수동 적용 |

```bash
docker cp docs/migrations/legendary_pity.sql kebo-mysql:/tmp/migration.sql
docker exec kebo-mysql mysql -ukebo -pkebo1234 kebo -e "source /tmp/migration.sql;"
```

> `legendary_pity.sql`은 구버전 스키마에 **1회만** 실행. 이미 적용된 DB에 재실행하면 `Duplicate column` 에러 발생.

## Notes

- `docker-compose.yml`은 `user-web + api + MySQL`을 포함합니다.
- 이미지는 base64로 DB에 저장됩니다. 업로드 제한은 20MB입니다.
