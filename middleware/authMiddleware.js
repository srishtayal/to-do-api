const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).send('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = data;
        next();
    } catch (err) {
        res.status(401).send('Unauthorized');
    }
};

module.exports = authMiddleware;
