const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/product.controller');

// 1. Agrupamento de rotas para a raiz ('/')
router.route('/')
    .get(getProducts)       // Pegar todos
    .post(createProduct);   // Criar

// 2. Agrupamento de rotas para um ID específico ('/:id')
router.route('/:id')
    .get(getProduct)        // Pegar um só
    .put(updateProduct)     // Atualizar
    .delete(deleteProduct); // Deletar

module.exports = router;