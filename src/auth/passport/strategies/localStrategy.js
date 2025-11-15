// moovy-api/src/auth/passport/strategies/localStrategy.js

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import db from '../../../models/index.js'
const { User } = db

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000 // 2시간 (밀리초)

passport.use(
   new LocalStrategy(
      {
         usernameField: 'email',
         passwordField: 'password',
      },
      async (email, password, done) => {
         try {
            const user = await User.findOne({ where: { email } })
            if (!user) {
               //이메일이 없는 경우
               return done(null, false, { message: '가입되지 않은 email입니다.' })
            }

            if (user.isLocked()) {
               return done(null, false, { message: '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.' })
            }

            const result = await bcrypt.compare(password, user.password)
            if (!result) {
               //비밀번호가 일치하지 않은 경우
               const updatedAttempts = user.loginAttempts + 1
               const attemptsLeft = MAX_LOGIN_ATTEMPTS - updatedAttempts
               const updates = { loginAttempts: updatedAttempts }

               if (attemptsLeft == 0) {
                  updates.lockUntil = new Date(Date.now() + LOCK_TIME)
                  await user.update(updates)
                  return done(null, false, { message: '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.' })
               } else if (attemptsLeft <= 3) {
                  await user.update(updates)
                  return done(null, false, { message: `비밀번호가 일치하지 않습니다. (남은 시도 ${attemptsLeft}회)` })
               } else {
                  await user.update(updates)
                  return done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
               }
            } else {
               //로그인 성공시
               await user.update({
                  loginAttempts: 0,
                  lockUntil: null,
               })
               return done(null, user)
            }
         } catch (error) {
            return done(error)
         }
      }
   )
)
