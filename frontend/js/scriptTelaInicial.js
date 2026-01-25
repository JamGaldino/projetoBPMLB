window.addEventListener("load", carregarTelaInicial) // executa quando toda pagina carregar

async function carregarTelaInicial() { 

    const botaoSobre = document.querySelector(".botao-um")
    const botaoSaga = document.querySelector(".botao-dois") // pega os botões existentes

    if (botaoSobre) {
        botaoSobre.addEventListener("click", console.log("Banner: conhecer sobre nós"))
    }

    if (botaoSaga) {
        botaoSaga.addEventListener("click",console.log("Banner: conhecer saga Harry Potter"))
    }

    const resposta = await fetch("/livros/tela-inicial") // caminho para pega os dados aqui 
    const livros = await resposta.json()

    const containerDestaques = document.getElementById("destaques")
    const containerLancamentos = document.getElementById("lancamentos") // são containes para colocar os card de livro

    livros.forEach(livro => { // para cada livro , vai criar um card
        const card = criarCardLivro(livro)

        // Se for destaque
        if (livro.destaque === 1) {
            containerDestaques.appendChild(card)
        }

        // Se for lançamento
        if (livro.lancamento === 1) {
            containerLancamentos.appendChild(card.cloneNode(true))
        }
    })
}

function criarCardLivro(livro) {
    const a = document.createElement("a")
    a.classList.add("book-card")                //criação do link e envia o id do livro na URL

    a.href = `informacao.html?titulo=${encodeURIComponent(livro.titulo)}`

    const img = document.createElement("img")
    img.src = livro.imagem_url                     // cria a imagem e coloca como texto alternativoo o seu titulo
    img.alt = livro.titulo

    const h3 = document.createElement("h3")
    h3.textContent = livro.titulo                // cria o titulo

    const p = document.createElement("p")       // coloac o autor 
    p.textContent = livro.autor

    a.appendChild(img)
    a.appendChild(h3)                        // adiciona os elementos na "div" 
    a.appendChild(p)

    return a
}