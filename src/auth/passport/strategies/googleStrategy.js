// moovy-api/src/auth/passport/strategies/googleStrategy.js
import 'dotenv/config'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import db from '../../../models/index.js'

const { User } = db

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_CALLBACK_URL,
         passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
         // 사용자 DB 조회/등록 로직
         try {
            //이미 같은 이메일의 로컬or 다른소셜 회원가입이 되어있을때
            const exUser = await User.findOne({
               where: {
                  email: profile?.emails[0]?.value,
                  google: false,
               },
            })
            if (exUser) {
               exUser.update({
                  google: true,
                  google_id: profile.id,
               })
               return done(null, exUser)
            }

            const user = await User.findOne({
               where: {
                  google: true,
                  google_id: profile.id,
               },
            })

            if (user) {
               return done(null, user)
            }

            const newUser = await User.create({
               google: true,
               google_id: profile.id,
               email: profile?.emails[0]?.value,
               name: profile.displayName,
               profile_img: profile?.photos[0]?.value || null,
            })
            return done(null, newUser)
         } catch (error) {
            return done(error)
         }
      }
   )
)
