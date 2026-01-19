import { Router } from "express";

const router = Router();

// "banco" temporário em memória (pra apresentar funcioanndo)

const carrinho = [];

// get /carrinho -> lista itens
router.get("/", (req, res) => {
    res.json(carrinho);
});

// post /carrinho -> adiciona item
router.post("/", (req, res) => {
    const livro = req.body;

    if (!livro || !livro.id) {
        return res.status(400).json({ erro: "Envie um livro com id"});
    }

    // evita duplicado
    const jaExiste = carrinho.some(item => item.id === livro.id);
    if (!jaExiste) carrinho.push(livro);

    res.status(201).json({ ok: true, carrinho });
});

// delete /carrinho/:id -> remove item
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = carrinho.findIndex(item => item.id === id);

    if (index === -1) return res.status(404).json({ erro: "Item não encontrado" });

    carrinho.splice(index, 1);
    res.json({ ok: true, carrinho });
});

export default router;