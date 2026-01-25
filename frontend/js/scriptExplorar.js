window.addEventListener("load", carregarExplorar);

async function carregarExplorar() {
    const botoesGenero = document.querySelectorAll(".botoes-tipo .botao");
    const bookGrid = document.getElementById("bookGrid");

    carregarLivros();

    // Evento de clique nos botões de gênero
    botoesGenero.forEach(botao => {
        botao.addEventListener("click", (event) => {
            event.preventDefault(); // impede trocar de página

            // Remove classe ativo de todos
            botoesGenero.forEach(b => b.classList.remove("ativo"));
            botao.classList.add("ativo");

            const genero = botao.dataset.genero;
            carregarLivros(genero);
        });
    });
}

// Busca livros no backend (com ou sem gênero)
async function carregarLivros(genero) {
    const bookGrid = document.getElementById("bookGrid");
    bookGrid.innerHTML = ""; // limpa os cards atuais
    
    let url = "/livros/explorar-livros";

    if (genero) {
        url += `?genero=${encodeURIComponent(genero)}`;
    }
    
    const resposta = await fetch(url);

    const livros = await resposta.json();

    livros.forEach(livro => {
        const card = criarCardLivro(livro);
        bookGrid.appendChild(card);
    });
}

// Cria o card do livro
function criarCardLivro(livro) {
    const container = document.createElement("div");
    container.classList.add("book-card-container");

    const linkCard = document.createElement("a");
    linkCard.classList.add("book-card");
    linkCard.href = `informacao.html?titulo=${encodeURIComponent(livro.titulo)}`;


    const img = document.createElement("img");
    img.src = livro.imagem_url.trim();
    img.alt = livro.titulo;

    const titulo = document.createElement("h3");
    titulo.textContent = livro.titulo;

    const autor = document.createElement("p");
    autor.textContent = livro.autor;

    linkCard.appendChild(img);
    linkCard.appendChild(titulo);
    linkCard.appendChild(autor);


    // Botão de favoritar
    const btnFavoritar = document.createElement("button");
    btnFavoritar.classList.add("btn-favoritar");
    btnFavoritar.innerHTML = '&#9829;';
    btnFavoritar.title = "Adicionar aos favoritos";
    btnFavoritar.addEventListener("click", (e) => {
        e.preventDefault();
        adicionarFavorito(livro.id_livro, btnFavoritar);
    });

    container.appendChild(linkCard);
    container.appendChild(btnFavoritar);

    return container;
}

// Adiciona livro aos favoritos
async function adicionarFavorito(livroId, botao) {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("Você precisa estar autenticado para favoritar");
        return;
    }

    try {
        const resposta = await fetch("/favoritos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ livroId: livroId })
        });

        if (resposta.ok) {
            botao.classList.add("favoritado");
            alert("Livro adicionado aos favoritos!");
        } else {
            const erro = await resposta.json();
            alert(erro.erro || "Erro ao favoritar livro");
        }
    } catch (erro) {
        console.error("Erro ao favoritar:", erro);
        alert("Erro ao favoritar livro");
    }

}