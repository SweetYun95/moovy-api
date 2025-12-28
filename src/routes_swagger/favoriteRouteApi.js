// moovy-api/src/routes_swagger/favoriteRouteApi.js

export const favoritePaths = {
   // ─────────────────────────────
   // 1) 내 즐겨찾기 목록 → GET /api/favorites?page=&limit=
   // ─────────────────────────────
   '/api/favorites': {
      get: {
         tags: ['Favorites'],
         summary: '내 즐겨찾기 목록 조회',
         description: '로그인한 사용자의 즐겨찾기 목록을 조회합니다. page/limit 기반 페이징을 지원합니다.',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               name: 'page',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, default: 1, example: 1 },
               description: '페이지 번호 (기본 1)',
            },
            {
               name: 'limit',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, maximum: 50, default: 10, example: 10 },
               description: '페이지 당 개수 (1~50, 기본 10)',
            },
         ],
         responses: {
            200: {
               description: '즐겨찾기 목록 조회 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        description: 'favoriteService.listMyFavorites의 반환값을 그대로 반환합니다(프로젝트 실제 반환 구조에 맞게 properties를 보강하세요).',
                        properties: {
                           items: {
                              type: 'array',
                              items: { type: 'object' },
                           },
                           pagination: {
                              type: 'object',
                              properties: {
                                 page: { type: 'integer', example: 1 },
                                 limit: { type: 'integer', example: 10 },
                                 total: { type: 'integer', example: 123 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패(Zod)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: 'VALIDATION_ERROR' },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
            401: {
               description: '인증 실패(토큰 없음/유효하지 않음)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: '인증 토큰이 필요합니다.' } },
                     },
                  },
               },
            },
            419: {
               description: '토큰 만료',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: '토큰이 만료되었습니다.' } },
                     },
                  },
               },
            },
         },
      },
   },

   // ─────────────────────────────
   // 2) 즐겨찾기 여부 확인 → GET /api/favorites/:contentId/check
   // ─────────────────────────────
   '/api/favorites/{contentId}/check': {
      get: {
         tags: ['Favorites'],
         summary: '즐겨찾기 여부 확인',
         description: '로그인한 사용자가 특정 콘텐츠를 즐겨찾기 했는지 확인합니다.',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               name: 'contentId',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 1001 },
               description: '콘텐츠 ID',
            },
         ],
         responses: {
            200: {
               description: '확인 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           isFavorite: { type: 'boolean', example: true },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패(Zod)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: 'VALIDATION_ERROR' },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
            401: {
               description: '인증 실패(토큰 없음/유효하지 않음)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: '인증 토큰이 필요합니다.' } },
                     },
                  },
               },
            },
            419: {
               description: '토큰 만료',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '토큰이 만료되었습니다.' } } },
                  },
               },
            },
         },
      },
   },

   // ─────────────────────────────
   // 3) 즐겨찾기 추가 → POST /api/favorites/:contentId
   // ─────────────────────────────
   '/api/favorites/{contentId}': {
      post: {
         tags: ['Favorites'],
         summary: '즐겨찾기 추가',
         description: '로그인한 사용자가 특정 콘텐츠를 즐겨찾기에 추가합니다.',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               name: 'contentId',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 1001 },
               description: '콘텐츠 ID',
            },
         ],
         responses: {
            201: {
               description: '즐겨찾기 추가 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { ok: { type: 'boolean', example: true } },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패(Zod)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: 'VALIDATION_ERROR' },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
            401: {
               description: '인증 실패(토큰 없음/유효하지 않음)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '인증 토큰이 필요합니다.' } } },
                  },
               },
            },
            404: {
               description: '콘텐츠를 찾을 수 없음',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: 'CONTENT_NOT_FOUND' } } },
                  },
               },
            },
            409: {
               description: '이미 즐겨찾기 상태',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: 'ALREADY_FAVORITED' } } },
                  },
               },
            },
            419: {
               description: '토큰 만료',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '토큰이 만료되었습니다.' } } },
                  },
               },
            },
         },
      },

      // ─────────────────────────────
      // 4) 즐겨찾기 삭제 → DELETE /api/favorites/:contentId
      // ─────────────────────────────
      delete: {
         tags: ['Favorites'],
         summary: '즐겨찾기 삭제',
         description: '로그인한 사용자가 특정 콘텐츠를 즐겨찾기에서 제거합니다.',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               name: 'contentId',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 1001 },
               description: '콘텐츠 ID',
            },
         ],
         responses: {
            204: {
               description: '삭제 성공 (응답 본문 없음)',
            },
            400: {
               description: '유효성 검사 실패(Zod)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: 'VALIDATION_ERROR' },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
            401: {
               description: '인증 실패(토큰 없음/유효하지 않음)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '인증 토큰이 필요합니다.' } } },
                  },
               },
            },
            419: {
               description: '토큰 만료',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '토큰이 만료되었습니다.' } } },
                  },
               },
            },
         },
      },
   },

   // ─────────────────────────────
   // 5) 즐겨찾기 토글 → POST /api/favorites/:contentId/toggle
   // ─────────────────────────────
   '/api/favorites/{contentId}/toggle': {
      post: {
         tags: ['Favorites'],
         summary: '즐겨찾기 토글',
         description: '즐겨찾기 상태를 토글합니다. 토글 결과로 isFavorite(boolean)을 반환합니다.',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               name: 'contentId',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 1001 },
               description: '콘텐츠 ID',
            },
         ],
         responses: {
            200: {
               description: '토글 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { isFavorite: { type: 'boolean', example: true } },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패(Zod)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: 'VALIDATION_ERROR' }, errors: { type: 'object' } } },
                  },
               },
            },
            401: {
               description: '인증 실패(토큰 없음/유효하지 않음)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '인증 토큰이 필요합니다.' } } },
                  },
               },
            },
            419: {
               description: '토큰 만료',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '토큰이 만료되었습니다.' } } },
                  },
               },
            },
         },
      },
   },
}
