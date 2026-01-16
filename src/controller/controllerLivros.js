import fs from "fs";
import path from "path";
import paths from "../utils/paths.js";
import {
    listaLivros,
    getLivroPorTitulo,
    insertLivro,
    getLivrosTelaInicial,
    getExplorarPorGenero,
    getExplorar,
    getColecao
} from "../model/livrosModel.js";
import { error } from "console";



export async function importarLivros(req, res) {
    try {
        const caminho = path.join(paths.data, "livros.json");
        const livros = JSON.parse(fs.readFileSync(caminho, "utf-8"));

        for (const livro of livros) {
            await insertLivro(livro);
        }

        res.json({ mensagem: "Livros importados com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function detalhesLivro(req, res) {

    try {
        const { titulo } = req.query;
        const livro = await getLivroPorTitulo(titulo);
        res.json(livro);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error:error.message });
    }


}


export async function listarLivrosTelaInicial(req, res) {
    try {
        const livros = await getLivrosTelaInicial();
        res.json(livros);
    } catch (erro) {
        res.status(500).json({ error: error.message });
    }
}

// Responsável por buscar os livros exibidos na página de exploração
// - Se um gênero for informado na query (?genero=),
//   retorna apenas livros daquele gênero, exibindo 1 exemplar por título
// - Se nenhum gênero for informado,
//   retorna livros de todos os gêneros, exibindo 1 exemplar por título

export async function explorar(req, res) {
    try {
        const { genero } = req.query;

        let livros;

        if (genero) {
            livros = await getExplorarPorGenero(genero);
        } else {
            livros = await getExplorar();
        }

        res.json(livros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message});
    }
}

export async function explorarPorColecao(req, res) {
    const { colecao } = req.query;

    if (!colecao) {
        return res.status(400).json({ erro: "Coleção não informada" });
    }

    const livros = await getColecao(colecao);
    res.json(livros);
}


export async function listarLivros(req, res) {
    try {
        const livros = await listaLivros();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ erro: error.message});
    }
}


