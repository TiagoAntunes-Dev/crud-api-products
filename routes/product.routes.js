const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/product.controller');

// Rotas
router.get('/',       getProducts);         // Público
router.get('/:id',    getProduct);          // Público
router.post('/',      protect, createProduct);
router.put('/:id',    protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
