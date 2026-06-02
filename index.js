const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3000', 'http://127.0.0.1:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Definição da porta com fallback para desenvolvimento local
const PORT = process.env.PORT || 4000;

// Health check — útil para verificar se a API está viva
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Product CRUD API v2.0',
        endpoints: {
            auth:       '/api/auth',
            products:   '/api/products',
            categories: '/api/categories'
        }
    });
});

// Rotas
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/products',   require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));

// --- NOVO: Middleware Centralizado de Erros ---
// Ele recebe 4 argumentos: (err, req, res, next)
app.use((err, req, res, next) => {
    console.error('Erro capturado pelo Middleware:', err.stack);
    
    // Padronização da resposta de erro
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno no servidor',
    });
});

// Conexão com o banco e inicialização do servidor
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to Database!');
        
        // 2. Utiliza a constante PORT criada acima
        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(' Database connection error:', error); 
    });