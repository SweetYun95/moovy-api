# moovy-api
영화 관람·리뷰 서비스 **Moovy**의 Node.js 백엔드입니다.
Express 기반 REST API, Swagger 문서와 Sequelize(선택) 구조를 제공합니다.

---
## 1) 프로젝트 개요 (Introduction)
- moovy-api는 인증/리뷰/영화 리소스를 제공하는 백엔드 API입니다.
- Node.js + Express, ESM(ECMAScript Modules) 구성을 기본으로 합니다.
---
## 2) 기술 스택 (Tech Stack)
- Runtime/Framework: Node.js, Express
- Auth/Session: express-session, cookie-parser, JWT(jsonwebtoken)
- Security: Helmet, CORS
- Docs: Swagger (swagger-ui-express, swagger-jsdoc)
- DB Layer: Sequelize (RDB—MySQL) (ORM 미사용도 가능)
- Dev & Quality: Nodemon, ESLint(Flat), Prettier, dotenv
---
## 3) 아키텍처 다이어그램
```bash
React(Vite) ↔ Axios ↔ Express API ↔ MySQL (Sequelize)
        ↘ JWT / Session
```
🔗 [ERD 설계 링크](https://www.erdcloud.com/d/yHwjKCEAwT7Sw26ci)
---
## 4) ESM("type":"module") vs CJS(CommonJS)

이 프로젝트는 **ESM**을 기본으로 사용합니다. 필요 시 일부 도구(Sequelize CLI 등)에 한해 **CJS(.cjs)** 파일을 혼용할 수 있습니다.
| 구분        | ESM (`"type":"module"`)                 | CJS (CommonJS)                                 |
| --------- | --------------------------------------- | ---------------------------------------------- |
| 가져오기/내보내기 | `import … from '…'`, `export …`         | `const x = require('…')`, `module.exports = …` |
| 파일 확장자    | 로컬 임포트 시 **`.js` 필수**                   | 생략 가능                                          |
| 경로 유틸     | `__dirname` 없음 → `import.meta.url` 사용   | `__dirname`/`__filename` 기본 제공                 |
| 로딩 특성     | 정적 분석/트리 셰이킹 유리, **top-level await** 지원 | 동적 `require` 유연                                |
| 도구 호환     | 최신 번들러/TS 친화                            | 레거시 CLI(예: Sequelize CLI) 친화                   |
| 보안        | **보안이 더 강해지는 것은 아님** (구성상의 차이)          | 동일                                             |

### 권장 전략
- 기본 코드는 ESM으로 통일.
- Sequelize CLI 같은 도구가 CJS를 요구하면 해당 파일만 **.cjs**로 두기
  (예: src/config/config.cjs + 루트 .sequelizerc)
예시:
```js
// .sequelizerc (CJS)
const path = require('path')
module.exports = {
  'config': path.resolve('src/config/config.cjs'),
  'models-path': path.resolve('src/models'),
  'seeders-path': path.resolve('src/seeders'),
  'migrations-path': path.resolve('src/migrations'),
}
```
---
## 5) 📁 폴더 및 기본 파일 구조
```bash
moovy-api/
├─ uploads/
├─ src/
│  ├─ app.js 		# 엔트리 파일
│  ├─ auth/
│  │  └─ passport/
│  │     └─ strategies/
│  ├─ config/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  │  └─ admin/
│  ├─ routes_swagger/
│  │  └─ admin/
│  ├─ utils/
│  └─ validations/
│     ├─ schemas/	# zod 등으로 요청/응답 스키마 정의
│     ├─ dto/		# 스키마 통과 데이터를 정규화/형 변환(trim, lowerCase, 포맷 통일 등).
│     └─ validators/	# validate(schema) 같은 미들웨어 래퍼를 둬서 라우트에서 router.post('/login', validate(loginSchema), ctrl.login) 형태로 사용.
└─ package.json
```
---
## 6) 스크립트 & 실행
`package.json` (앱 엔트리 = `src/app.js`)
```json
{
  "scripts": {
    "start": "npm run dev",
    "dev": "nodemon --watch src --ext js src/app.js",
    "serve": "node src/app.js",
    "lint": "eslint .",
    "format": "prettier . --write"
  }
}
```
실행:
```bash
# 1) 의존성
npm install

# 2) 환경변수
cp .env.example .env   # 값 수정

# 3) 개발 서버
npm start
```
확인:
- Health: `GET http://localhost:8000/healthz` → `{ ok: true }`
- Swagger: `GET http://localhost:8000/api-docs`
---
## 7) 기본 라우팅(현재 상태)
```text
GET  /healthz        # 헬스체크
GET  /api-docs       # Swagger UI
GET  /               # 루트(라우터에서 처리)
```
> `src/routes/auth.js`는 스텁 상태입니다. 실제 구현 시 bcrypt/JWT/Passport 등을 붙이세요.
---
## 8) 코딩 컨벤션
- ESLint(Flat) + Prettier 사용
- import 정렬: 외부 라이브러리 → 내부 유틸/서비스 → 라우터/컨트롤러 → 스타일/기타
- ESM 로컬 임포트에 .js 확장자 필수
---
## 9) 👥 브랜치 전략
- 운영 브랜치: `develop`
- 개인 작업 브랜치: `ysy`, `jsy`, `jse`, `kty`
- 모든 기능 개발은 **개별 브랜치**에서 진행 후, `develop` **기준으로 PR** 생성
### 🔀 브랜치 작업 방법
### 1) 원격 브랜치 최초 체크아웃
```bash
git checkout -t origin/브랜치이름
# 예) git checkout -t origin/jsy
```
### 2) 이후 이동
```bash
git checkout 브랜치이름
```
### 3) 최초 push 업스트림 연결
```bash
git push --set-upstream origin 브랜치이름
# 이후에는 git push 만으로 OK
```
---
## ✍️ Git 커밋 메시지 규칙
### 형식
```bash
git commit -m "[태그] 작업 요약"
# 예:
git commit -m "[feat] 로그인 API 구현"
git commit -m "[fix] 영화 목록 페이징 버그 수정"
```
### 태그
| 태그       | 설명                                        |
| ---------- | ------------------------------------------- |
| `feat`     | 새로운 기능 추가                            |
| `patch`    | 간단한 수정 (줄바꿈, 줄추가, 정렬 등)       |
| `fix`      | 버그 수정                                   |
| `refactor` | 코드 리팩토링 (기능 변화 없음)              |
| `style`    | 스타일, 포맷팅, 주석 등 UI 외 변경          |
| `docs`     | 문서 (README 등) 변경                       |
| `test`     | 테스트 코드 추가/수정                       |
| `chore`    | 빌드, 패키지 매니저, 설정 파일 등 기타 작업 |
| `remove`   | 불필요한 코드/파일 제거                     |
> 메시지는 한 줄 요약(≈50자)으로, 의도가 드러나게 작성합니다.
