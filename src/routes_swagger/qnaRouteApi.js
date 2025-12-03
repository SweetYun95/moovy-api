export const qnaPaths = {
   '/api/qna': {
      post: {
         tags: ['QnA'],
         summary: 'QnA 작성',
         description: 'QnA를 작성합니다. 최대 5개의 이미지를 첨부할 수 있습니다 (각 파일당 최대 5MB).',
         security: [{ sessionAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'multipart/form-data': {
                  schema: {
                     type: 'object',
                     required: ['q_title', 'q_content'],
                     properties: {
                        q_title: {
                           type: 'string',
                           minLength: 1,
                           maxLength: 100,
                           description: '제목 (최대 100자)',
                           example: '영화 관련 문의드립니다',
                        },
                        q_content: {
                           type: 'string',
                           minLength: 1,
                           maxLength: 2000,
                           description: '내용 (최대 2000자)',
                           example: '영화 정보가 업데이트되지 않는 문제가 있습니다.',
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
               description: 'QnA 작성 성공',
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

   '/api/qna/{qna_id}': {
      get: {
         tags: ['QnA'],
         summary: '특정 QnA 조회',
         description: '특정 QnA의 상세 정보를 조회합니다. 작성자 본인 또는 관리자만 조회 가능합니다.',
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
                                       title: { type: 'string', example: '영화 관련 문의드립니다' },
                                       content: { type: 'string', example: '영화 정보가 업데이트되지 않는 문제가 있습니다.' },
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
            401: {
               description: '작성자가 일치하지 않습니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: { type: 'string', example: '작성자가 일치하지 않습니다.' },
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
      delete: {
         tags: ['QnA'],
         summary: 'QnA 삭제',
         description: 'QnA를 삭제합니다. 작성자 본인 또는 관리자만 삭제 가능합니다. 첨부된 이미지 파일도 함께 삭제됩니다.',
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
               description: '작성자가 일치하지 않거나 로그인이 필요합니다.',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           message: {
                              type: 'string',
                              example: '작성자가 일치하지 않습니다. 또는 로그인이 필요합니다.',
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   },

   '/api/qna/list': {
      get: {
         tags: ['QnA'],
         summary: '내 QnA 리스트 조회',
         description: '로그인한 사용자가 작성한 QnA 목록을 페이지네이션하여 조회합니다.',
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
                                       total: { type: 'integer', example: 25 },
                                       page: { type: 'integer', example: 1 },
                                       limit: { type: 'integer', example: 10 },
                                       totalPages: { type: 'integer', example: 3 },
                                    },
                                 },
                                 list: {
                                    type: 'array',
                                    items: {
                                       type: 'object',
                                       properties: {
                                          qna_id: { type: 'integer', example: 1 },
                                          q_title: { type: 'string', example: '영화 관련 문의드립니다' },
                                          q_content: { type: 'string', example: '영화 정보가 업데이트되지 않는 문제가 있습니다.' },
                                          QnaImages: {
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
}
