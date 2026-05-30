const jwt  = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (user) =>
    jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

// POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: 'E-mail já está em uso.' });
        }

        // O hook pre('save') faz o hash da senha automaticamente
        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: 'Usuário criado com sucesso.',
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }

        const user = await User.findOne({ email });

        // Mensagem genérica: não revela se o e-mail existe ou não
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        res.status(200).json({
            message: 'Login realizado com sucesso.',
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me  — rota de validação do token
const me = (req, res) => {
    // req.user foi injetado pelo middleware protect
    res.status(200).json({ user: req.user });
};

module.exports = { register, login, me };
