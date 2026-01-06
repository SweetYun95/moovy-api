// moovy-api/src/controllers/authController.js

import * as svc from "../services/authService.js";
import { normalizeProvide } from "../validations/dto/authDto.js";
import passport from "passport";

// 로컬 회원가입
// export const localSignUp = async (req, res, next) => {
//   try {
//     console.log("---------body 값:", req.body);
//     const { email, password, name } = req.validated.body;
//     const result = await svc.signUp(email, name, password);
//     res.status(201).json(result);
//   } catch (e) {
//     console.log("---------에러 났음!!:", error);

//     next(e);
//   }
// };

export const localSignUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await svc.signUp(email, name, password);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

//로컬 로그인
export const localLogIn = async (req, res, next) => {
  req.body = req.validated?.body ?? req.body;
  passport.authenticate("local-user", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const error = new Error(info?.message);
      error.status = 401;
      return next(error);
    }
    req.login(user, (err) => {
      if (err) return next(err);

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

//로그아웃
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
// 로그인 여부 확인
export const check = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return res.json({
        success: true,
        isLoggedIn: true,
      });
    } else {
      return res.json({
        success: true,
        isLoggedIn: false,
      });
    }
  } catch (e) {
    next(e);
  }
};

//로그인중인 사용자 정보 가져오기
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    // Sequelize 인스턴스를 plain object로 변환
    const userData = user.toJSON ? user.toJSON() : user;

    res.json({
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

//연동 해제
export const socialDisconnect = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const provide = normalizeProvide(req.validated?.params ?? req.params);

    const result = await svc.socialDisconnect(userId, provide);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

//회원 탈퇴
export const withdraw = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await svc.withdraw(userId);
    res.json(result);
  } catch (e) {
    next(e);
  }
};
