// moovy-api/src/controllers/authController.js

import * as svc from "../services/authService.js";
import { normalizeProvide } from "../validations/dto/authDto.js";
import passport from "passport";

// ─────────────────────────────
// 로컬 회원가입
// ─────────────────────────────
export const localSignUp = async (req, res, next) => {
  try {
    // validate 미들웨어 사용 시 validated 우선
    const body = req.validated?.body ?? req.body;
    const { email, password, name } = body;

    const result = await svc.signUp(email, name, password);
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 로컬 로그인
// ─────────────────────────────
export const localLogIn = async (req, res, next) => {
  req.body = req.validated?.body ?? req.body;

  passport.authenticate("local-user", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const error = new Error(info?.message);
      error.status = 401;
      return next(error);
    }

    req.login(user, (err2) => {
      if (err2) return next(err2);

      return res.json({
        success: true,
        data: {
          user: {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
          },
        },
      });
    });
  })(req, res, next);
};

// ─────────────────────────────
// 로그아웃
// ─────────────────────────────
export const logOut = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);

      req.session.destroy((destroyErr) => {
        if (destroyErr) return next(destroyErr);

        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 로그인 여부 확인
// ─────────────────────────────
export const check = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return res.json({
        success: true,
        isLoggedIn: true,
      });
    }
    return res.json({
      success: true,
      isLoggedIn: false,
    });
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 로그인중인 사용자 정보 가져오기
// ─────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    const userData = user?.toJSON ? user.toJSON() : user;

    return res.json({
      success: true,
      data: {
        user: {
          ...userData,
          password: null,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 연동 해제
// ─────────────────────────────
export const socialDisconnect = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const provide = normalizeProvide(req.validated?.params ?? req.params);

    const result = await svc.socialDisconnect(userId, provide);
    return res.json(result);
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 회원 탈퇴
// ─────────────────────────────
export const withdraw = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await svc.withdraw(userId);
    return res.json(result);
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 이메일 중복 확인
// ─────────────────────────────
export const checkEmail = async (req, res, next) => {
  try {
    const body = req.validated?.body ?? req.body;
    const { email } = body;

    const result = await svc.checkEmail(email);
    return res.json(result);
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 비밀번호 재설정 요청(메일 발송)
// ─────────────────────────────
export const passwordResetRequest = async (req, res, next) => {
  try {
    const body = req.validated?.body ?? req.body;
    const email = body.email;

    if (!email) {
      const err = new Error("email is required");
      err.status = 400;
      throw err;
    }

    // 서비스 함수명이 팀마다 다를 수 있어서 "존재하는 것"을 우선 호출
    const fn =
      svc.passwordResetRequest ??
      svc.requestPasswordReset ??
      svc.sendPasswordResetEmail ??
      svc.createPasswordResetToken;

    if (typeof fn !== "function") {
      const err = new Error(
        "Password reset service function is not implemented (authService.js)"
      );
      err.status = 500;
      throw err;
    }

    const result = await fn(email, body);

    return res.status(200).json(
      result ?? {
        success: true,
        message: "Password reset email sent (if the account exists).",
      }
    );
  } catch (e) {
    next(e);
  }
};

// ─────────────────────────────
// 비밀번호 재설정 확정(토큰 + 새 비번)
// ─────────────────────────────
export const passwordResetConfirm = async (req, res, next) => {
  try {
    const body = req.validated?.body ?? req.body;
    const { token, password } = body;

    if (!token || !password) {
      const err = new Error("token and password are required");
      err.status = 400;
      throw err;
    }

    const fn =
      svc.passwordResetConfirm ??
      svc.confirmPasswordReset ??
      svc.resetPasswordWithToken ??
      svc.updatePasswordByResetToken;

    if (typeof fn !== "function") {
      const err = new Error(
        "Password reset confirm service function is not implemented (authService.js)"
      );
      err.status = 500;
      throw err;
    }

    const result = await fn(token, password, body);

    return res.status(200).json(
      result ?? {
        success: true,
        message: "Password has been reset successfully.",
      }
    );
  } catch (e) {
    next(e);
  }
};
