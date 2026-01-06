// moovy-api/src/routes_swagger/authRouteApi.js
export const authPaths = {
   '/api/auth/signup': {
      post: {
         tags: ['Auth'],
         summary: '로컬 회원가입',
         description: '로컬 계정으로 새로운 사용자를 등록합니다. 비밀번호는 8자 이상이며 대문자, 소문자, 숫자를 각각 하나 이상 포함해야 합니다.',
         security: [],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['email', 'password', 'name'],
                     properties: {
                        email: {
                           type: 'string',
                           format: 'email',
                           description: '유효한 이메일 형식',
                           example: 'user@example.com',
                        },
                        password: {
                           type: 'string',
                           format: 'password',
                           minLength: 8,
                           maxLength: 72,
                           description: '비밀번호는 8~72자이며, 대문자, 소문자, 숫자를 각각 하나 이상 포함',
                           example: 'Password123',
                        },
                        name: {
                           type: 'string',
                           minLength: 1,
                           maxLength: 10,
                           pattern: '^[가-힣a-zA-Z]+$',
                           description: '닉네임 (한글 또는 영어만, 10자 이내)',
                           example: '홍길동',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: '회원가입 성공',
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
                                       name: { type: 'string', example: '홍길동' },
                                       email: { type: 'string', example: 'user@example.com' },
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

   '/api/auth/login': {
      post: {
         tags: ['Auth'],
         summary: '로컬 로그인',
         description: '이메일과 비밀번호로 로컬 로그인합니다. 세션 기반 인증을 사용합니다.',
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
                           example: 'user@example.com',
                        },
                        password: {
                           type: 'string',
                           format: 'password',
                           description: '비밀번호',
                           example: 'Password123',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: '로그인 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           user: {
                              type: 'object',
                              properties: {
                                 user_id: { type: 'integer', example: 1 },
                                 email: { type: 'string', example: 'user@example.com' },
                                 name: { type: 'string', example: '홍길동' },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패 또는 이미 로그인 상태',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: 'VALIDATION_ERROR 또는 이미 로그인 상태입니다.',
                           },
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

   '/api/auth/kakao': {
      get: {
         tags: ['Auth'],
         summary: '카카오 로그인 시작',
         description: '카카오 OAuth 인증을 시작합니다. 카카오 인증 페이지로 리다이렉트됩니다.',
         security: [],
         responses: {
            302: {
               description: '카카오 인증 페이지로 리다이렉트',
            },
         },
      },
   },

   '/api/auth/kakao/callback': {
      get: {
         tags: ['Auth'],
         summary: '카카오 로그인 콜백',
         description: '카카오 OAuth 인증 후 콜백을 처리합니다. 성공 시 프론트엔드 메인 페이지로, 실패 시 로그인 페이지로 리다이렉트됩니다.',
         security: [],
         parameters: [
            {
               name: 'code',
               in: 'query',
               required: false,
               schema: { type: 'string' },
               description: '카카오 인증 코드',
            },
         ],
         responses: {
            302: {
               description: '로그인 성공 시 FRONTEND_APP_URL로, 실패 시 FRONTEND_APP_URL/login으로 리다이렉트',
            },
         },
      },
   },

   '/api/auth/google': {
      get: {
         tags: ['Auth'],
         summary: '구글 로그인 시작',
         description: '구글 OAuth 인증을 시작합니다. profile과 email 스코프를 요청합니다.',
         security: [],
         responses: {
            302: {
               description: '구글 인증 페이지로 리다이렉트',
            },
         },
      },
   },

   '/api/auth/google/callback': {
      get: {
         tags: ['Auth'],
         summary: '구글 로그인 콜백',
         description: '구글 OAuth 인증 후 콜백을 처리합니다. 성공 시 프론트엔드 메인 페이지로, 실패 시 로그인 페이지로 리다이렉트됩니다.',
         security: [],
         parameters: [
            {
               name: 'code',
               in: 'query',
               required: false,
               schema: { type: 'string' },
               description: '구글 인증 코드',
            },
         ],
         responses: {
            302: {
               description: '로그인 성공 시 FRONTEND_APP_URL로, 실패 시 FRONTEND_APP_URL/login으로 리다이렉트',
            },
         },
      },
   },

   '/api/auth/logout': {
      post: {
         tags: ['Auth'],
         summary: '로그아웃',
         description: '현재 로그인된 사용자를 로그아웃합니다. 세션을 파기하고 쿠키를 삭제합니다.',
         security: [{ sessionAuth: [] }],
         responses: {
            200: {
               description: '로그아웃 성공',
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
            403: {
               description: '로그인이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '로그인이 필요합니다.' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/auth/check': {
      get: {
         tags: ['Auth'],
         summary: '로그인 여부 확인',
         description: '현재 사용자의 로그인 상태를 확인합니다. 인증 없이 호출 가능합니다.',
         security: [],
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
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/auth/me': {
      get: {
         tags: ['Auth'],
         summary: '로그인 사용자 정보 조회',
         description: '로그인한 사용자의 정보를 조회합니다. 비밀번호는 반환되지 않습니다.',
         security: [{ sessionAuth: [] }],
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
                              type: 'object',
                              properties: {
                                 user: {
                                    type: 'object',
                                    properties: {
                                       user_id: { type: 'integer', example: 1 },
                                       email: { type: 'string', example: 'user@example.com' },
                                       name: { type: 'string', example: '홍길동' },
                                       kakao: { type: 'boolean', example: false },
                                       kakao_id: { type: 'string', nullable: true, example: null },
                                       google: { type: 'boolean', example: false },
                                       google_id: { type: 'string', nullable: true, example: null },
                                       password: { type: 'null', example: null },
                                       createdAt: { type: 'string', format: 'date-time' },
                                       updatedAt: { type: 'string', format: 'date-time' },
                                    },
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            403: {
               description: '로그인이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '로그인이 필요합니다.' },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/auth/disconnect/{provide}': {
      delete: {
         tags: ['Auth'],
         summary: '소셜 계정 연동 해제',
         description: '카카오 또는 구글 계정 연동을 해제합니다. 해당 소셜 플랫폼의 정보를 삭제합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'provide',
               in: 'path',
               required: true,
               schema: {
                  type: 'string',
                  enum: ['kakao', 'google'],
               },
               description: '연동 해제할 소셜 플랫폼 (kakao 또는 google)',
            },
         ],
         responses: {
            200: {
               description: '연동 해제 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           message: {
                              type: 'string',
                              example: '이미 해제된 상태입니다.',
                              description: '이미 해제된 경우 반환되는 메시지',
                           },
                           data: {
                              type: 'object',
                              properties: {
                                 newUser: {
                                    type: 'object',
                                    properties: {
                                       id: { type: 'integer', example: 1 },
                                       email: { type: 'string', example: 'user@example.com' },
                                       name: { type: 'string', example: '홍길동' },
                                       kakao: { type: 'boolean', example: false },
                                       kakao_id: { type: 'string', nullable: true, example: null },
                                       google: { type: 'boolean', example: false },
                                       google_id: { type: 'string', nullable: true, example: null },
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
               description: '잘못된 요청 (유효하지 않은 소셜 제공자)',
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
               description: '로그인이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '로그인이 필요합니다.' },
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

   '/api/auth/withdraw': {
      delete: {
         tags: ['Auth'],
         summary: '회원 탈퇴',
         description: '현재 로그인한 사용자의 계정을 소프트 삭제합니다. 실제 데이터는 삭제되지 않고 삭제 표시만 됩니다.',
         security: [{ sessionAuth: [] }],
         responses: {
            200: {
               description: '회원 탈퇴 성공',
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
            403: {
               description: '로그인이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '로그인이 필요합니다.' },
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
