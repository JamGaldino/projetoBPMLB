window.addEventListener("load", carregarInformacao)

let exemplares = [] // guarda todos os exemplares do livro

async function carregarInformacao() {
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

    preencherInformacoesLivro(livros[0])
    TabelaDosExemplares(livros)

    const btnCarrinho = document.getElementById("btnCarrinho")
    if (btnCarrinho) {
        btnCarrinho.addEventListener("click", adicionarAoCarrinho)
    }
}

function preencherInformacoesLivro(livro) {
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

    const linhaColecao = document.getElementById("lugar-colecao");
    const spanColecao = document.getElementById("colecao");
    const linkColecao = document.getElementById("link-colecao");

    if (livro.colecao && livro.colecao.trim() !== "") {
        spanColecao.textContent = livro.colecao;
        linkColecao.href = `colecao.html?colecao=${encodeURIComponent(livro.colecao)}`;
    } else {
        linhaColecao.style.display = "none";
    }
    
    // Adicionar botão de favoritar ao header
    const detalhesHeader = document.querySelector(".detalhes-header");
    if (detalhesHeader && !document.getElementById("btnFavoritar")) {
        const btnFavoritar = document.createElement("img");
        btnFavoritar.id = "btnFavoritar";
        btnFavoritar.src = "img/Star.png";
        btnFavoritar.alt = "Adicionar aos favoritos";
        btnFavoritar.style.cursor = "pointer";
        btnFavoritar.style.width = "40px";
        btnFavoritar.style.marginLeft = "10px";
        btnFavoritar.addEventListener("click", () => favoritarLivro(livro.id_livro));
        detalhesHeader.appendChild(btnFavoritar);
    }
}

// Função para favoritarlivro na página de informação
async function favoritarLivro(livroId) {
    const token = localStorage.getItem("token");
    
    console.log(" Tentando favoritar livro ID:", livroId);
    console.log("Token:", token ? "Existe" : " Não existe");
    
    if (!token) {
        alert("Você precisa estar autenticado para favoritar");
        return;
    }

    try {
        console.log("Enviando requisição POST para /favoritos");
        const resposta = await fetch("/favoritos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ livroId: livroId })
        });

        console.log("Resposta do servidor:", resposta.status, resposta.statusText);

        if (resposta.ok) {
            console.log("Livro favoritado com sucesso!");
            alert("Livro adicionado aos favoritos!");
            const btnFavoritar = document.getElementById("btnFavoritar");
            if (btnFavoritar) {
                btnFavoritar.style.opacity = "1";
                btnFavoritar.style.filter = "brightness(0.8)";
            }
        } else {
            const erro = await resposta.json();
            console.error("Erro do servidor:", erro);
            alert(erro.erro || "Erro ao favoritar livro");
        }
    } catch (erro) {
        console.error("Erro ao favoritar:", erro);
        alert("Erro ao favoritar livro");
    }
}
function TabelaDosExemplares(lista) {
    const corpoTabela = document.getElementById("corpoTabela")
    corpoTabela.innerHTML = "" // limpa o corpo da tabela antes de adicionar novos dados

    lista.forEach(exemplar => {
        const CriarTabela = document.createElement("tr") // cria uma linha na tabela

        const inforId = document.createElement("td")    // cria uma coluna na tabela
        inforId.textContent = exemplar.id_livro

        const infoSecao = document.createElement("td")
        infoSecao.textContent = exemplar.secao

        const inforStatus = document.createElement("td")
        inforStatus.textContent =
            exemplar.disponibilidade.toLowerCase() === "disponível"
                ? "Disponível"
                : "Indisponível"

        CriarTabela.appendChild(inforId)
        CriarTabela.appendChild(infoSecao)
        CriarTabela.appendChild(inforStatus)

        corpoTabela.appendChild(CriarTabela)
    })
}


function adicionarAoCarrinho() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para adicionar ao carrinho.");
        window.location.href = "login.html";
        return;
    }

    const exemplarDisponivel = exemplares.find(
        exemplar => exemplar.disponibilidade.toLowerCase() === "disponível"
    )

    if (!exemplarDisponivel) {
        alert("Nenhum exemplar disponível no momento.")
        return
    }

    const livroBase = exemplares[0]; //dados base do livro

    const livroParaCarrinho = {
        id: livroBase.id_livro,
        titulo: livroBase.titulo,
        autor: livroBase.autor,
        ano_editora: livroBase.ano_editora,
        genero: livroBase.genero,
        imagem_url: livroBase.imagem_url
    };


    fetch("/carrinho/adicionar", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ livro: livroParaCarrinho })
    })
        .then(async (resp) => {
            if (resp.status === 401) {
                alert("Sessão expirada. Faça login novamente.");
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            } 
            
            if (resp.ok) alert("Livro adicionado ao carrinho.");
            else alert("Não consegui adicionar ao carrinho.");
        })
        .catch(() => alert("Erro de conexão com o servidor."));    
}

// Função para favoritar livro na página de informação
async function favoritarLivro(livroId) {
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
            alert("Livro adicionado aos favoritos!");
            const btnFavoritar = document.getElementById("btnFavoritar");
            if (btnFavoritar) {
                btnFavoritar.style.opacity = "1";
                btnFavoritar.style.filter = "brightness(0.8)";
            }
        } else {
            const erro = await resposta.json();
            alert(erro.erro || "Erro ao favoritar livro");
        }
    } catch (erro) {
        console.error("Erro ao favoritar:", erro);
        alert("Erro ao favoritar livro");
    }
}
