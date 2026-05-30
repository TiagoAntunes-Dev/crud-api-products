const express  = require('express');
const router   = express.Router();
const { getCategories, getCategory, createCategory, deleteCategory } = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',       getCategories);             // Público — Angular lê sem login
router.get('/:id',    getCategory);               // Público
router.post('/',      protect, createCategory);   // Protegido — precisa de JWT
router.delete('/:id', protect, deleteCategory);   // Protegido — precisa de JWT

module.exports = router;
