// moovy-api/src/routes_swagger/admin/usersRouteApi.js

export const adminUsersPaths = {
   // 1) 유저 목록  → GET /api/admin/users
   '/api/admin/users': {
      get: {
         tags: ['Admin Users'],
         summary: '유저 목록 조회',
         description: '관리자 권한으로 유저 목록을 조회합니다. query는 listUsersQuerySchema 기준입니다. 응답은 { success: true, ...data } 형태로 data가 최상위에 펼쳐집니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'page',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, example: 1 },
               description: '페이지 번호(옵션)',
            },
            {
               name: 'size',
               in: 'query',
               required: false,
               schema: { type: 'integer', minimum: 1, maximum: 100, example: 20 },
               description: '페이지 당 개수(옵션) (1~100)',
            },
            {
               name: 'search',
               in: 'query',
               required: false,
               schema: { type: 'string', example: 'user@example.com' },
               description: '검색어(옵션)',
            },
            {
               name: 'state',
               in: 'query',
               required: false,
               schema: {
                  type: 'string',
                  enum: ['ACTIVE', 'SUSPENDED', 'DELETED'],
                  example: 'ACTIVE',
               },
               description: '유저 상태 필터(옵션)',
            },
            {
               name: 'provider',
               in: 'query',
               required: false,
               schema: {
                  type: 'string',
                  enum: ['google', 'kakao', 'email'],
                  example: 'email',
               },
               description: '가입 경로 필터(옵션)',
            },
            {
               name: 'sort',
               in: 'query',
               required: false,
               schema: {
                  type: 'string',
                  enum: ['created_at', 'updated_at', 'name'],
                  example: 'created_at',
               },
               description: '정렬 기준(옵션)',
            },
            {
               name: 'order',
               in: 'query',
               required: false,
               schema: {
                  type: 'string',
                  enum: ['ASC', 'DESC'],
                  example: 'DESC',
               },
               description: '정렬 방향(옵션)',
            },
         ],
         responses: {
            200: {
               description: '유저 목록 조회 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },

                           // ✅ usersService.listUsers 반환 구조를 모르면 여긴 "예시"로 두는 게 맞음
                           // 실제 반환에 맞춰 users/pagination 이름만 교체하면 됨
                           users: {
                              type: 'array',
                              items: {
                                 type: 'object',
                                 properties: {
                                    user_id: { type: 'integer', example: 12 },
                                    email: { type: 'string', example: 'user@example.com' },
                                    nickname: { type: 'string', example: '스위티' },
                                    createdAt: { type: 'string', format: 'date-time', example: '2025-12-01T10:00:00.000Z' },
                                 },
                              },
                           },
                           pagination: {
                              type: 'object',
                              properties: {
                                 page: { type: 'integer', example: 1 },
                                 size: { type: 'integer', example: 20 },
                                 total: { type: 'integer', example: 153 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패',
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
            403: {
               description: '권한이 없습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '로그인이 필요합니다. 또는 권한이 없습니다.' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   // 2) 유저 상세  → GET /api/admin/users/:user_id
   '/api/admin/users/{user_id}': {
      get: {
         tags: ['Admin Users'],
         summary: '유저 상세 조회',
         description: '관리자 권한으로 특정 유저 상세 정보를 조회합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'user_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 12 },
               description: '조회할 유저 ID',
            },
         ],
         responses: {
            200: {
               description: '유저 상세 조회 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           user: {
                              type: 'object',
                              properties: {
                                 user_id: { type: 'integer', example: 12 },
                                 email: { type: 'string', example: 'user@example.com' },
                                 nickname: { type: 'string', example: '스위티' },
                                 createdAt: { type: 'string', format: 'date-time', example: '2025-12-01T10:00:00.000Z' },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패',
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
            403: {
               description: '권한이 없습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '로그인이 필요합니다. 또는 권한이 없습니다.' },
                        },
                     },
                  },
               },
            },
            404: {
               description: '사용자를 찾을 수 없습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '사용자를 찾을 수 없습니다.' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   // 3) 제재 생성  → POST /api/admin/users/:user_id/sanctions
   '/api/admin/users/{user_id}/sanctions': {
      post: {
         tags: ['Admin Users'],
         summary: '유저 제재 생성',
         description: '특정 유저에게 제재를 생성합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'user_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 12 },
               description: '제재를 적용할 유저 ID',
            },
         ],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['end_at', 'reason'],
                     properties: {
                        start_at: {
                           type: 'string',
                           format: 'date-time',
                           description: '제재 시작(옵션) (ISO8601)',
                           example: '2025-12-10T00:00:00.000Z',
                        },
                        end_at: {
                           type: 'string',
                           format: 'date-time',
                           description: '제재 종료(필수) (ISO8601)',
                           example: '2025-12-20T00:00:00.000Z',
                        },
                        reason: {
                           type: 'string',
                           minLength: 2,
                           maxLength: 2000,
                           description: '제재 사유(2~2000자)',
                           example: '비매너/신고 누적',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: '제재 생성 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           message: { type: 'string', example: '제재가 생성되었습니다.' },
                           sanction: {
                              type: 'object',
                              properties: {
                                 id: { type: 'integer', example: 10 },
                                 user_id: { type: 'integer', example: 12 },
                                 admin_id: { type: 'integer', example: 1 },
                                 start_at: { type: 'string', format: 'date-time', example: '2025-12-10T00:00:00.000Z' },
                                 end_at: { type: 'string', format: 'date-time', example: '2025-12-20T00:00:00.000Z' },
                                 reason: { type: 'string', example: '비매너/신고 누적' },
                                 createdAt: { type: 'string', format: 'date-time', example: '2025-12-10T12:00:00.000Z' },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패',
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
            403: {
               description: '권한이 없습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '로그인이 필요합니다. 또는 권한이 없습니다.' },
                        },
                     },
                  },
               },
            },
            404: {
               description: '사용자를 찾을 수 없습니다.',
               content: {
                  'application/json': {
                     schema: { type: 'object', properties: { message: { type: 'string', example: '사용자를 찾을 수 없습니다.' } } },
                  },
               },
            },
         },
      },
   },

   // 4) 제재 수정  → PATCH /api/admin/users/:user_id/sanctions/:id
   // 5) 제재 삭제  → DELETE /api/admin/users/:user_id/sanctions/:id
   '/api/admin/users/{user_id}/sanctions/{id}': {
      patch: {
         tags: ['Admin Users'],
         summary: '유저 제재 수정',
         description: '특정 유저의 특정 제재를 수정합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            { name: 'user_id', in: 'path', required: true, schema: { type: 'integer', minimum: 1, example: 12 }, description: '유저 ID' },
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1, example: 10 }, description: '제재 ID' },
         ],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     minProperties: 1,
                     properties: {
                        reason: { type: 'string', minLength: 1, maxLength: 2000, example: '사유 수정' },
                        end_at: { type: 'string', format: 'date-time', example: '2025-12-25T00:00:00.000Z' },
                        early_release: {
                           type: 'boolean',
                           description: '조기 해제 여부(옵션)',
                           example: false,
                        },
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: '제재 수정 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           message: { type: 'string', example: '제재가 수정되었습니다.' },
                           sanction: {
                              type: 'object',
                              properties: {
                                 id: { type: 'integer', example: 10 },
                                 user_id: { type: 'integer', example: 12 },
                                 reason: { type: 'string', example: '사유 수정' },
                                 end_at: { type: 'string', format: 'date-time', example: '2025-12-25T00:00:00.000Z' },
                                 early_release: { type: 'boolean', example: false },
                                 updatedAt: { type: 'string', format: 'date-time', example: '2025-12-12T12:00:00.000Z' },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'VALIDATION_ERROR' }, errors: { type: 'object' } } } },
               },
            },
            403: {
               description: '권한이 없습니다.',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: '로그인이 필요합니다. 또는 권한이 없습니다.' } } } },
               },
            },
            404: {
               description: '제재 정보를 찾지 못했습니다.',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: '제재 정보를 찾지 못했습니다.' } } } },
               },
            },
         },
      },

      delete: {
         tags: ['Admin Users'],
         summary: '유저 제재 삭제',
         description: '특정 유저의 특정 제재를 삭제합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            { name: 'user_id', in: 'path', required: true, schema: { type: 'integer', minimum: 1, example: 12 }, description: '유저 ID' },
            { name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1, example: 10 }, description: '제재 ID' },
         ],
         responses: {
            200: {
               description: '제재 삭제 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           message: { type: 'string', example: '제재가 삭제되었습니다.' },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'VALIDATION_ERROR' }, errors: { type: 'object' } } } },
               },
            },
            403: {
               description: '권한이 없습니다.',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: '로그인이 필요합니다. 또는 권한이 없습니다.' } } } },
               },
            },
            404: {
               description: '제재 정보를 찾지 못했습니다.',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: '제재 정보를 찾지 못했습니다.' } } } },
               },
            },
         },
      },
   },

   // 6) 강제 탈퇴(슈퍼관리자)  → POST /api/admin/users/:user_id/force-withdrawal
   '/api/admin/users/{user_id}/force-withdrawal': {
      post: {
         tags: ['Admin Users'],
         summary: '유저 강제 탈퇴 (SUPERADMIN 전용)',
         description: '특정 유저를 강제 탈퇴 처리합니다. SUPERADMIN 권한이 필요합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'user_id',
               in: 'path',
               required: true,
               schema: { type: 'integer', minimum: 1, example: 12 },
               description: '강제 탈퇴할 유저 ID',
            },
         ],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['reason', 'confirm'],
                     properties: {
                        reason: {
                           type: 'string',
                           minLength: 2,
                           maxLength: 2000,
                           description: '강제 탈퇴 사유(2~2000자)',
                           example: '악성 유저로 판단',
                        },
                        confirm: {
                           type: 'boolean',
                           description: '강제 탈퇴 확인 플래그(필수)',
                           example: true,
                        },
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: '강제 탈퇴 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           message: { type: 'string', example: '사용자가 강제 탈퇴 처리되었습니다.' },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'VALIDATION_ERROR' }, errors: { type: 'object' } } } },
               },
            },
            403: {
               description: '권한이 없습니다. (SUPERADMIN 권한 필요)',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: '로그인이 필요합니다. 또는 권한이 없습니다.' } } } },
               },
            },
            404: {
               description: '사용자를 찾을 수 없습니다.',
               content: {
                  'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: '사용자를 찾을 수 없습니다.' } } } },
               },
            },
         },
      },
   },
}
