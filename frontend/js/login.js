
async function fetchComToken(url, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        throw new Error('Token ausente');
    }

    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${token}`;

    return fetch(url, {
        ...options,
        headers
    });
}



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
            
            localStorage.setItem('token', data.token);

            
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));

            alert('Login realizado com sucesso!');
            window.location.href = 'Perfil.html'; 
        } else {
            alert(data.mensagem);
        }
    } catch (error) {
        console.log(error);
        alert('Erro ao conectar com o servidor');
    }
}
