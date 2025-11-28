export const adminQnaPaths = {
   '/api/admin/qna': {
      post: {
         tags: ['Admin QnA'],
         summary: 'QnA 답변 작성 (관리자)',
         description: 'QnA에 대한 관리자 답변을 작성합니다. 최대 5개의 이미지를 첨부할 수 있습니다 (각 파일당 최대 5MB). 답변 작성 시 QnA 상태가 FULFILLED로 변경됩니다.',
         security: [{ sessionAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'multipart/form-data': {
                  schema: {
                     type: 'object',
                     required: ['qna_id', 'a_title', 'a_content'],
                     properties: {
                        qna_id: {
                           type: 'integer',
                           minimum: 1,
                           description: '답변할 QnA ID',
                           example: 1,
                        },
                        a_title: {
                           type: 'string',
                           minLength: 1,
                           maxLength: 100,
                           description: '답변 제목 (최대 100자)',
                           example: '영화 정보 업데이트 관련 답변',
                        },
                        a_content: {
                           type: 'string',
                           minLength: 1,
                           maxLength: 2000,
                           description: '답변 내용 (최대 2000자)',
                           example: '해당 문제는 현재 수정 중입니다. 빠른 시일 내에 업데이트 예정입니다.',
                        },
                        images: {
                           type: 'array',
                           items: {
                              type: 'string',
                              format: 'binary',
                           },
                           maxItems: 5,
                           description: '이미지 파일 (jpg, jpeg, png, gif만 가능, 최대 5개, 각 파일당 최대 5MB)',
                        },
                     },
                  },
               },
            },
         },
         responses: {
            201: {
               description: 'QnA 답변 작성 성공',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: { type: 'boolean', example: true },
                           data: {
                              type: 'object',
                              properties: {
                                 qna_id: { type: 'integer', example: 1 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '유효성 검사 실패 또는 문의내역을 찾을 수 없습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: 'VALIDATION_ERROR 또는 문의내역을 찾을 수 없습니다.',
                           },
                           errors: { type: 'object' },
                        },
                     },
                  },
               },
            },
            403: {
               description: '관리자 권한이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: '로그인이 필요합니다. 또는 관리자 권한이 필요합니다.',
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/admin/qna/list': {
      get: {
         tags: ['Admin QnA'],
         summary: 'QnA 전체 목록 조회 (관리자)',
         description: '모든 사용자의 QnA 목록을 페이지네이션하여 조회합니다. 관리자 권한이 필요합니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'page',
               in: 'query',
               required: false,
               schema: {
                  type: 'integer',
                  minimum: 1,
                  default: 1,
               },
               description: '페이지 번호',
            },
            {
               name: 'limit',
               in: 'query',
               required: false,
               schema: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 50,
                  default: 10,
               },
               description: '페이지당 항목 수 (최대 50)',
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
                              type: 'object',
                              properties: {
                                 pagination: {
                                    type: 'object',
                                    properties: {
                                       page: { type: 'integer', example: 1 },
                                       limit: { type: 'integer', example: 10 },
                                       total: { type: 'integer', example: 50 },
                                       totalPages: { type: 'integer', example: 5 },
                                    },
                                 },
                                 list: {
                                    type: 'array',
                                    items: {
                                       type: 'object',
                                       properties: {
                                          qna_id: { type: 'integer', example: 1 },
                                          user_id: { type: 'integer', example: 1 },
                                          admin_id: { type: 'integer', nullable: true, example: null },
                                          q_title: { type: 'string', example: '영화 관련 문의드립니다' },
                                          q_content: { type: 'string', example: '영화 정보가 업데이트되지 않는 문제가 있습니다.' },
                                          a_title: { type: 'string', nullable: true, example: null },
                                          a_content: { type: 'string', nullable: true, example: null },
                                          state: { type: 'string', example: 'PENDING' },
                                          createdAt: { type: 'string', format: 'date-time' },
                                          updatedAt: { type: 'string', format: 'date-time' },
                                          qnaImages: {
                                             type: 'array',
                                             items: {
                                                type: 'object',
                                                properties: {
                                                   qna_img_id: { type: 'integer', example: 1 },
                                                   img_url: { type: 'string', example: '/uploads/qna/image-1234567890.jpg' },
                                                   order: { type: 'integer', example: 0 },
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
               description: '관리자 권한이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: '로그인이 필요합니다. 또는 관리자 권한이 필요합니다.',
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/admin/qna/{qna_id}': {
      get: {
         tags: ['Admin QnA'],
         summary: '특정 QnA 조회 (관리자)',
         description: '특정 QnA의 상세 정보를 조회합니다. 관리자는 모든 QnA를 조회할 수 있습니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'qna_id',
               in: 'path',
               required: true,
               schema: {
                  type: 'integer',
                  minimum: 1,
               },
               description: 'QnA ID',
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
                              type: 'object',
                              properties: {
                                 qna: {
                                    type: 'object',
                                    properties: {
                                       qna_id: { type: 'integer', example: 1 },
                                       user_id: { type: 'integer', example: 1 },
                                       admin_id: { type: 'integer', nullable: true, example: null },
                                       q_title: { type: 'string', example: '영화 관련 문의드립니다' },
                                       q_content: { type: 'string', example: '영화 정보가 업데이트되지 않는 문제가 있습니다.' },
                                       a_title: { type: 'string', nullable: true, example: null },
                                       a_content: { type: 'string', nullable: true, example: null },
                                       state: { type: 'string', example: 'PENDING' },
                                       created_at: { type: 'string', format: 'date-time' },
                                       updated_at: { type: 'string', format: 'date-time' },
                                    },
                                 },
                                 qnaImg: {
                                    type: 'array',
                                    items: {
                                       type: 'object',
                                       properties: {
                                          img_url: { type: 'string', example: '/uploads/qna/image-1234567890.jpg' },
                                          order: { type: 'integer', example: 0 },
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
               description: '문의내역을 찾을 수 없습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '문의내역을 찾을 수 없습니다.' },
                        },
                     },
                  },
               },
            },
            403: {
               description: '관리자 권한이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: '로그인이 필요합니다. 또는 관리자 권한이 필요합니다.',
                           },
                        },
                     },
                  },
               },
            },
         },
      },
      delete: {
         tags: ['Admin QnA'],
         summary: 'QnA 삭제 (관리자)',
         description: 'QnA를 삭제합니다. 관리자는 모든 QnA를 삭제할 수 있습니다. 첨부된 이미지 파일도 함께 삭제됩니다.',
         security: [{ sessionAuth: [] }],
         parameters: [
            {
               name: 'qna_id',
               in: 'path',
               required: true,
               schema: {
                  type: 'integer',
                  minimum: 1,
               },
               description: 'QnA ID',
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
                           success: { type: 'boolean', example: true },
                           data: {
                              type: 'object',
                              properties: {
                                 qna_id: { type: 'integer', example: 1 },
                              },
                           },
                        },
                     },
                  },
               },
            },
            400: {
               description: '문의내역을 찾을 수 없습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '문의내역을 찾을 수 없습니다.' },
                        },
                     },
                  },
               },
            },
            403: {
               description: '관리자 권한이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: '로그인이 필요합니다. 또는 관리자 권한이 필요합니다.',
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   },
}
