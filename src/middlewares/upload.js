// moovy-api/src/middlewares/upload.js
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// 저장 경로 없으면 생성
const uploadPath = 'uploads/qna'
if (!fs.existsSync(uploadPath)) {
   fs.mkdirSync(uploadPath, { recursive: true })
}
const userUploadPath = 'uploads/user'
if (!fs.existsSync(userUploadPath)) {
   fs.mkdirSync(userUploadPath, { recursive: true })
}

const storage = multer.diskStorage({
   destination(req, file, done) {
      done(null, uploadPath)
   },
   filename(req, file, done) {
      const ext = path.extname(file.originalname)
      const basename = path.basename(file.originalname, ext)
      done(null, `${basename}-${Date.now()}${ext}`)
   },
})

// Only allow image files (jpg, jpeg, png, gif)
const fileFilter = (req, file, cb) => {
   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
   } else {
      cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false)
   }
}

export const uploadQna = multer({
   storage,
   limits: { files: 5, fileSize: 5 * 1024 * 1024 }, // 최대 5개, 파일당 최대 5MB
   fileFilter,
})

export const uploadUserProfile = multer({
   storage: multer.diskStorage({
      destination(req, file, done) {
         done(null, userUploadPath)
      },
      filename(req, file, done) {
         const ext = path.extname(file.originalname)
         const basename = path.basename(file.originalname, ext)
         done(null, `${basename}-profile-${Date.now()}${ext}`)
      },
   }),
   limits: { files: 1, fileSize: 2 * 1024 * 1024 }, // 최대 1개, 파일당 최대 2MB
   fileFilter,
})
