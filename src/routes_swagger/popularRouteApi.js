// moovy-api/src/routes_swagger/popularRouteApi.js

export const popularPaths = {
   // ─────────────────────────────
   // 1) 오늘자 인기 영화 → GET /api/popular/movies/today
   // ─────────────────────────────
   '/api/popular/movies/today': {
      get: {
         tags: ['Popular'],
         summary: '오늘자 인기 영화 조회',
         description: "오늘 날짜(서버 기준, YYYY-MM-DD)의 인기 영화 스냅샷을 조회합니다. 기본 source는 'TMDB_TRENDING' 입니다.",
         security: [],
         responses: {
            200: {
               description: '조회 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           data: {
                              type: 'array',
                              items: {
                                 type: 'object',
                                 properties: {
                                    rank: { type: 'integer', example: 1 },
                                    snapshot_date: { type: 'string', example: '2025-12-22' },
                                    source: { type: 'string', example: 'TMDB_TRENDING' },
                                    content: {
                                       type: 'object',
                                       description: 'VideoContent (include)',
                                       properties: {
                                          content_id: { type: 'integer', example: 1001 },
                                          tmdb_id: { type: 'integer', example: 872585 },
                                          title: { type: 'string', example: 'Some Movie' },
                                          release_date: { type: 'string', example: '2025-11-20' },
                                          genre: { type: 'string', example: 'Action' },
                                          time: { type: 'integer', example: 124 },
                                          age_limit: { type: 'string', example: '15' },
                                          plot: { type: 'string', example: '...' },
                                          poster_path: { type: 'string', example: '/poster.jpg' },
                                          backdrop_path: { type: 'string', example: '/backdrop.jpg' },
                                       },
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },

            // 전역 에러핸들러가 어떤 형식인지 불명확해서 보수적으로 작성
            500: {
               description: '서버 오류',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: 'Internal Server Error' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   // ─────────────────────────────
   // 2) 특정 날짜 인기 영화 → GET /api/popular/movies/by-date?date=YYYY-MM-DD&source=
   // ─────────────────────────────
   '/api/popular/movies/by-date': {
      get: {
         tags: ['Popular'],
         summary: '특정 날짜 인기 영화 조회',
         description: "date(YYYY-MM-DD)로 해당 날짜의 인기 영화 스냅샷을 조회합니다. source를 주지 않으면 기본값은 'TMDB_TRENDING' 입니다.",
         security: [],
         parameters: [
            {
               name: 'date',
               in: 'query',
               required: true,
               schema: {
                  type: 'string',
                  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                  example: '2025-12-21',
               },
               description: '조회할 날짜(필수). 형식: YYYY-MM-DD',
            },
            {
               name: 'source',
               in: 'query',
               required: false,
               schema: {
                  type: 'string',
                  example: 'TMDB_TRENDING',
               },
               description: "데이터 소스(옵션). 기본값: 'TMDB_TRENDING'",
            },
         ],
         responses: {
            200: {
               description: '조회 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           data: {
                              type: 'array',
                              items: {
                                 type: 'object',
                                 properties: {
                                    rank: { type: 'integer', example: 1 },
                                    snapshot_date: { type: 'string', example: '2025-12-21' },
                                    source: { type: 'string', example: 'TMDB_TRENDING' },
                                    content: {
                                       type: 'object',
                                       properties: {
                                          content_id: { type: 'integer', example: 1001 },
                                          tmdb_id: { type: 'integer', example: 872585 },
                                          title: { type: 'string', example: 'Some Movie' },
                                          release_date: { type: 'string', example: '2025-11-20' },
                                          genre: { type: 'string', example: 'Action' },
                                          time: { type: 'integer', example: 124 },
                                          age_limit: { type: 'string', example: '15' },
                                          plot: { type: 'string', example: '...' },
                                          poster_path: { type: 'string', example: '/poster.jpg' },
                                          backdrop_path: { type: 'string', example: '/backdrop.jpg' },
                                       },
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },

            400: {
               description: 'date 누락 또는 형식 오류(YYYY-MM-DD 아님)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: false },
                           error: {
                              type: 'string',
                              example: "Invalid or missing 'date' parameter. Expected format: YYYY-MM-DD.",
                           },
                        },
                     },
                  },
               },
            },

            500: {
               description: '서버 오류',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: 'Internal Server Error' } },
                     },
                  },
               },
            },
         },
      },
   },
}
