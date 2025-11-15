// moovy-api/src/routes/admin/index.js
import { Router } from 'express'
import usersRouter from './usersRoute.js'

const router = Router()

// /admin/users/*
router.use('/users', usersRouter)

export default router
