const request = require('supertest');
const mongoose = require('mongoose');
const connectMongo = require('../database/mongo');
const app = require('../index');

// Roda uma vez antes de todos os testes
beforeAll(async () => {
    // conecta no banco de TESTE
    await connectMongo(true);

    // garante que o banco começa limpo
    await mongoose.connection.dropDatabase();
}, 20000);

// Roda uma vez depois de todos os testes
afterAll(async () => {
    // limpa novamente (boa prática)
    await mongoose.connection.dropDatabase();

    // fecha a conexão para o Jest encerrar corretamente
    await mongoose.connection.close();
});

describe('Posts API', () => {

    it('deve criar um novo post', async () => {
        // chama a rota POST /posts
        const response = await request(app)
            .post('/posts')
            .send({
                title: 'Post de Teste',
                content: 'Conteúdo de teste',
                author: 'Autor Teste'
            });

        // valida status e se veio um _id gerado pelo Mongo
        // expect(response.status).toBe(201);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('_id');
    });

    it('deve listar os posts', async () => {
        // chama a rota GET /posts
        const response = await request(app).get('/posts');

        // valida status e se tem pelo menos 1 item retornado
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('deve buscar um post por id', async () => {
        // cria 1 post pra garantir um id válido no banco
        const created = await request(app)
            .post('/posts')
            .send({
                title: 'Post para buscar',
                content: 'Conteúdo para buscar',
                author: 'Autor Buscar'
            });

        expect(created.status).toBe(201);

        // pega o _id retornado pelo Mongo
        const id = created.body._id;
        expect(id).toBeTruthy();

        // busca pelo id na rota GET /posts/:id
        const response = await request(app).get(`/posts/${id}`);

        // valida se retornou o post correto
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', id);
        expect(response.body.title).toBe('Post para buscar');
    });

});
