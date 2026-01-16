window.addEventListener("load", main); // executa quando a página carregar

async function main() {

    const params = new URLSearchParams(window.location.search);
    const colecao = params.get("colecao");
    const tituloColecao = document.getElementById("nomeColecao");

    if (tituloColecao) {
        tituloColecao.textContent = colecao;
    }

    const containerLivros = document.getElementById("bookGrid");

    try {
        const resposta = await fetch(
            `/livros/colecao?colecao=${encodeURIComponent(colecao)}`
        );

        const livros = await resposta.json();


        livros.forEach(livro => {
            const card = criarCardLivro(livro);
            containerLivros.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar coleção:", erro);
        containerLivros.innerHTML =
            "<p>Erro ao carregar os livros.</p>";
    }
}

function criarCardLivro(livro) {
    const a = document.createElement("a");
    a.classList.add("book-card");

    // compatível com informacao.js
    a.href = `informacao.html?titulo=${encodeURIComponent(livro.titulo)}`;

    const img = document.createElement("img");
    img.src = livro.imagem_url;
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
