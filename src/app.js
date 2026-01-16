import express from 'express';
import meusCaminhos from './utils/paths.js';
import router from './routes/routeLivros.js'
import { createTableLivros } from './model/livrosModel.js';
import cadastroRoutes from './routes/RotasCadastro.js';
import RotasLogin from './routes/RotasLogin.js';
import './data/database.js';
import path from 'path';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("frontend"));
app.use(express.static(meusCaminhos.frontend));

app.get('/', (req, res) => {
    res.sendFile(path.join(meusCaminhos.frontend, 'inicial.html'));
});

app.use('/cadastro', cadastroRoutes);
app.use('/login', RotasLogin);
//app.use(router);
app.use("/livros", router)

await createTableLivros()





app.listen(3000, () => console.log("Api Rodando."));
console.log('Acesse em http://localhost:3000');