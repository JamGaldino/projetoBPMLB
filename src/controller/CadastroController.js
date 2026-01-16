import bcrypt from 'bcryptjs';
import { InserirUsuarios } from '../model/Cadastro.js';

export default async function CadastroController(req, res) {
    try {
        console.log('DADOS RECEBIDOS:', req.body);

        const {
            nome, cpf, rg, sexo, data_nascimento,
            rua, numero, bairro, uf, complemento,
            cidade, email, telefone, telefone2, senha
        } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        await InserirUsuarios({
            nome,
            cpf,
            rg,
            sexo,
            data_nascimento,
            rua,
            numero,
            bairro,
            uf,
            complemento,
            cidade,
            email,
            telefone,
            telefone2,
            senha: senhaHash
        });

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário'
        });
    }
}
