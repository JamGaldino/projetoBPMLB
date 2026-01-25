import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await open({
    filename: path.join(__dirname, 'Usuarios.db'),
    driver: sqlite3.Database
});

await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        rg TEXT NOT NULL UNIQUE,
        sexo TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,
        rua TEXT NOT NULL,
        numero TEXT NOT NULL,
        bairro TEXT NOT NULL,
        uf TEXT NOT NULL,
        complemento TEXT,
        cidade TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        telefone TEXT NOT NULL UNIQUE,
        telefone2 TEXT,
        senha TEXT NOT NULL
    );
`);


await db.exec(`
    CREATE TABLE IF NOT EXISTS favoritos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        livro_id INTEGER NOT NULL,
        UNIQUE (usuario_id, livro_id), 
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
`);

console.log('Banco conectado e tabelas (usuários, livros e favoritos) prontas!');

console.log('Banco conectado e tabela usuários pronta');

export default db;
