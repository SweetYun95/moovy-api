// moovy-api/src/services/authService.js
import bcrypt from "bcrypt";

import db, { sequelize } from "../models/index.js";
const { User } = db;

//회원가입
export const signUp = async (email, name, password) => {
  const transaction = await sequelize.transaction();

  try {
    const exUser = await User.findOne({ where: { email }, transaction });
    if (exUser) {
      const error = new Error("이미 가입된 이메일 입니다.");
      error.status = 400;
      throw error;
    }

    const hash = await bcrypt.hash(password, 12);

    const newUser = await User.create(
      {
        name,
        email,
        password: hash,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      data: {
        newUser: {
          user_id: newUser.user_id,
          nick: newUser.nick,
          email: newUser.email,
        },
      },
    };
  } catch (e) {
    console.log("--------------------회원가입에 실패했습니다.");

    await transaction.rollback();
    throw e;
  }
};

// 소셜 연동 해제
export const socialDisconnect = async (userId, provide) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!user) {
      const err = new Error("유저 정보를 찾지 못했습니다.");
      err.status = 404;
      throw err;
    }

    const providerFlag = provide; // ex: 'kakao'
    const providerIdField = `${provide}_id`; // ex: 'kakao_id'

    if (!user[providerFlag] && !user[providerIdField]) {
      // 이미 끊긴 상태 — 클라이언트가 204를 기대할 수 있음 (또는 200 + message)
      return { success: true, message: "이미 해제된 상태입니다." };
    }

    const updated = await user.update(
      {
        [providerFlag]: false,
        [providerIdField]: null,
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      data: {
        newUser: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          kakao: updated.kakao,
          kakao_id: updated.kakao_id,
          google: updated.google,
          google_id: updated.google_id,
        },
      },
    };
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};

//회원탈퇴 (소프트 삭제)
export const withdraw = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!user) {
      const err = new Error("유저 정보를 찾지 못했습니다.");
      err.status = 404;
      throw err;
    }

      await user.destroy({ transaction })
      transaction.commit()
      return { success: true }
   } catch (e) {
      transaction.rollback()
      throw e
   }
}

//이메일 중복확인
export const checkEmail = async (email) => {
   const exUser = await User.findOne({ where: { email } })
   return { success: true, isDuplicate: !!exUser }
}
