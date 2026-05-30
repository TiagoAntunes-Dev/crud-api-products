const jwt = require('jsonwebtoken');

// Middleware que protege rotas — verifica o token JWT no header
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Espera o formato: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // jwt.verify lança erro se expirado ou com assinatura inválida
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // disponibiliza os dados do usuário nos controllers
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = { protect };
