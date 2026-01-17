
async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // LOGIN SUCESSO: Guarda os dados do SQLite no localStorage
            // Assim a página de Perfil poderá ler esses dados depois
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            //local storageÉ um armazenamento do navegador, Guarda dados em chave / valor
            //setItem (chave, valor) = serve para salvar algo
            //'chave'  → 'usuarioLogado' e 'valor'  → JSON.stringify(data.usuario)
            // JSON.stringify(data.usuario)= Transforma objeto → string,
            //data.usuario  =Normalmente vem de uma API (login ou cadastro).

            alert('Login realizado com sucesso!');
            window.location.href = 'Perfil.html'; 
        } else {
            // ERRO: Exibe a mensagem vinda do servidor (ex: "Senha incorreta")
            alert(data.mensagem);
        }
    } catch (error) {
        console.log(error)
        alert('Erro ao conectar com o servidor');
    }
}
