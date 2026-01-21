async function fetchComToken(url, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Token não encontrado no localStorage');
        window.location.href = 'login.html';
        return null;
    }

    const headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, {
        ...options,
        headers
    });
}

function carregarPerfil(){
    const Usuario = localStorage.getItem('usuarioLogado');
    

    if(!Usuario){
        
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(Usuario);
    
    //Agora preenchendo com textContent (para parágrafos)
    document.getElementById('Nome').textContent = usuario.nome || 'Não informado';
    document.getElementById('CPF').textContent = usuario.cpf || 'Não informado';
    document.getElementById('RG').textContent = usuario.rg || 'Não informado';
    document.getElementById('Sexo').textContent = usuario.sexo || 'Não informado';
    document.getElementById('DataNascimento').textContent = usuario.data_nascimento || 'Não informado';
    document.getElementById('Rua').textContent = usuario.rua || 'Não informado';
    document.getElementById('CEP').textContent = usuario.cep || 'Não informado';
    document.getElementById('Bairro').textContent = usuario.bairro || 'Não informado';
    document.getElementById('Estado').textContent = usuario.uf || 'Não informado';
    document.getElementById('Complemento').textContent = usuario.complemento || 'Não informado';
    document.getElementById('Cidade').textContent = usuario.cidade || 'Não informado';
    document.getElementById('email').textContent = usuario.email || 'Não informado';
    document.getElementById('Telefone').textContent = usuario.telefone || 'Não informado';

}


async function atualizarPerfilDoServidor() {
    try {
        const resposta = await fetchComToken('http://localhost:3000/perfil');

        if (!resposta || !resposta.ok) return;

        const usuarioAtualizado = await resposta.json();

        localStorage.setItem(
            'usuarioLogado',
            JSON.stringify(usuarioAtualizado)
        );
    } catch (error) {
        console.error('Erro ao sincronizar perfil', error);
    }
}

async function excluirConta() {
    const confirmacao = confirm(
        'Deseja realmente excluir sua conta? Esta ação não pode ser desfeita.'
    );

    if (!confirmacao) {
        console.log('Exclusão cancelada pelo usuário');
        return;
    }

    try {
        console.log('Iniciando exclusão de conta...');
        const resposta = await fetchComToken(
            'http://localhost:3000/perfil', 
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!resposta) {
            console.error('Nenhuma resposta recebida');
            alert('Erro ao conectar com o servidor');
            return;
        }

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.mensagem || 'Conta excluída com sucesso');
            localStorage.clear();
            window.location.href = 'login.html';
        } else {
            alert(dados.mensagem || 'Erro ao excluir conta');
        }
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        alert('Erro ao conectar com o servidor');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();

    const btnEditar = document.getElementById('btnEditar');
    if (btnEditar) {
        btnEditar.addEventListener('click', async () => {
            try {
                const resposta = await fetchComToken(
                    'http://localhost:3000/perfil', 
                    {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome: document.getElementById('inputNome').value,
                        cpf: document.getElementById('inputCPF').value,
                        rg: document.getElementById('inputRG').value,
                        sexo: document.getElementById('inputSexo').value,
                        dataNascimento: document.getElementById('inputdataNascimento').value,
                        rua: document.getElementById('inputRua').value,
                        numero: document.getElementById('inputNumero').value,
                        bairro: document.getElementById('inputBairro').value,
                        uf: document.getElementById('inputUF').value,
                        complemento: document.getElementById('inputComplemento').value,
                        cidade: document.getElementById('inputCidade').value,
                        email: document.getElementById('inputemail').value,
                        telefone: document.getElementById('inputTelefone').value,
                        telefone2: document.getElementById('inputTelefone2').value,
                        senha
                    })
                });

                const dados = await resposta.json();
                alert(dados.mensagem);

                await atualizarPerfilDoServidor();
                carregarPerfil();

            } catch (error) {
                console.error(error);
                alert('Erro ao atualizar perfil');
            }
        });
    }

    const btnExcluir = document.getElementById('btnExcluir');
    if (btnExcluir) {
        btnExcluir.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            excluirConta();
        });
    }
});