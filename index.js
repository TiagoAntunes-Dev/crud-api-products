const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Definição da porta com fallback para desenvolvimento local
const PORT = process.env.PORT || 27017;

// Rota raiz de teste
app.get('/', (req, res) => {
    res.send('Hello, World! Updated with error handling!');
});

// Registrar o arquivo de rotas (Isso adiciona /api/products antes de tudo no product.routes)
app.use('/api/products', require('./routes/product.routes'));

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