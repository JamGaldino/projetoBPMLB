import bd from '../data/database.js';

export default async function editarPerfil(req, res) {
    try {
        const idUsuario = req.usuario.id;

        const {
            nome,
            cpf,
            rg,
            sexo,
            dataNascimento,
            rua,
            numero,
            bairro,
            uf,
            complemento,
            cidade,
            email,
            telefone,
            telefone2
        } = req.body;

        await bd.run(
            `
            UPDATE Usuarios SET
                nome = ?,
                cpf = ?,
                rg = ?,
                sexo = ?,
                dataNascimento = ?,
                rua = ?,
                numero = ?,
                bairro = ?,
                uf = ?,
                complemento = ?,
                cidade = ?,
                email = ?,
                telefone = ?,
                telefone2 = ?
            WHERE id = ?
            `,
            [
                nome,
                cpf,
                rg,
                sexo,
                dataNascimento,
                rua,
                numero,
                bairro,
                uf,
                complemento,
                cidade,
                email,
                telefone,
                telefone2,
                idUsuario
            ]
        );

        return res.json({ mensagem: 'Perfil atualizado com sucesso' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao atualizar perfil' });
    }
}
