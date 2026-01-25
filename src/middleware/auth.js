import jwt from 'jsonwebtoken';

const SECRET = 'Chave';

export default function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token ausente' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ mensagem: 'Token mal formatado' });
    }
    
    try {
        const decoded = jwt.verify(token, SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido' });
    }
}
