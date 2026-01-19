// moovy-api/src/services/admin/tmdbService.js
import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'

const getConfig = () => {
   const apiKey = process.env.TMDB_API_KEY
   const language = process.env.TMDB_LANGUAGE || 'ko-KR'

   if (!apiKey) {
      const err = new Error('TMDB_API_KEY is not set in environment variables.')
      err.status = 500
      throw err
   }

   return { apiKey, language }
}

export const searchMovies = async ({ q, page = 1 }) => {
   const { apiKey, language } = getConfig()

   const url = `${BASE_URL}/search/movie`
   const resp = await axios.get(url, {
      timeout: 10000,
      params: {
         api_key: apiKey,
         language,
         query: q,
         page,
         include_adult: false,
      },
   })

   // 프론트에서 쓰기 좋게 살짝 정규화
   const data = resp.data || {}
   return {
      page: data.page ?? page,
      total_pages: data.total_pages ?? 0,
      total_results: data.total_results ?? 0,
      results: (data.results ?? []).map((m) => ({
         tmdb_id: m.id,
         title: m.title ?? m.original_title,
         original_title: m.original_title,
         release_date: m.release_date,
         poster_path: m.poster_path,
         backdrop_path: m.backdrop_path,
         overview: m.overview,
      })),
   }
}

export const getMovieDetail = async ({ tmdb_id }) => {
   const { apiKey, language } = getConfig()

   const url = `${BASE_URL}/movie/${tmdb_id}`
   const resp = await axios.get(url, {
      timeout: 10000,
      params: {
         api_key: apiKey,
         language,
      },
   })

   const m = resp.data || {}
   return {
      tmdb_id: m.id,
      title: m.title ?? m.original_title,
      original_title: m.original_title,
      release_date: m.release_date,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      overview: m.overview,
      runtime: m.runtime,
      genres: (m.genres ?? []).map((g) => ({ id: g.id, name: g.name })),
      adult: m.adult,
      homepage: m.homepage,
      status: m.status,
      tagline: m.tagline,
   }
}
