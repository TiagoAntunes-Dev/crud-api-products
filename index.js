const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    })
    .catch((error) => {
        console.error('❌ Database connection error:', error); 
    });