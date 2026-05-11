const express = require('express');
const router = express.Router();

// Importa todas as lógicas do controller de uma vez só
const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/product.controller');

// Rotas
router.get('/', getProducts);          // Pegar todos
router.get('/:id', getProduct);        // Pegar um só
router.post('/', createProduct);       // Criar
router.put('/:id', updateProduct);     // Atualizar
router.delete('/:id', deleteProduct);  // Deleta

module.exports = router;
