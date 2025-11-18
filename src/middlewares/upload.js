// moovy-api/src/middlewares/upload.js
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// 저장 경로 없으면 생성
const uploadPath = 'uploads/qna'
if (!fs.existsSync(uploadPath)) {
   fs.mkdirSync(uploadPath, { recursive: true })
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

export const uploadQna = multer({
   storage,
   limits: { files: 5 }, // 최대 5개
})
