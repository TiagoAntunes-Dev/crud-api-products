const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Definição da porta com fallback para desenvolvimento local
const PORT = process.env.PORT || 3000;

// Rota raiz de teste
app.get('/', (req, res) => {
    res.send('Hello, World! Updated with nodemon!');
});

// Registrar o arquivo de rotas (Isso adiciona /api/products antes de tudo no product.routes)
app.use('/api/products', require('./routes/product.routes'));

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