const express  = require('express');
const router   = express.Router();
const { register, login, me } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, me); // Rota de teste: valida se o token ainda é válido

module.exports = router;
