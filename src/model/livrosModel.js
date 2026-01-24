import { openDb } from "../data/configDB.js";

// a tabela de livros se não existir 
export async function createTableLivros() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Livros (
            id_livro INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            autor TEXT NOT NULL,
            imagem_url TEXT,
            colecao TEXT,
            sinopse TEXT,
            genero TEXT,
            ano_editora TEXT,
            isbn TEXT,
            idioma TEXT,
            qtd_paginas INTEGER,
            classificacao_etaria TEXT,
            disponibilidade TEXT DEFAULT 'Disponível',
            secao TEXT,

            destaque INTEGER DEFAULT 0,
            lancamento INTEGER DEFAULT 0
        )
    `);
}

// insere a informações de livro no bd, uso para inserir os data json no bd
export async function insertLivro(livro) {
    const db = await openDb();

    await db.run(`
        INSERT INTO Livros (
            titulo,
            autor,
            imagem_url,
            colecao,
            sinopse,
            genero,
            ano_editora,
            isbn,
            idioma,
            qtd_paginas,
            classificacao_etaria,
            disponibilidade,
            secao,
            destaque,
            lancamento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `, [
        livro.titulo,
        livro.autor,
        livro.imagem_url,
        livro.colecao,
        livro.sinopse,
        livro.genero,
        livro.ano_editora,
        livro.isbn,
        livro.idioma,
        livro.qtd_paginas,
        livro.classificacao_etaria,
        livro.disponibilidade ?? 'Disponível',
        livro.secao,
        livro.destaque ?? 0,
        livro.lancamento ?? 0
    ]);
}

export async function getAllLivros() {// seleciona toods os livros 
    const db = await openDb();
    return db.all('SELECT * FROM Livros');
}

export async function getLivroPorTitulo(titulo) {// usada na tela de informação de livro 
    const db = await openDb();
    return db.all(`
        SELECT
            id_livro,
            titulo,
            autor,
            imagem_url,
            colecao,
            ano_editora,
            isbn,
            genero,
            qtd_paginas,
            idioma,
            classificacao_etaria,
            secao,
            disponibilidade,
            sinopse
        FROM Livros
        WHERE titulo = ?;

    `, [titulo]
    );
}

export async function getLivrosTelaInicial() { // faz a varredura de quais livros são destaques e lancamentos 
    const db = await openDb();
    return db.all(`
        SELECT
            MAX(id_livro) AS id,
            titulo,
            autor,
            imagem_url,
            MAX(destaque) AS destaque,
            MAX(lancamento) AS lancamento
        FROM Livros
        WHERE destaque = 1 OR lancamento = 1
        GROUP BY titulo, autor, imagem_url;
    `);
}


// Retorna livros para a página Explorar quando UM gênero é selecionado
//  filtra pelo gênero informado,evita repetição de títulos, retorna apenas 1 exemplar por título
export async function getExplorarPorGenero(genero) { 
    const db = await openDb();
    return db.all(`
        SELECT l.*
        FROM Livros l
        INNER JOIN (
            SELECT MIN(id_livro) AS id
            FROM Livros
            WHERE genero = ?
            GROUP BY titulo
        ) resultado ON l.id_livro =  resultado.id;
    `, [genero]);
}


// Retorna livros para a página Explorar quando NENHUM gênero é selecionado
export async function getExplorar() {

    const db = await openDb();
    return db.all(`
        SELECT l.*
        FROM Livros l
        INNER JOIN (
            SELECT MIN(id_livro) AS id
            FROM Livros
            GROUP BY titulo
        ) resultado ON l.id_livro =  resultado.id;
    `);
}

export async function listarLivrosComColecao() {
    const sql = `
        SELECT 
            titulo,
            autor,
            imagem_url,
            colecao,
            genero
        FROM livros
        WHERE colecao IS NOT NULL
        AND colecao <> ''
        GROUP BY titulo
    `;

    const [rows] = await db.query(sql);
    return rows;
}

export async function getColecao(nomeColecao) {
    const db = await openDb();
    return db.all(`
        SELECT l.*
        FROM Livros l
        INNER JOIN (
            SELECT MIN(id_livro) AS id
            FROM Livros
            WHERE colecao = ?
            GROUP BY titulo
        ) resultado
        ON l.id_livro = resultado.id
    `, [nomeColecao]);
}
export async function listaLivros() {
    const db = await openDb();
    return db.all(`
        SELECT * 
        FROM Livros;
    `);
}
