// moovy-api/src/app.js
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import { hydrateAuthFromToken } from "./middlewares/middlewares.js";

// ───────── 패스포트/라우터/DB import 지점
import "./auth/passport/index.js";
import passport from "passport";
import db from "./models/index.js";
import indexRouter from "./routes/index.js";

dotenv.config();

const app = express();
app.set("port", process.env.PORT || 8000);

// ───────── 공통 미들웨어
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.FRONTEND_APP_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET || "change-me",
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
});
app.use(sessionMiddleware);

// JWT 토큰이 있으면 req.authUser에 주입(세션과 공존)
app.use(hydrateAuthFromToken);

// ───────── 패스포트 초기화 – 세션 이후, 라우터 이전
app.use(passport.initialize());
app.use(passport.session());

// ───────── Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ───────── 메인 라우터
app.use("/api", indexRouter);

// ───────── 헬스
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// ───────── 404
app.use((req, _res, next) => {
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  err.status = 404;
  next(err);
});

// ───────── 에러 핸들러
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "서버 내부 오류";
  if (process.env.NODE_ENV !== "production") console.error(err);
  res.status(status).json({ success: false, message, details: err.details });
});

// ───────── DB 연결 & 동기화 (보통 server.js에서 실행하지만 여기서 처리)
await db.sequelize.authenticate();
await db.sequelize.sync();

// ───────── 실행
app.listen(app.get("port"), () => {
  console.log(`🚀 Moovy API on http://localhost:${app.get("port")}`);
});

export default app;
