window.addEventListener("load", main);

const btnLimpar = document.querySelector(".btn-limpar")

if (btnLimpar) {
    btnLimpar.addEventListener("click", async () => {
        try {
            const resp = await fetch ("/carrinho", {
                method: "DELETE"
            });

            if (resp.ok) {
                document.getElementById("lista-carrinho").innerHTML = "";
            } else {
                alert ("Não foi possível limpar o carrinho.");
            }
        } catch (erro) {
            alert("Erro de conexão com o servidor.");
        }
    });
}

async function main() {
    const container = document.getElementById("lista-carrinho");

    const resp = await fetch("/carrinho");
    const itens = await resp.json();

    container.innerHTML = "";

    itens.forEach(livro => {
        const item = document.createElement("div");
        item.classList.add("lista-item");

        item.innerHTML = `
        <div class="coluna-selecao">
            <input type="checkbox" checked>
        </div>

        <div class="coluna-capa">
            <img src="${livro.imagem_url}" alt="Capa ${livro.titulo}">
        </div>

        <div class="coluna-info">
            <p><strong>Título:</strong> ${livro.titulo}</p>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Ano/Editora:</strong> ${livro.ano_editora}</p>
            <p><strong>Gênero:</strong> ${livro.genero}</p>
        </div>

        <div class="coluna-acao">
            <button class="botao-remover" data-id="${livro.id}">Remover</button>
        </div>
        `;

        container.appendChild(item);
    });

    container.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("botao-remover")) return;
        
        const id = e.target.dataset.id;

        const resp = await fetch(`/carrinho/${id}`, { method: "DELETE" });

        if (resp.ok) {
            e.target.closest(".lista-item").remove();
        } else {
            alert("Não consegui remover no servidor.");
        }
    });
};