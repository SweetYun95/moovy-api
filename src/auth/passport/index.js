// moovy-api/src/auth/passport/index.js

import passport from 'passport'

import './strategies/localStrategy.js'
import './strategies/googleStrategy.js'
import './strategies/kakaoStrategy.js'
import db from '../../models/index.js'
const { User } = db

passport.serializeUser((user, done) => done(null, user.id)) //로그인, 회원가입시 실행됨
passport.deserializeUser(async (id, done) => {
   //로그인된 사용자의 모든 요청시 실행되어 유저정보를 가져옴
   try {
      const user = await User.findByPk(id)
      if (!user) return done(null, false)
      done(null, user)
   } catch (err) {
      done(err)
   }
})

export default passport
