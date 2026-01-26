import { Router } from "express";
import bd from "../data/database.js";
import autenticar from "../middleware/auth.js";

const router = Router();

router.use(autenticar);

function soAdmin(req, res, next) {
    if (!req.usuario || req.usuario.email !== "admin@biblioteca.com") {
        return res.status(403).json({ mensagem: "Acesso negado" });
    }
    next();
}

router.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await bd.all(`
            SELECT id, nome, email, telefone
            FROM usuarios
            ORDER BY id DESC
        `);
        
        const formatado = usuarios.map(u => ({
            id: u.id,
            nome: u.nome,
            email: u.email,
            telefone: u.telefone,
            tipo: "Leitor",
            status: "Ativo"
        }));
        
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar usuários" });
    }
});

router.delete("/usuarios/:id", soAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ mensagem: "ID inválido" });

    // (opcional) impedir excluir o próprio admin logado
        if (req.usuario.id === id) {
            return res.status(400).json({ mensagem: "Você não pode excluir seu próprio usuário" });
        }

        const resultado = await bd.run("DELETE FROM usuarios WHERE id = ?", [id]);

        if (resultado.changes === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        res.json({ ok: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ mensagem: "Erro ao excluir usuário" });
    }
});

export default router;