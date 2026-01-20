import { Router } from "express";
import { openDb } from "../configDB.js"

const router = Router();

// Guarda só os ids dos livros adicionados

const carrinhoIds = [];

// get /carrinho -> devolve os livros completos buscando no BD
router.get("/", async (req, res) => {
    try {
        if (carrinhoIds.length === 0) return res.json([]);

        const db = await openDb();

        // monta os "?, ?" conforme a quantidade de ids

        const placeholders = carrinhoIds.map(() => "?").join(",");

        const livros = await db.all(
            `SELECT id_livro AS id, titulo, autor, ano_editora, genero, imagem_url
            FROM Livros
            WHERE id_livro IN (${placeholders})`,
            carrinhoIds
        );

        res.json(livros);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar carrinho" });
    }
});


// post /carrinho -> recebe uma id e guarda no array
router.post("/adicionar", (req, res) => {
    const id = Number(req.body?.id || req.body?.livro?.id_exemplar || req.body?.livro?.id);

    if (!id) return res.status(400).json({ erro: "Envie um id válido" }); 

    if (!carrinhoIds.includes(id)) carrinhoIds.push(id);

    res.status(201).json({ ok: true, carrinhoIds });
});

// delete /carrinho/:id -> remove do array
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = carrinhoIds.indexOf(id);
    if (index === -1) return res.status(404).json({ erro: "Item não encontrado" });

    carrinhoIds.splice(index, 1);
    res.json({ ok: true, carrinhoIds });
});

router.delete("/", (req, res) => {
    carrinhoIds.length = 0;
    res.json({ ok: true });
});

export default router;