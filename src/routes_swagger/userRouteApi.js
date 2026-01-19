// moovy-api/src/routes_swagger/userRouteApi.js
export const userPaths = {
   '/api/user/profile': {
      get: {
         tags: ['User'],
         summary: '사용자 정보 조회',
         description: '로그인한 사용자의 프로필 정보를 조회합니다. 비밀번호는 반환되지 않습니다.',
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
                                       profile_image: { type: 'string', nullable: true, example: 'uploads/user/profile.png' },
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
      put: {
         tags: ['User'],
         summary: '사용자 정보 수정',
         description: '로그인한 사용자의 닉네임 또는 이메일을 수정합니다. 수정하려는 필드만 요청 본문에 포함하면 됩니다.',
         security: [{ sessionAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     properties: {
                        name: {
                           type: 'string',
                           minLength: 1,
                           maxLength: 10,
                           pattern: '^[가-힣a-zA-Z]+$',
                           description: '닉네임 (한글 또는 영어만, 10자 이내)',
                           example: '홍길동',
                        },
                        email: {
                           type: 'string',
                           format: 'email',
                           description: '유효한 이메일 형식',
                           example: 'user@example.com',
                        },
                     },
                  },
                  examples: {
                     updateName: {
                        summary: '닉네임만 수정',
                        value: {
                           name: '김철수',
                        },
                     },
                     updateEmail: {
                        summary: '이메일만 수정',
                        value: {
                           email: 'newemail@example.com',
                        },
                     },
                     updateBoth: {
                        summary: '닉네임과 이메일 모두 수정',
                        value: {
                           name: '김철수',
                           email: 'newemail@example.com',
                        },
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
                           success: { type: 'boolean', example: true },
                           data: {
                              type: 'object',
                              properties: {
                                 user_id: { type: 'integer', example: 1 },
                                 name: { type: 'string', example: '김철수' },
                                 email: { type: 'string', example: 'newemail@example.com' },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '잘못된 요청 (유효성 검사 실패 또는 수정할 값이 없음)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: 'VALIDATION_ERROR 또는 수정할 값이 없습니다.',
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
         },
      },
   },

   '/api/user/profile/image': {
      put: {
         tags: ['User'],
         summary: '프로필 이미지 변경',
         description: '로그인한 사용자의 프로필 이미지를 변경합니다. 이전 프로필 이미지는 자동으로 삭제됩니다 (기본 이미지 제외).',
         security: [{ sessionAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'multipart/form-data': {
                  schema: {
                     type: 'object',
                     required: ['image'],
                     properties: {
                        image: {
                           type: 'string',
                           format: 'binary',
                           description: '업로드할 프로필 이미지 파일',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: '이미지 변경 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           data: {
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
            400: {
               description: '잘못된 요청 (이미지 파일이 제공되지 않음)',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: '프로필 이미지가 제공되지 않았습니다.',
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

   '/api/user/check-nickname': {
      post: {
         tags: ['User'],
         summary: '닉네임 중복 확인',
         description: '닉네임의 사용 가능 여부를 확인합니다. 이미 사용 중인 닉네임인 경우 false를 반환합니다.',
         security: [],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['name'],
                     properties: {
                        name: {
                           type: 'string',
                           minLength: 1,
                           maxLength: 10,
                           pattern: '^[가-힣a-zA-Z]+$',
                           description: '확인할 닉네임 (한글 또는 영어만, 10자 이내)',
                           example: '홍길동',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            200: {
               description: '확인 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           data: {
                              type: 'object',
                              properties: {
                                 isAvailable: {
                                    type: 'boolean',
                                    description: '닉네임 사용 가능 여부 (true: 사용 가능, false: 이미 사용 중)',
                                    example: true,
                                 },
                              },
                           },
                        },
                     },
                     examples: {
                        available: {
                           summary: '사용 가능한 닉네임',
                           value: {
                              success: true,
                              data: {
                                 isAvailable: true,
                              },
                           },
                        },
                        unavailable: {
                           summary: '이미 사용 중인 닉네임',
                           value: {
                              success: true,
                              data: {
                                 isAvailable: false,
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '잘못된 요청 (유효성 검사 실패)',
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
         },
      },
   },

   '/api/user/withdraw': {
      delete: {
         tags: ['User'],
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
