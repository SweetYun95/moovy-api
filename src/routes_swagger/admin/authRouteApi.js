// moovy-api/src/routes_swagger/admin/authRouteApi.js
export const adminAuthPaths = {
   '/api/admin/auth/signup': {
      post: {
         tags: ['Admin Auth'],
         summary: '관리자 회원가입',
         description: '새로운 관리자 계정을 등록합니다.',
         security: [],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['email', 'password', 'nickname'],
                     properties: {
                        email: {
                           type: 'string',
                           format: 'email',
                           description: '유효한 이메일 형식',
                           example: 'admin@example.com',
                        },
                        password: {
                           type: 'string',
                           format: 'password',
                           minLength: 6,
                           description: '비밀번호 (최소 6자 이상)',
                           example: 'admin123',
                        },
                        nickname: {
                           type: 'string',
                           minLength: 2,
                           maxLength: 20,
                           description: '닉네임 (2~20자)',
                           example: '관리자',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: '관리자 회원가입 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           data: {
                              type: 'object',
                              properties: {
                                 newUser: {
                                    type: 'object',
                                    properties: {
                                       user_id: { type: 'integer', example: 1 },
                                       name: { type: 'string', example: '관리자' },
                                       email: { type: 'string', example: 'admin@example.com' },
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
               description: '잘못된 요청 (유효성 검사 실패 또는 이미 가입된 이메일)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: 'VALIDATION_ERROR 또는 이미 가입된 이메일 입니다.',
                           },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/admin/auth/signin': {
      post: {
         tags: ['Admin Auth'],
         summary: '관리자 로그인',
         description: '관리자 이메일과 비밀번호로 로그인합니다. 세션 기반 인증을 사용합니다.',
         security: [],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['email', 'password'],
                     properties: {
                        email: {
                           type: 'string',
                           format: 'email',
                           description: '유효한 이메일 형식',
                           example: 'admin@example.com',
                        },
                        password: {
                           type: 'string',
                           format: 'password',
                           minLength: 6,
                           description: '비밀번호 (최소 6자 이상)',
                           example: 'admin123',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: '관리자 로그인 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           user: {
                              type: 'object',
                              properties: {
                                 admin_id: { type: 'integer', example: 1 },
                                 email: { type: 'string', example: 'admin@example.com' },
                                 name: { type: 'string', example: '관리자' },
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
                           message: {
                              type: 'string',
                              example: 'VALIDATION_ERROR',
                           },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
            401: {
               description: '인증 실패 (잘못된 이메일 또는 비밀번호)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '인증 실패' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/admin/auth/check': {
      get: {
         tags: ['Admin Auth'],
         summary: '관리자 로그인 여부 확인',
         description: '현재 사용자의 관리자 로그인 상태를 확인합니다. ADMIN 또는 SUPERADMIN 권한이 필요합니다.',
         security: [{ sessionAuth: [] }],
         responses: {
            200: {
               description: '로그인 상태 반환',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           isLoggedIn: {
                              type: 'boolean',
                              description: '로그인 상태',
                              example: true,
                           },
                           isAdmin: {
                              type: 'boolean',
                              description: '관리자 여부',
                              example: true,
                           },
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
                           message: {
                              type: 'string',
                              example: '로그인이 필요합니다. 또는 권한이 없습니다.',
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/admin/auth/delete/{user_id}': {
      delete: {
         tags: ['Admin Auth'],
         summary: '관리자 계정 삭제 (슈퍼관리자 전용)',
         description: '관리자 계정을 삭제합니다. SUPERADMIN 권한이 필요합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'user_id',
               in: 'path',
               required: true,
               schema: {
                  type: 'string',
                  minLength: 1,
               },
               description: '삭제할 관리자 계정 ID',
            },
         ],
         responses: {
            200: {
               description: '관리자 계정 삭제 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
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
                           message: {
                              type: 'string',
                              example: 'VALIDATION_ERROR',
                           },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
            403: {
               description: '권한이 없습니다. (SUPERADMIN 권한 필요)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: '로그인이 필요합니다. 또는 권한이 없습니다.',
                           },
                        },
                     },
                  },
               },
            },
            404: {
               description: '유저 정보를 찾지 못했습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '유저 정보를 찾지 못했습니다.' },
                        },
                     },
                  },
               },
            },
         },
      },
   },
}
