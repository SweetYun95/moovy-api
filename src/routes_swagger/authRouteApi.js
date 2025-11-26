export const authPaths = {
   '/api/auth/signup': {
      post: {
         tags: ['Auth'],
         summary: '회원가입',
         description: '로컬 계정으로 새로운 사용자를 등록합니다.',
         security: [],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['email', 'password', 'name'],
                     properties: {
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        password: { type: 'string', format: 'password', example: 'password123' },
                        name: { type: 'string', example: '홍길동' },
                     },
                  },
               },
            },
         },
         responses: {
            201: { description: '회원가입 성공' },
            400: { description: '잘못된 요청 (유효성 검사 실패)' },
            409: { description: '이미 존재하는 이메일' },
         },
      },
   },

   '/api/auth/login': {
      post: {
         tags: ['Auth'],
         summary: '로그인',
         description: '이메일과 비밀번호로 로컬 로그인합니다.',
         security: [],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['email', 'password'],
                     properties: {
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        password: { type: 'string', format: 'password', example: 'password123' },
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
                           message: { type: 'string', example: '로그인 성공' },
                        },
                     },
                  },
               },
            },
            401: { description: '인증 실패 (잘못된 이메일 또는 비밀번호)' },
         },
      },
   },

   '/api/auth/kakao': {
      get: {
         tags: ['Auth'],
         summary: '카카오 로그인',
         description: '카카오 OAuth 인증을 시작합니다.',
         security: [],
         responses: {
            302: { description: '카카오 인증 페이지로 리다이렉트' },
         },
      },
   },

   '/api/auth/kakao/callback': {
      get: {
         tags: ['Auth'],
         summary: '카카오 로그인 콜백',
         description: '카카오 OAuth 인증 후 콜백을 처리합니다.',
         security: [],
         responses: {
            302: {
               description: '로그인 성공 시 프론트엔드 메인 페이지로 리다이렉트, 실패 시 로그인 페이지로 리다이렉트',
            },
         },
      },
   },

   '/api/auth/google': {
      get: {
         tags: ['Auth'],
         summary: '구글 로그인',
         description: '구글 OAuth 인증을 시작합니다.',
         security: [],
         responses: {
            302: { description: '구글 인증 페이지로 리다이렉트' },
         },
      },
   },

   '/api/auth/google/callback': {
      get: {
         tags: ['Auth'],
         summary: '구글 로그인 콜백',
         description: '구글 OAuth 인증 후 콜백을 처리합니다.',
         security: [],
         responses: {
            302: {
               description: '로그인 성공 시 프론트엔드 메인 페이지로 리다이렉트, 실패 시 로그인 페이지로 리다이렉트',
            },
         },
      },
   },

   '/api/auth/logout': {
      post: {
         tags: ['Auth'],
         summary: '로그아웃',
         description: '현재 로그인된 사용자를 로그아웃합니다.',
         responses: {
            200: { description: '로그아웃 성공' },
            401: { description: '인증 필요' },
         },
      },
   },

   '/api/auth/check': {
      get: {
         tags: ['Auth'],
         summary: '로그인 여부 확인',
         description: '현재 사용자의 로그인 상태를 확인합니다.',
         security: [],
         responses: {
            200: {
               description: '로그인 상태 반환',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           isLoggedIn: { type: 'boolean', example: true },
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
         summary: '내 정보 조회',
         description: '로그인한 사용자의 정보를 조회합니다.',
         responses: {
            200: {
               description: '조회 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           id: { type: 'integer', example: 1 },
                           email: { type: 'string', example: 'user@example.com' },
                           name: { type: 'string', example: '홍길동' },
                           provider: { type: 'string', example: 'local' },
                        },
                     },
                  },
               },
            },
            401: { description: '인증 필요' },
         },
      },
   },

   '/api/auth/disconnect/{provide}': {
      delete: {
         tags: ['Auth'],
         summary: '소셜 계정 연동 해제',
         description: '카카오 또는 구글 계정 연동을 해제합니다.',
         parameters: [
            {
               name: 'provide',
               in: 'path',
               required: true,
               schema: {
                  type: 'string',
                  enum: ['kakao', 'google'],
               },
               description: '연동 해제할 소셜 플랫폼',
            },
         ],
         responses: {
            200: { description: '연동 해제 성공' },
            400: { description: '잘못된 요청' },
            401: { description: '인증 필요' },
         },
      },
   },

   '/api/auth/withdraw': {
      delete: {
         tags: ['Auth'],
         summary: '회원 탈퇴',
         description: '현재 로그인한 사용자의 계정을 삭제합니다.',
         responses: {
            200: { description: '회원 탈퇴 성공' },
            401: { description: '인증 필요' },
         },
      },
   },
}
