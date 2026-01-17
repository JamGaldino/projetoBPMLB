window.addEventListener("load", main); // executa quando toda a página carregar

async function main() {

    // ===============================
    // PEGAR O TÍTULO PELA URL
    // ===============================
    const params = new URLSearchParams(window.location.search);
    const titulo = params.get("titulo");

    if (!titulo) {
        console.error("Título do livro não encontrado na URL");
        return;
    }

    // ===============================
    // BUSCAR DADOS NO BACKEND
    // ===============================
    const resposta = await fetch(`/livros/detalhes?titulo=${encodeURIComponent(titulo)}`);
    const livros = await resposta.json();

    if (!livros || livros.length === 0) {
        console.error("Livro não encontrado no banco");
        return;
    }

    // ===============================
    // DADOS GERAIS DO LIVRO
    // (todos os registros têm os mesmos dados)
    // ===============================
    const livro = livros[0];

    preencherDadosLivro(livro);
    montarTabelaExemplares(livros);
    configurarBotaoCarrinho(livros);
}

/* ======================================================
    PREENCHE AS INFORMAÇÕES DO LIVRO NA TELA
====================================================== */
function preencherDadosLivro(livro) {

    document.getElementById("titulo").textContent = livro.titulo;
    document.getElementById("autor").textContent = livro.autor;
    document.getElementById("editora").textContent = livro.ano_editora;
    document.getElementById("isbn").textContent = livro.isbn;
    document.getElementById("genero").textContent = livro.genero;
    document.getElementById("paginas").textContent = livro.qtd_paginas;
    document.getElementById("idioma").textContent = livro.idioma;
    document.getElementById("classificacao").textContent = livro.classificacao_etaria;
    document.getElementById("sinopse").textContent = livro.sinopse;
    document.getElementById("id").textContent = livro.id_livro;



    const capa = document.querySelector(".capa-livro");
    capa.src = livro.imagem_url;
    capa.alt = livro.titulo;
}

/* ======================================================
    MONTA A TABELA DE EXEMPLARES
    (INDISPONÍVEL NÃO É CLICÁVEL)
====================================================== */
function montarTabelaExemplares(exemplares) {

    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = "";

    exemplares.forEach(exemplar => {

        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        const tdSecao = document.createElement("td");
        const tdSituacao = document.createElement("td");

        tdId.textContent = exemplar.id_livro;
        tdSecao.textContent = exemplar.secao;
        tdSituacao.textContent = exemplar.disponibilidade;

        if (exemplar.disponibilidade === "Disponível") {

            tdId.classList.add("clicavel");
            tdSecao.classList.add("clicavel");

            tdId.addEventListener("click", () => {
                window.location.href = `exemplar.html?id=${exemplar.id_livro}`;
            });

            tdSecao.addEventListener("click", () => {
                window.location.href = `exemplar.html?id=${exemplar.id_livro}`;
            });

        } else {

            tdId.classList.add("indisponivel");
            tdSecao.classList.add("indisponivel");
        }

        tr.appendChild(tdId);
        tr.appendChild(tdSecao);
        tr.appendChild(tdSituacao);

        corpoTabela.appendChild(tr);
    });
}

/* ======================================================
CONFIGURA O BOTÃO DO CARRINHO
====================================================== */
function configurarBotaoCarrinho(exemplares) {

    const botaoCarrinho = document.getElementById("btnCarrinho");

    if (!botaoCarrinho) return;

    // verifica se existe pelo menos um exemplar disponível
    const existeDisponivel = exemplares.some(
        exemplar => exemplar.disponibilidade === "Disponível"
    );

    if (!existeDisponivel) {
        botaoCarrinho.style.opacity = "0.5";
        botaoCarrinho.style.cursor = "not-allowed";
        botaoCarrinho.title = "Livro indisponível";
        return;
    }

    botaoCarrinho.addEventListener("click", async () => {
        const livro = exemplares[0];//dados base do livro

        const livroParaCarrinho = {
            id: livro.id_livro,
            titulo: livro.titulo,
            autor: livro.autor,
            ano_editora: livro.ano_editora,
            genero: livro.genero,
            imagem_url: livro.imagem_url
        };

        const resp = await fetch("/carrinho", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livroParaCarrinho)
        });

        if (resp.ok) {
            alert("Livro adicionado ao carrinho 🛒");
        } else {
            alert("Não consegui adicionar no carrinho.")
        }
    });
}
