// moovy-api/src/routes_swagger/commentRouteApi.js

export const commentPaths = {
   // ─────────────────────────────
   // 1) 댓글 작성 → POST /api/comments
   // ─────────────────────────────
   '/api/comments': {
      post: {
         tags: ['Comments'],
         summary: '댓글 작성',
         description: '로그인한 사용자가 특정 토픽(topic_id)에 댓글을 작성합니다.',
         security: [{ sessionAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['topic_id', 'content'],
                     properties: {
                        topic_id: {
                           type: 'integer',
                           minimum: 1,
                           description: '댓글을 작성할 토픽 ID',
                           example: 101,
                        },
                        content: {
                           type: 'string',
                           minLength: 1,
                           description: '댓글 내용',
                           example: '재밌게 봤어요!',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: '댓글 작성 성공 (생성된 댓글 객체 반환)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           // ⚠️ 실제 컬럼명은 모델 정의에 따라 다를 수 있음
                           // (comment_id vs id 등) → 프로젝트 모델에 맞게 맞추면 더 완벽
                           comment_id: { type: 'integer', example: 55 },
                           topic_id: { type: 'integer', example: 101 },
                           user_id: { type: 'integer', example: 12 },
                           content: { type: 'string', example: '재밌게 봤어요!' },
                           created_at: { type: 'string', format: 'date-time', example: '2025-12-22T05:10:00.000Z' },
                           updated_at: { type: 'string', format: 'date-time', example: '2025-12-22T05:10:00.000Z' },
                        },
                     },
                  },
               },
            },
            400: {
               description: '필수 값 누락',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: 'topic_id와 content는 필수입니다.' },
                        },
                     },
                  },
               },
            },
            401: {
               description: '로그인 필요',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: '로그인이 필요합니다.' } },
                     },
                  },
               },
            },
            404: {
               description: '존재하지 않는 토픽',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: '존재하지 않는 토픽입니다.' } },
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
                        properties: {
                           message: { type: 'string', example: '코멘트 작성 실패' },
                           error: { type: 'string', example: 'DB error message...' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   // ─────────────────────────────
   // 2) 댓글 전체 조회(토픽 기준) → GET /api/comments/:topic_id
   //    무한 스크롤: page/limit 지원 (응답은 배열 그대로)
   // ─────────────────────────────
   '/api/comments/{topic_id}': {
      get: {
         tags: ['Comments'],
         summary: '토픽별 댓글 조회 (무한 스크롤)',
         description: '특정 토픽의 댓글을 최신순(created_at DESC)으로 조회합니다. 무한 스크롤을 위해 page/limit 기반 chunk fetch를 지원합니다. 응답은 댓글 배열 그대로 반환합니다.',
         security: [],
         parameters: [
            {
               name: 'topic_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 101 },
               description: '조회할 토픽 ID',
            },
            {
               name: 'page',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, example: 1 },
               description: '페이지 번호(옵션, 기본 1)',
            },
            {
               name: 'limit',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, maximum: 50, example: 10 },
               description: '가져올 개수(옵션, 1~50, 기본 10)',
            },
         ],
         responses: {
            200: {
               description: '댓글 목록 조회 성공 (배열 반환)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'array',
                        items: {
                           type: 'object',
                           properties: {
                              comment_id: { type: 'integer', example: 55 },
                              topic_id: { type: 'integer', example: 101 },
                              user_id: { type: 'integer', example: 12 },
                              content: { type: 'string', example: '재밌게 봤어요!' },
                              created_at: { type: 'string', format: 'date-time', example: '2025-12-22T05:10:00.000Z' },
                              updated_at: { type: 'string', format: 'date-time', example: '2025-12-22T05:10:00.000Z' },
                              User: {
                                 type: 'object',
                                 description: '작성자 정보(include)',
                                 properties: {
                                    user_id: { type: 'integer', example: 12 },
                                    name: { type: 'string', example: 'SweetYun' },
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            404: {
               description: '존재하지 않는 토픽',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '존재하지 않는 토픽입니다.' } } },
                  },
               },
            },
            500: {
               description: '서버 오류',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '코멘트 조회 실패' },
                           error: { type: 'string', example: 'DB error message...' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   // ─────────────────────────────
   // 3) 댓글 수정 → PUT /api/comments/:comment_id
   // 4) 댓글 삭제 → DELETE /api/comments/:comment_id
   // ─────────────────────────────
   '/api/comments/{comment_id}': {
      put: {
         tags: ['Comments'],
         summary: '댓글 수정',
         description: '로그인한 사용자가 본인 댓글을 수정합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'comment_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 55 },
               description: '수정할 댓글 ID',
            },
         ],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['content'],
                     properties: {
                        content: { type: 'string', minLength: 1, example: '내용 수정했어요.' },
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: '수정 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '수정 완료' },
                           comment: {
                              type: 'object',
                              properties: {
                                 comment_id: { type: 'integer', example: 55 },
                                 topic_id: { type: 'integer', example: 101 },
                                 user_id: { type: 'integer', example: 12 },
                                 content: { type: 'string', example: '내용 수정했어요.' },
                                 created_at: { type: 'string', format: 'date-time', example: '2025-12-22T05:10:00.000Z' },
                                 updated_at: { type: 'string', format: 'date-time', example: '2025-12-22T06:00:00.000Z' },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: 'content 누락',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: 'content는 필수입니다.' } } },
                  },
               },
            },
            401: {
               description: '로그인 필요',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '로그인이 필요합니다.' } } },
                  },
               },
            },
            403: {
               description: '권한 없음(본인 댓글 아님)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '본인의 코멘트만 수정할 수 있습니다.' } } },
                  },
               },
            },
            404: {
               description: '댓글 없음',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '코멘트가 존재하지 않습니다.' } } },
                  },
               },
            },
            500: {
               description: '서버 오류',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '코멘트 수정 실패' }, error: { type: 'string', example: 'DB error message...' } } },
                  },
               },
            },
         },
      },

      delete: {
         tags: ['Comments'],
         summary: '댓글 삭제',
         description: '로그인한 사용자가 본인 댓글을 삭제합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'comment_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 55 },
               description: '삭제할 댓글 ID',
            },
         ],
         responses: {
            200: {
               description: '삭제 성공',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '삭제 완료' } } },
                  },
               },
            },
            401: {
               description: '로그인 필요',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '로그인이 필요합니다.' } } },
                  },
               },
            },
            403: {
               description: '권한 없음(본인 댓글 아님)',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '본인의 코멘트만 삭제할 수 있습니다.' } } },
                  },
               },
            },
            404: {
               description: '댓글 없음',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '코멘트가 존재하지 않습니다.' } } },
                  },
               },
            },
            500: {
               description: '서버 오류',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '코멘트 삭제 실패' }, error: { type: 'string', example: 'DB error message...' } } },
                  },
               },
            },
         },
      },
   },
}
