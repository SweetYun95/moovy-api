// moovy-api/src/controllers/favorite.controller.js
import * as svc from '../services/favoriteService.js'
import { normalizePagination } from '../validations/dto/commonDto.js'
import { normalizeContentId } from '../validations/dto/favoriteDto.js'

export const listMyFavorites = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const { page, limit, offset } = normalizePagination(req.validated?.query ?? req.query)
      const data = await svc.listMyFavorites({ userId, page, limit, offset })
      res.json(data)
   } catch (e) {
      next(e)
   }
}

export const checkFavorite = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const contentId = normalizeContentId(req.validated?.params ?? req.params)
      const isFavorite = await svc.checkFavorite({ userId, contentId })
      res.json({ isFavorite })
   } catch (e) {
      next(e)
   }
}

export const addFavorite = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const contentId = normalizeContentId(req.validated?.params ?? req.params)
      const result = await svc.addFavorite({ userId, contentId })
      if (!result.created) {
         if (result.reason === 'ALREADY_FAVORITED') return res.status(409).json({ message: result.reason })
         if (result.reason === 'CONTENT_NOT_FOUND') return res.status(404).json({ message: result.reason })
      }
      res.status(201).json({ ok: true })
   } catch (e) {
      next(e)
   }
}

export const removeFavorite = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const contentId = normalizeContentId(req.validated?.params ?? req.params)
      await svc.removeFavorite({ userId, contentId })
      res.status(204).end()
   } catch (e) {
      next(e)
   }
}

export const toggleFavorite = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const contentId = normalizeContentId(req.validated?.params ?? req.params)
      const { isFavorite } = await svc.toggleFavorite({ userId, contentId })
      res.json({ isFavorite })
   } catch (e) {
      next(e)
   }
}
