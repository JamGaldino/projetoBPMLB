window.addEventListener("load", carregarConfirmacao);

async function carregarConfirmacao() {
    const resp = await fetch("/carrinho");
    const itens = await resp.json();

    // vai aparecer a lista de livros
    const lista = document.getElementById("lista-confirmacao-livros");
    const detalhes = document.getElementById("detalhes-pedido");

    if (!lista || !detalhes) return;

    lista.innerHTML = "";
    detalhes.innerHTML = "";

    if (itens.length === 0) {
        lista.innerHTML = "<p>Nenhum livro no carrinho.</p>";
        return;
    }

    itens.forEach(livro => {
        const div = document.createElement("div");
        div.classList.add("item-pedido");
        div.innerHTML = `
        <div class = "livro-capa">
            <img src = "${livro.imagem_url}" alt="Capa ${livro.titulo}">
        </div>
        <div class = "livro-acoes">
            <div class = "quantidade-box">Quantidade 1</div>
            <a href = "carrinho.html"><button class = "botao-adicionar-mais">Adicionar</button></a>
        </div>
        `;
        lista.appendChild(div);

        // lista detalhes
        const p = document.createElement("p");
        p.classList.add("detalhe-item");
        p.textContent = `${livro.titulo} - ${livro.autor}`;
        detalhes.appendChild(p);
    });

    const btnFinalizar = document.querySelector(".botao-confirmacao-principal");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", async () => {
            await fetch("/carrinho", { method: "DELETE" });
            window.location.href = "carrinho.html";
        });
    }
}