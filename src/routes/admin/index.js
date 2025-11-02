// moovy-api/src/routes/admin/index.js
import { Router } from 'express'
import usersRouter from './users.js'

const router = Router()

// /admin/users/*
router.use('/users', usersRouter)

export default router
