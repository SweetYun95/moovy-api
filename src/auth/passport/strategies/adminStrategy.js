// moovy-api/src/auth/passport/strategies/adminStrategy.js

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import db from '../../../models/index.js'
const { AdminUser } = db

passport.use(
   new LocalStrategy(
      {
         usernameField: 'email',
         passwordField: 'password',
      },
      async (email, password, done) => {
         try {
            const user = await AdminUser.findOne({ where: { email } })
            if (!user) {
               //이메일이 없는 경우
               return done(null, false, { message: '가입되지 않은 email입니다.' })
            }
            const result = await bcrypt.compare(password, user.password)
            if (!result) {
               //비밀번호가 일치하지 않은 경우
               return done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
            } else {
               //로그인 성공시
               return done(null, user)
            }
         } catch (error) {
            return done(error)
         }
      }
   )
)
