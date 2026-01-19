// moovy-api/src/routes/admin/index.js
import { Router } from 'express'
import usersRouter from './usersRoute.js'
import authRouter from './authRoute.js'
import qnaRouter from './qnaRoute.js'
import dashboardRouter from './dashboardRoute.js'
import topicsRouter from './topicsRoute.js'
import reportsRouter from './reportsRoute.js'
import tmdbRouter from './tmdbRoute.js'
import historyRouter from './historyRoute.js'

const router = Router()

router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/qna', qnaRouter)
router.use('/dashboard', dashboardRouter)
router.use('/topics', topicsRouter)
router.use('/reports', reportsRouter)
router.use('/tmdb', tmdbRouter)
router.use('/', historyRouter)

export default router
