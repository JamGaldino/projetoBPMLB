import bcrypt from 'bcryptjs';
import bd from '../data/database.js';

export default async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Email e senha são obrigatórios'
            });
        }
        
        const usuario = await bd.get(
            'SELECT * FROM Usuarios WHERE email = ?',
            [email]
        );

        if (!usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos'
            });
        }

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                rg: usuario.rg,
                sexo: usuario.sexo,
                data_nascimento: usuario.data_nascimento,
                telefone: usuario.telefone,
                telefone2: usuario.telefone2,
                cep: usuario.cep,
                rua: usuario.rua,
                numero: usuario.numero,
                complemento: usuario.complemento,
                bairro: usuario.bairro,
                cidade: usuario.cidade,
                uf: usuario.uf
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: 'Erro ao realizar login'
        });
    }
}
