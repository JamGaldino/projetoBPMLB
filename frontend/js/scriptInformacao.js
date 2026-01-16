window.addEventListener("load", main)

let exemplares = [] // guarda todos os exemplares do livro

async function main() {
    const params = new URLSearchParams(window.location.search)
    const titulo = params.get("titulo")

    if (!titulo) {
        console.log("Nenhum título informado")
        return
    }

    const resposta = await fetch(`/livros/detalhes?titulo=${encodeURIComponent(titulo)}`)
    const livros = await resposta.json()

    if (livros.length === 0) {
        console.log("Livro não encontrado")
        return
    }

    exemplares = livros

    preencherDetalhesLivro(livros[0])
    listarExemplares(livros)

    const btnCarrinho = document.getElementById("btnCarrinho")
    if (btnCarrinho) {
        btnCarrinho.addEventListener("click", adicionarAoCarrinho)
    }
}

function preencherDetalhesLivro(livro) {
    document.querySelector(".capa-livro").src = livro.imagem_url

    document.getElementById("titulo").textContent = livro.titulo
    document.getElementById("autor").textContent = livro.autor
    document.getElementById("editora").textContent = livro.ano_editora
    document.getElementById("isbn").textContent = livro.isbn
    document.getElementById("genero").textContent = livro.genero
    document.getElementById("paginas").textContent = livro.qtd_paginas
    document.getElementById("idioma").textContent = livro.idioma
    document.getElementById("classificacao").textContent = livro.classificacao_etaria
    document.getElementById("sinopse").textContent = livro.sinopse
    document.getElementById("id").textContent = livro.id_livro
    
    const linhaColecao = document.getElementById("linha-colecao");
    const spanColecao = document.getElementById("colecao");
    const linkColecao = document.getElementById("link-colecao");

    if (livro.colecao && livro.colecao.trim() !== "") {
        spanColecao.textContent = livro.colecao;
        linkColecao.href = `colecao.html?colecao=${encodeURIComponent(livro.colecao)}`;
    } else {
        linhaColecao.style.display = "none";
    }
    
}
function listarExemplares(lista) {
    const corpoTabela = document.getElementById("corpoTabela")
    corpoTabela.innerHTML = ""

    lista.forEach(exemplar => {
        const tr = document.createElement("tr")

        const tdId = document.createElement("td")
        tdId.textContent = exemplar.id_livro

        const tdSecao = document.createElement("td")
        tdSecao.textContent = exemplar.secao

        const tdStatus = document.createElement("td")
        tdStatus.textContent =
            exemplar.disponibilidade.toLowerCase() === "disponível"
                ? "Disponível"
                : "Indisponível"

        tr.appendChild(tdId)
        tr.appendChild(tdSecao)
        tr.appendChild(tdStatus)

        corpoTabela.appendChild(tr)
    })
}


function adicionarAoCarrinho() {
    const exemplarDisponivel = exemplares.find(
        exemplar => exemplar.disponibilidade.toLowerCase() === "disponível"
    )

    if (!exemplarDisponivel) {
        alert("Nenhum exemplar disponível no momento.")
        return
    }

    let carrinho = JSON.parse(localStorage.getItem("carrinho"))

    if (!carrinho) {
        carrinho = []
    }

    carrinho.push({
        id_exemplar: exemplarDisponivel.id_livro,
        titulo: exemplarDisponivel.titulo
    })

    localStorage.setItem("carrinho", JSON.stringify(carrinho))

    alert("Livro adicionado ao carrinho com sucesso!")
}
