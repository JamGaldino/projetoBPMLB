import express from 'express';
import autenticar from '../middleware/auth.js';
import {
    favoritar,
    listar,
    desfavoritar
} from '../controller/FavoritosController.js';

const router = express.Router();

router.post('/', autenticar, favoritar);
router.get('/', autenticar, listar);
router.delete('/:livroId', autenticar, desfavoritar);

export default router;
