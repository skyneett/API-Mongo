const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (token !== 'mi_token_secreto') {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    next();
};

module.exports = authMiddleware;    