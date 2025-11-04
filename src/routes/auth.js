// moovy-api/src/routes/auth.js
import { Router } from 'express'
import bcrypt from 'bcrypt'
import db from '../models/index.js'
const { User } = db

const router = Router()

//로컬 회원가입

//로컬 로그인

//카카오 로그인/회원가입

//구글 로그인/회원가입

//로그아웃

//로그인중인 사용자 정보 가져오기

//회원 탈퇴

//연동 해제

export default router
