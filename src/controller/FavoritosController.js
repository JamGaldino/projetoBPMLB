
import {
    adicionarFavorito,
    listarFavoritos,
    removerFavorito
} from '../model/Favoritos.js';


export async function favoritar(req, res) {
    try {
        const usuarioId = req.usuario.id;
        const { livroId } = req.body;

        if (!livroId) {
            return res.status(400).json({ erro: 'livroId é obrigatório' });
        }

        await adicionarFavorito(usuarioId, livroId);
        res.status(201).json({ mensagem: 'Livro favoritado com sucesso' });
    } catch (error) {
        console.error("Erro ao favoritar livro:", error);
        res.status(400).json({ erro: 'Livro já favoritado ou erro ao favoritar' });
    }
}


export async function listar(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ erro: 'Usuário não autenticado' });
        }

        const usuarioId = req.usuario.id;
        console.log("Buscando favoritos do usuário:", usuarioId);
        
        const favoritos = await listarFavoritos(usuarioId);
        
        console.log("Favoritos encontrados:", favoritos.length);
        res.json(favoritos);

    } catch (error) {
        console.error("Erro na rota de favoritos:", error);
        res.status(500).json({ erro: 'Erro interno ao buscar favoritos', detalhes: error.message });
    }
}

export async function desfavoritar(req, res) {
    try {
        const usuarioId = req.usuario.id;
        const { livroId } = req.params;

        await removerFavorito(usuarioId, livroId);
        res.json({ mensagem: 'Favorito removido' });
    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        res.status(500).json({ erro: 'Erro ao remover favorito' });
    }
}
