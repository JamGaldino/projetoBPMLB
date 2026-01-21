import express from 'express';
import path from 'path';
import meusCaminhos from '../utils/paths.js';
import CadastroController from '../controller/CadastroController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(meusCaminhos.frontend, 'Cadastro.html'));
});

router.post('/', async (req, res) => {
    await CadastroController(req, res);
});

export default router;
