// moovy-api/src/auth/passport/strategies/kakaoStrategy.js

import 'dotenv/config'
import passport from 'passport'
import { Strategy as KakaoStrategy } from 'passport-kakao'
import db from '../../../models/index.js'

const { User } = db

passport.use(
   new KakaoStrategy(
      {
         clientID: process.env.KAKAO_REST_API_KEY,
         callbackURL: process.env.KAKAO_REDIRECT_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
         try {
            const kakaoAccount = profile._json.kakao_account

            //이미 같은 이메일의 로컬or 다른소셜 회원가입이 되어있을때
            const exUser = await User.findOne({
               where: {
                  email: kakaoAccount.email,
                  kakao: false,
               },
            })
            if (exUser) {
               exUser.update({
                  kakao: true,
                  kakao_id: profile.id,
               })
               return done(null, exUser)
            }

            // 사용자 DB 조회/등록 로직
            const user = await User.findOne({
               where: {
                  kakao: true,
                  kakao_id: profile.id.toString(),
               },
            })

            if (user) {
               return done(null, user)
            } else {
               const newUser = await User.create({
                  kakao: true,
                  kakao_id: profile.id,
                  name: kakaoAccount.profile?.nickname || '카카오유저',
                  email: kakaoAccount.email || `kakao_${profile.id}@temp.email`, // 임시 이메일
                  profile_img: kakaoAccount.profile?.profile_image_url || null,
               })

               return done(null, newUser)
            }
         } catch (error) {
            return done(error)
         }
      }
   )
)
