window.addEventListener("load", carregarColecao); // executa quando a página carregar

async function carregarColecao() {

    const params = new URLSearchParams(window.location.search);
    const colecao = params.get("colecao");
    const tituloColecao = document.getElementById("nomeColecao");
    

    if (tituloColecao) {
        tituloColecao.textContent = colecao;
    }

    const containerLivros = document.getElementById("bookGrid");
    const resposta = await fetch(`/livros/colecao?colecao=${encodeURIComponent(colecao)}`);
    const livros = await resposta.json();


    livros.forEach(livro => {
        const card = criarCardLivro(livro);
        containerLivros.appendChild(card);
    });


}

function criarCardLivro(livro) {
    const container = document.createElement("div");
    container.classList.add("book-card-container");

    const linkCard = document.createElement("a");
    linkCard.classList.add("book-card");

    // compatível com informacao.js
    linkCard.href = `informacao.html?titulo=${encodeURIComponent(livro.titulo)}`;
    const img = document.createElement("img");
    img.src = livro.imagem_url;
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
