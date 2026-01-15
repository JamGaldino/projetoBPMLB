window.addEventListener("load", main);

async function main() {
    const botoesGenero = document.querySelectorAll(".botoes-tipo .botao");
    const bookGrid = document.getElementById("bookGrid");

    // Carrega todos os livros ao entrar na página
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

    let url = "/explorar";

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
    const a = document.createElement("a");
    a.classList.add("book-card");
    a.href = `informacao.html?titulo=${encodeURIComponent(livro.titulo)}`;;

    const img = document.createElement("img");
    img.src = livro.imagem_url.trim();
    img.alt = livro.titulo;

    const h3 = document.createElement("h3");
    h3.textContent = livro.titulo;

    const p = document.createElement("p");
    p.textContent = livro.autor;

    a.appendChild(img);
    a.appendChild(h3);
    a.appendChild(p);

    return a;
}
