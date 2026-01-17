
// ajeitar o html do perfil, com o resto de informação que falta

function carregarPerfil(){
    const Usuario = localStorage.getItem('usuarioLogado');
    //isso é para pegar o item e colocar no local storad=ge criado no login

    if(!Usuario){
        //ver se ele esta vazio, se não huove dados e manda voltar para login
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(Usuario);
    //JSON.parse() converte string → objeto
    //Sem isso, você não consegue acessar propriedades

    //Agora preenchendo com textContent (para parágrafos)
    document.getElementById('Nome').textContent = usuario.nome || 'Não informado';
    document.getElementById('CPF').textContent = usuario.cpf || 'Não informado';
    document.getElementById('RG').textContent = usuario.rg || 'Não informado';
    document.getElementById('Sexo').textContent = usuario.sexo || 'Não informado';
    document.getElementById('Data de nascimento').textContent = usuario.data_nascimento || 'Não informado';
    document.getElementById('Rua').textContent = usuario.rua || 'Não informado';
    document.getElementById('CEP').textContent = usuario.cep || 'Não informado';
    document.getElementById('Bairro').textContent = usuario.bairro || 'Não informado';
    document.getElementById('Estado').textContent = usuario.uf || 'Não informado';
    document.getElementById('Complemento').textContent = usuario.complemento || 'Não informado';
    document.getElementById('Cidade').textContent = usuario.cidade || 'Não informado';
    document.getElementById('email').textContent = usuario.email || 'Não informado';
    document.getElementById('Telefone').textContent = usuario.telefone || 'Não informado';

}
//“Quando o HTML terminar de carregar, execute a função carregarPerfil.”
document.addEventListener('DOMContentLoaded', carregarPerfil);

// Função para Excluir Conta
async function excluirConta() {
    const confirmacao = confirm("Deseja realmente excluir sua conta? Esta ação não pode ser desfeita.");
    
    if (confirmacao) {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

        try {
            const resposta = await fetch(`http://localhost:3000/perfil/cancelar/${usuario.id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                alert("Conta excluída com sucesso.");
                localStorage.clear();
                window.location.href = "telaInicial.html";
            }
        } catch (error) {
            alert("Erro ao conectar com o servidor.");
        }
    }
}

// Vinculando a função de exclusão ao botão
document.querySelector('.botao-Branco').addEventListener('click', excluirConta);