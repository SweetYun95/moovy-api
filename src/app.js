// moovy-api/src/app.js
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { swaggerUi, swaggerSpec } from './swagger.js'

// ★ (미래) 패스포트/라우터/DB import 지점
// import passport from 'passport'
// import passportConfig from './auth/passport/index.js'
import { sequelize } from './models/index.js'
import indexRouter from './routes/index.js'

dotenv.config()

const app = express()
app.set('port', process.env.PORT || 8000)

// ───────── 미들웨어
app.use(helmet())
app.use(
   cors({
      origin: process.env.FRONTEND_APP_URL || process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
   })
)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))

const sessionMiddleware = session({
   resave: false,
   saveUninitialized: false,
   secret: process.env.COOKIE_SECRET || 'change-me',
   cookie: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 },
})
app.use(sessionMiddleware)

// ★ (미래) 패스포트 초기화 지점 – 세션 이후, 라우터 이전
// app.use(passport.initialize())
// app.use(passport.session())
// passportConfig()

// ───────── Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 메인 라우터 장착
app.use('/', indexRouter)

// ───────── 헬스
app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }))

// ───────── 404
app.use((req, _res, next) => {
   const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
   err.status = 404
   next(err)
})

// ───────── 에러 핸들러
app.use((err, _req, res, _next) => {
   const status = err.status || 500
   const message = err.message || '서버 내부 오류'
   if (process.env.NODE_ENV !== 'production') console.error(err)
   res.status(status).json({ success: false, message })
})

// ★ (미래) DB sync 지점 – 보통 server.js에서 리슨 전 실행 권장
await sequelize.authenticate()
await sequelize.sync()

// ───────── 실행 (socket 미사용 버전)
app.listen(app.get('port'), () => {
   console.log(`🚀 Moovy API on http://localhost:${app.get('port')}`)
})
