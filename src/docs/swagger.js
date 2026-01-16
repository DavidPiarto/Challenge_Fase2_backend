const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'Blog API',
        version: '1.0.0',
        description: 'API de postagens (CRUD) com Express + MongoDB',
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local' },
    ],
    components: {
        schemas: {
            Post: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '65f1c2d1a1b2c3d4e5f6a7b8' },
                    title: { type: 'string', example: 'Meu primeiro post' },
                    content: { type: 'string', example: 'Conteúdo do post...' },
                    author: { type: 'string', example: 'Professor X' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['title', 'content', 'author'],
            },
            PostCreateInput: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    author: { type: 'string' },
                },
                required: ['title', 'content', 'author'],
            },
            PostUpdateInput: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    author: { type: 'string' },
                },
            },
            ErrorMessage: {
                type: 'object',
                properties: { message: { type: 'string' } },
            },
        },
    },
    paths: {
        '/posts': {
            get: {
                summary: 'Listar posts',
                responses: {
                    200: {
                        description: 'Lista de posts',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                            },
                        },
                    },
                    500: {
                        description: 'Erro ao buscar posts',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                },
            },
            post: {
                summary: 'Criar post',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/PostCreateInput' } },
                    },
                },
                responses: {
                    201: {
                        description: 'Post criado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
                    },
                    400: {
                        description: 'Campos obrigatórios faltando',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                    500: {
                        description: 'Erro ao criar post',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                },
            },
        },

        '/posts/{id}': {
            get: {
                summary: 'Buscar post por id',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    200: {
                        description: 'Post encontrado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
                    },
                    400: {
                        description: 'ID inválido',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                    404: {
                        description: 'Post não encontrado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                },
            },
            put: {
                summary: 'Atualizar post por id',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/PostUpdateInput' } },
                    },
                },
                responses: {
                    200: {
                        description: 'Post atualizado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } },
                    },
                    400: {
                        description: 'Erro ao atualizar post / ID inválido',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                    404: {
                        description: 'Post não encontrado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                },
            },
            delete: {
                summary: 'Remover post por id',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    200: {
                        description: 'Post removido',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        post: { $ref: '#/components/schemas/Post' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Erro ao excluir post / ID inválido',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                    404: {
                        description: 'Post não encontrado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                },
            },
        },

        '/posts/search': {
            get: {
                summary: 'Buscar posts por termo (título ou conteúdo)',
                parameters: [
                    { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    200: {
                        description: 'Resultados da busca',
                        content: {
                            'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } },
                        },
                    },
                    400: {
                        description: 'Query "q" é obrigatória',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                    404: {
                        description: 'Nenhum post encontrado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                    500: {
                        description: 'Erro ao buscar posts',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } } },
                    },
                },
            },
        },
    },
};

const swaggerSpec = swaggerJSDoc({
    swaggerDefinition,
    apis: [],
});

module.exports = swaggerSpec;