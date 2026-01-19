// moovy-api/src/auth/passport/index.js

import passport from 'passport'

import './strategies/localStrategy.js'
import './strategies/googleStrategy.js'
import './strategies/kakaoStrategy.js'
import './strategies/adminStrategy.js'
import db from '../../models/index.js'

passport.serializeUser((entity, done) => {
   // Admin 테이블이면 admin_id가 존재함
   if (entity.admin_id) {
      done(null, { id: entity.admin_id, type: 'admin' })
   } else {
      done(null, { id: entity.user_id, type: 'user' })
   }
})

passport.deserializeUser(async (data, done) => {
   try {
      const Model = data.type === 'admin' ? db.AdminUser : db.User
      const user = await Model.findByPk(data.id)
      done(null, user)
   } catch (err) {
      done(err)
   }
})

export default passport
