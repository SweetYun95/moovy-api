// moovy-api/src/routes_swagger/ratingRouteApi.js

export const ratingPaths = {
   // ─────────────────────────────
   // 1) 별점 등록 또는 수정(업서트) → POST /api/ratings
   // ─────────────────────────────
   '/api/ratings': {
      post: {
         tags: ['Ratings'],
         summary: '별점 등록 또는 수정 (업서트)',
         description: '로그인 사용자가 특정 콘텐츠에 별점을 등록하거나 수정합니다. 성공 시 평점 요약(content_id, count, avg, myPoint)을 반환합니다.',
         security: [{ bearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['content_id', 'point'],
                     properties: {
                        content_id: {
                           type: 'integer',
                           minimum: 1,
                           description: '콘텐츠 ID',
                           example: 1001,
                        },
                        point: {
                           type: 'integer',
                           minimum: 0,
                           maximum: 10,
                           description: '별점(0~10)',
                           example: 8,
                        },
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: '생성 성공(처음 등록)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           created: { type: 'boolean', example: true },
                           content_id: { type: 'integer', example: 1001 },
                           count: { type: 'integer', example: 31 },
                           avg: { type: 'number', example: 7.6 },
                           myPoint: { type: 'integer', example: 8 },
                        },
                     },
                  },
               },
            },
            200: {
               description: '수정 성공(기존 별점 업데이트)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           created: { type: 'boolean', example: false },
                           content_id: { type: 'integer', example: 1001 },
                           count: { type: 'integer', example: 31 },
                           avg: { type: 'number', example: 7.6 },
                           myPoint: { type: 'integer', example: 9 },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패(express-validator)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           errors: {
                              type: 'array',
                              items: {
                                 type: 'object',
                                 properties: {
                                    type: { type: 'string', example: 'field' },
                                    msg: { type: 'string', example: 'Invalid value' },
                                    path: { type: 'string', example: 'point' },
                                    location: { type: 'string', example: 'body' },
                                    value: { example: 999 },
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            403: {
               description: '로그인 필요(isLoggedIn)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: '로그인이 필요합니다.' } },
                     },
                  },
               },
            },
            401: {
               description: '유효하지 않은 토큰(전역 토큰 검증 흐름에 따라 발생 가능)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '유효하지 않은 토큰입니다.' } } },
                  },
               },
            },
            419: {
               description: '토큰 만료(전역 토큰 검증 흐름에 따라 발생 가능)',
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
   // 2) 내 별점 삭제 → DELETE /api/ratings/:contentId
   // ─────────────────────────────
   '/api/ratings/{contentId}': {
      delete: {
         tags: ['Ratings'],
         summary: '내 별점 삭제',
         description: '로그인 사용자가 특정 콘텐츠에 남긴 별점을 삭제합니다. 삭제 후 해당 콘텐츠의 평점 요약을 반환합니다.',
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
               description: '삭제 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           removed: { type: 'boolean', example: true },
                           content_id: { type: 'integer', example: 1001 },
                           count: { type: 'integer', example: 30 },
                           avg: { type: 'number', example: 7.5 },
                           myPoint: { type: 'integer', nullable: true, example: null },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패(express-validator)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           errors: {
                              type: 'array',
                              items: {
                                 type: 'object',
                                 properties: {
                                    type: { type: 'string', example: 'field' },
                                    msg: { type: 'string', example: 'Invalid value' },
                                    path: { type: 'string', example: 'contentId' },
                                    location: { type: 'string', example: 'params' },
                                    value: { example: -1 },
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            403: {
               description: '로그인 필요(isLoggedIn)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '로그인이 필요합니다.' } } },
                  },
               },
            },
            401: {
               description: '유효하지 않은 토큰(전역 토큰 검증 흐름에 따라 발생 가능)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '유효하지 않은 토큰입니다.' } } },
                  },
               },
            },
            419: {
               description: '토큰 만료(전역 토큰 검증 흐름에 따라 발생 가능)',
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
   // 3) 특정 작품 평점 요약 → GET /api/ratings/contents/:id/rating
   //    공개 라우트(비로그인 가능) + 토큰이 있으면 myPoint 포함
   // ─────────────────────────────
   '/api/ratings/contents/{id}/rating': {
      get: {
         tags: ['Ratings'],
         summary: '작품 평점 요약 조회',
         description: '특정 콘텐츠의 평점 요약(평균, 개수, 내 점수)을 조회합니다. 비로그인도 가능하며, 로그인(또는 유효 토큰)이 있으면 myPoint가 포함됩니다.',
         security: [{ bearerAuth: [] }], // 선택 인증을 표현하려면 전역에서 security 옵션을 허용하는 설정이 필요할 수 있음
         parameters: [
            {
               name: 'id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 1001 },
               description: '콘텐츠 ID',
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
                           content_id: { type: 'integer', example: 1001 },
                           count: { type: 'integer', example: 31 },
                           avg: { type: 'number', example: 7.6 },
                           myPoint: {
                              type: 'integer',
                              nullable: true,
                              description: '로그인(또는 유효 토큰) 시 내 점수, 아니면 null',
                              example: null,
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: 'id 파싱 문제 등(프로젝트 전역 에러핸들러에 따라 달라질 수 있음)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: 'VALIDATION_ERROR' } } },
                  },
               },
            },
            401: {
               description: '유효하지 않은 토큰(토큰이 들어왔을 때만 의미 있음)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '유효하지 않은 토큰입니다.' } } },
                  },
               },
            },
            419: {
               description: '토큰 만료(토큰이 들어왔을 때만 의미 있음)',
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
