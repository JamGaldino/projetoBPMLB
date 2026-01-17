import express from 'express';
import router from './routes/routeLivros.js'
import { createTableLivros } from './model/livrosModel.js';
import carrinhoRouter from "./routes/routeCarrinho.js";

const app = express();
app.use(express.json());
app.use(express.static("frontend"));

app.use(router);

await createTableLivros()

app.use("/livros", router)
app.use("/carrinho", carrinhoRouter);

const carrinho = [];

app.get("/carrinho", (req, res) => {
    res.json(carrinho);
});

app.post("/carrinho/adicionar", (req, res) => {
    const { livro } = req.body;
    if (!livro || !livro.id) return res.status(400).json({ erro: "Livro inválido"});

    const existe = carrinho.some((x) => x.id === livro.id);
    if (!existe) carrinho.push(livro);

    res.json({ ok: true });
});

app.listen(3000, () => console.log("Api Rodando."))