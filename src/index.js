const express = require('express');
const bodyParser = require('body-parser');
const connectMongo = require('./database/mongo');
const Post = require('./models/Post');

const swaggerUi = require('swagger-ui-express');
const redoc = require('redoc-express');
const swaggerSpec = require('./docs/swagger');

const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use((req, res, next) => {
    console.log(`Método: ${req.method} - URL: ${req.url}`);
    next();
});

app.use(bodyParser.json());

// ROTAS DOCS
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/redoc', redoc({ title: 'Blog API Docs', specUrl: '/docs-json', }));
app.get('/docs-json', (req, res) => res.json(swaggerSpec));

// ROTAS
// GET /posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar posts' });
    }
});

// GET /posts/search?q=termo
app.get('/posts/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({ message: 'Query "q" é obrigatória' });
        }

        const resultados = await Post.find({
            $or: [
                { title: { $regex: q.trim(), $options: 'i' } },
                { content: { $regex: q.trim(), $options: 'i' } }
            ]
        });

        if (resultados.length === 0) {
            return res.status(404).json({
                message: `Nenhum post encontrado para o termo "${q}"`
            });
        }

        res.json(resultados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar posts' });
    }
});

// GET /posts/:id
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        res.json(post);
    } catch {
        res.status(400).json({ message: 'ID inválido' });
    }
});

// POST /posts
app.post('/posts', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({
                message: 'Campos obrigatórios: title, content, author'
            });
        }

        const newPost = await Post.create({ title, content, author });
        res.status(201).json(newPost);
    } catch {
        res.status(500).json({ message: 'Erro ao criar post' });
    }
});

// PUT /posts/:id
app.put('/posts/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        res.json(updatedPost);
    } catch {
        res.status(400).json({ message: 'Erro ao atualizar post' });
    }
});

// DELETE /posts/:id
app.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        res.json({
            message: 'Post removido com sucesso',
            post: deletedPost
        });
    } catch {
        res.status(400).json({ message: 'Erro ao excluir post' });
    }
});

// ERRO GLOBAL
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo quebrou! :(' });
});

// START SERVER (somente runtime real)
async function startServer() {
    await connectMongo(false);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

if (require.main === module) {
    startServer();
}

module.exports = app;
