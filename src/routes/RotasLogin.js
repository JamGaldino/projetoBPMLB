import express from 'express';
import path from 'path';
import meusCaminhos from '../utils/paths.js';
import loginController from '../controller/loginController.js';

const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(meusCaminhos.frontend, 'login.html'));
});

router.post('/', loginController);

export default router;
