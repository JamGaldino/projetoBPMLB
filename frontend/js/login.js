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

        if (!response.ok) {
            alert(data.mensagem);
            return;
        }

        alert('Login realizado com sucesso');
        window.location.href = '/Inicial.html';

    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
}
