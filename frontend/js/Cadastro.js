const form = document.querySelector('.principal-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const senha = document.getElementById('Senha').value;
    const confirmacao = document.getElementById('Confirmacao').value;

    if (senha !== confirmacao) {
        alert('As senhas não diferentes');
        return;
    }

    const dados = {
        nome: document.getElementById('Nome').value,
        cpf: document.getElementById('CPF').value,
        rg: document.getElementById('RG').value,
        sexo: document.getElementById('Sexo').value,
        data_nascimento: document.getElementById('DataNascimento').value,
        rua: document.getElementById('Rua').value,
        numero: document.getElementById('Numero').value,
        bairro: document.getElementById('Bairro').value,
        uf: document.getElementById('UF').value,
        complemento: document.getElementById('Complemento').value,
        cidade: document.getElementById('Cidade').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('Telefone').value,
        telefone2: document.getElementById('Telefone2').value,
        senha
    };

    try {
        const resposta = await fetch('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(resultado.mensagem || 'Erro ao cadastrar');
            return;
        }

        alert('Cadastro realizado com sucesso!');
        window.location.href = '/login.html';

    } catch (erro) {
        console.error(erro);
        alert('Erro ao conectar com o servidor');
    }
});
