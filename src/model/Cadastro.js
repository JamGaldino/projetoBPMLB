import db from '../data/database.js';

export async function InserirUsuarios(usuario) {
    const sql = `
        INSERT INTO usuarios (
            nome, cpf, rg, sexo, data_nascimento,
            rua, numero, bairro, uf, complemento,
            cidade, email, telefone, telefone2, senha
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return db.run(sql, [
        usuario.nome,
        usuario.cpf,
        usuario.rg,
        usuario.sexo,
        usuario.data_nascimento,
        usuario.rua,
        usuario.numero,
        usuario.bairro,
        usuario.uf,
        usuario.complemento,
        usuario.cidade,
        usuario.email,
        usuario.telefone,
        usuario.telefone2,
        usuario.senha
    ]);
}
