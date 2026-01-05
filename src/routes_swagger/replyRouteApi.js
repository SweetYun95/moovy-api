// moovy-api/src/routes_swagger/replyRouteApi.js

export const replyPaths = {
   // ─────────────────────────────
   // 1) 대댓글 작성 → POST /api/replies
   // ─────────────────────────────
   '/api/replies': {
      post: {
         tags: ['Replies'],
         summary: '대댓글 작성',
         description: '로그인 사용자가 특정 코멘트(comment_id)에 대댓글을 작성합니다. 성공 시 작성자 정보(User)를 포함한 대댓글을 반환합니다.',
         security: [{ bearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['comment_id', 'content'],
                     properties: {
                        comment_id: {
                           type: 'integer',
                           minimum: 1,
                           description: '상위 코멘트 ID',
                           example: 12,
                        },
                        content: {
                           type: 'string',
                           description: '대댓글 내용',
                           example: 'ㄹㅇ 공감합니다 ㅋㅋ',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: '대댓글 작성 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        description: 'CommentReply + 작성자(User) include',
                        properties: {
                           reply_id: { type: 'integer', example: 101 },
                           comment_id: { type: 'integer', example: 12 },
                           user_id: { type: 'integer', example: 7 },
                           content: { type: 'string', example: 'ㄹㅇ 공감합니다 ㅋㅋ' },
                           created_at: { type: 'string', example: '2025-12-22T05:30:00.000Z' },
                           updated_at: { type: 'string', example: '2025-12-22T05:30:00.000Z' },
                           User: {
                              type: 'object',
                              properties: {
                                 user_id: { type: 'integer', example: 7 },
                                 name: { type: 'string', example: '스위티' },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '필수값 누락(comment_id/content)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: 'comment_id와 content는 필수입니다.' } },
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
            404: {
               description: '상위 코멘트 없음',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '상위 코멘트가 존재하지 않습니다.' } } },
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
                           message: { type: 'string', example: '대댓글 작성 실패' },
                           error: { type: 'string', example: '...' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   // ─────────────────────────────
   // 2) 대댓글 목록 조회 → GET /api/replies/:comment_id?page=1&size=20
   // ─────────────────────────────
   '/api/replies/{comment_id}': {
      get: {
         tags: ['Replies'],
         summary: '대댓글 목록 조회',
         description: '특정 코멘트(comment_id)에 달린 대댓글 목록을 조회합니다. 페이지네이션(page/size)을 반환하며, 정렬은 created_at ASC 입니다.',
         security: [],
         parameters: [
            {
               name: 'comment_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 12 },
               description: '상위 코멘트 ID',
            },
            {
               name: 'page',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, default: 1, example: 1 },
               description: '페이지 번호(기본 1)',
            },
            {
               name: 'size',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, maximum: 100, default: 20, example: 20 },
               description: '페이지 당 개수(기본 20, 최대 100)',
            },
         ],
         responses: {
            200: {
               description: '대댓글 목록 조회 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           items: {
                              type: 'array',
                              items: {
                                 type: 'object',
                                 properties: {
                                    reply_id: { type: 'integer', example: 101 },
                                    comment_id: { type: 'integer', example: 12 },
                                    user_id: { type: 'integer', example: 7 },
                                    content: { type: 'string', example: 'ㄹㅇ 공감합니다 ㅋㅋ' },
                                    created_at: { type: 'string', example: '2025-12-22T05:30:00.000Z' },
                                    User: {
                                       type: 'object',
                                       properties: {
                                          user_id: { type: 'integer', example: 7 },
                                          name: { type: 'string', example: '스위티' },
                                       },
                                    },
                                 },
                              },
                           },
                           meta: {
                              type: 'object',
                              properties: {
                                 page: { type: 'integer', example: 1 },
                                 size: { type: 'integer', example: 20 },
                                 total: { type: 'integer', example: 53 },
                                 totalPages: { type: 'integer', example: 3 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            404: {
               description: '상위 코멘트 없음',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '상위 코멘트가 존재하지 않습니다.' } } },
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
                           message: { type: 'string', example: '대댓글 조회 실패' },
                           error: { type: 'string', example: '...' },
                        },
                     },
                  },
               },
            },
         },
      },

      // ─────────────────────────────
      // 3) 대댓글 수정 → PUT /api/replies/:reply_id
      // 4) 대댓글 삭제 → DELETE /api/replies/:reply_id
      //
      // ⚠️ 라우터가 /:comment_id 와 /:reply_id 를 같은 레벨로 쓰고 있어
      // (둘 다 '/:something')라서 Express에선 "먼저 등록된 라우트"가 우선 매칭됨.
      // 현재 코드상 GET '/:comment_id'가 위에 있어서,
      // PUT/DELETE '/:reply_id'는 실제로는 의도대로 동작하지만
      // 혼동 방지를 위해 Swagger에서는 별도 path로 분리해서 표기함.
      // ─────────────────────────────
   },

   // Swagger 상에서 혼동 방지를 위해 reply_id용 path를 별도로 기술
   // 실제 Express 경로는 동일하지만, 문서에선 의미가 갈리므로 분리 표기(권장)
   '/api/replies/reply/{reply_id}': {
      put: {
         tags: ['Replies'],
         summary: '대댓글 수정',
         description: '로그인 사용자가 본인의 대댓글만 수정할 수 있습니다.',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               name: 'reply_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 101 },
               description: '대댓글 ID',
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
                        content: { type: 'string', example: '내용 수정합니다!' },
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
                           reply: { type: 'object' },
                        },
                     },
                  },
               },
            },
            403: {
               description: '로그인 필요 또는 본인 댓글 아님',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: { message: { type: 'string', example: '본인의 대댓글만 수정할 수 있습니다.' } },
                     },
                  },
               },
            },
            404: {
               description: '대댓글 없음',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '대댓글이 존재하지 않습니다.' } } },
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
                           message: { type: 'string', example: '대댓글 수정 실패' },
                           error: { type: 'string', example: '...' },
                        },
                     },
                  },
               },
            },
         },
      },

      delete: {
         tags: ['Replies'],
         summary: '대댓글 삭제',
         description: '로그인 사용자가 본인의 대댓글만 삭제할 수 있습니다.',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               name: 'reply_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 101 },
               description: '대댓글 ID',
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
            403: {
               description: '로그인 필요 또는 본인 댓글 아님',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '본인의 대댓글만 삭제할 수 있습니다.' } } },
                  },
               },
            },
            404: {
               description: '대댓글 없음',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '대댓글이 존재하지 않습니다.' } } },
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
                           message: { type: 'string', example: '대댓글 삭제 실패' },
                           error: { type: 'string', example: '...' },
                        },
                     },
                  },
               },
            },
         },
      },
   },
}
