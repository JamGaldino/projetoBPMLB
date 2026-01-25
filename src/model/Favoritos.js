import db from '../data/database.js';

import { openDb } from '../data/configDB.js';

export async function criarTabelaFavoritos() {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS favoritos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            livro_id INTEGER NOT NULL,
            UNIQUE (usuario_id, livro_id)
        )
    `);
}


export async function adicionarFavorito(usuarioId, livroId) {
    return db.run(
        'INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)',
        [usuarioId, livroId]
    );
}

export async function listarFavoritos(usuarioId) {
    // Buscar IDs dos favoritos
    const favoritos = await db.all(`
        SELECT livro_id
        FROM favoritos
        WHERE usuario_id = ?
        ORDER BY id DESC
    `, [usuarioId]);

    if (!favoritos || favoritos.length === 0) {
        return [];
    }

    // Buscar dados dos livros
    const dbLivros = await openDb();
    const livrosData = [];

    for (const fav of favoritos) {
        const livro = await dbLivros.get(`
            SELECT 
                id_livro as id,
                imagem_url as imagem,
                genero as categoria,
                titulo
            FROM Livros
            WHERE id_livro = ?
        `, [fav.livro_id]);
        
        if (livro) {
            livrosData.push(livro);
        }
    }

    return livrosData;
}



export async function removerFavorito(usuarioId, livroId) {
    return db.run(
        'DELETE FROM favoritos WHERE usuario_id = ? AND livro_id = ?',
        [usuarioId, livroId]
    );
}
