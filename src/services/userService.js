// moovy-api/src/services/userService.js
import db from '../models/index.js'

// ─────────────────────────────────────────
// 사용자 정보 수정 서비스
// ─────────────────────────────────────────
export async function updateUserProfile(userId, { name, email }) {
   const [updatedRowsCount, [updatedUser]] = await db.User.update(
      { name, email },
      {
         where: { user_id: userId },
         returning: true,
      }
   )
   if (updatedRowsCount === 0) {
      throw new Error('User not found or no changes made')
   }
   return updatedUser
}

// ─────────────────────────────────────────
// 프로필 이미지 변경 서비스
// ─────────────────────────────────────────
export async function updateProfileImage(userId, imagePath) {
   //1. 기존 유저 정보 조회
   const user = await db.User.findByPk(userId)
   if (!user) {
      throw new Error('User not found')
   }

   //2. 기존 이미지 경로
   const oldImagePath = user.profile_image

   //3. DB 업데이트
   user.profile_image = imagePath
   await user.save()

   //4. 기존 이미지 파일 삭제 (기본 이미지가 아닐 경우)
   const defaultImagePath = 'uploads/user/default-profile.png' // 기본 이미지 경로
   if (oldImagePath && oldImagePath !== defaultImagePath) {
      fs.unlink(oldImagePath).catch((err) => {
         console.log('Failed to delete old profile image:', err)
      })
   }

   return updatedUser
}

// ─────────────────────────────────────────
// 닉네임 중복 확인 서비스
// ─────────────────────────────────────────
export async function isNicknameAvailable(name) {
   const existingUser = await db.User.findOne({ where: { name } })
   return existingUser ? false : true
}
