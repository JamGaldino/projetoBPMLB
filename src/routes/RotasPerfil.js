import express from 'express';
import autenticar from '../middleware/auth.js';
import excluirContaController from '../controller/ExcluirConta.js';
import bd from '../data/database.js';

const router = express.Router();

router.delete('/perfil', autenticar, excluirContaController);
router.get('/perfil', autenticar, async (req, res) => {
    const usuario = await bd.get(
        'SELECT * FROM Usuarios WHERE id = ?',
        [req.usuario.id]
    );

    res.json(usuario);
});


export default router;
