import bd from '../data/database.js';

export default async function excluirConta(req, res) {
    try {
        const idUsuario = req.usuario.id;

        await bd.run(
            'DELETE FROM Usuarios WHERE id = ?',
            [idUsuario]
        );

        return res.json({ mensagem: 'Conta excluída com sucesso' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao excluir conta' });
    }
}
