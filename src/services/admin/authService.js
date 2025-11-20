// moovy-api/src/services/admin/authService.js
import bcrypt from 'bcrypt'

import db, { sequelize } from '../../models/index.js'
const { AdminUser } = db

export const signUp = async (email, password, name) => {
   const transaction = await sequelize.transaction()

   try {
      const exUser = await AdminUser.findOne({ where: { email }, transaction })
      if (exUser) {
         const error = new Error('이미 가입된 이메일 입니다.')
         error.status = 400
         throw error
      }
      const hash = await bcrypt.hash(password, 12)
      const newUser = await AdminUser.create(
         {
            name,
            email,
            password: hash,
         },
         { transaction }
      )
      await transaction.commit()
      return {
         success: true,
         data: {
            newUser: {
               user_id: newUser.user_id,
               name: newUser.name,
               email: newUser.email,
            },
         },
      }
   } catch (e) {
      await transaction.rollback()
      throw e
   }
}

export const withdraw = async (adminId) => {
   const transaction = await sequelize.transaction()

   try {
      const user = await AdminUser.findByPk(adminId, { transaction, lock: transaction.LOCK.UPDATE })
      if (!user) {
         const err = new Error('유저 정보를 찾지 못했습니다.')
         err.status = 404
         throw err
      }

      await user.destroy({ transaction })
      transaction.commit()

      return { success: true }
   } catch (e) {
      transaction.rollback()
      throw e
   }
}
