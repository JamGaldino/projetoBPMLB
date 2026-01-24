window.addEventListener("load", () => {
    const btnLimpar = document.querySelector(".btn-limpar")
    const btnConfirmar = document.querySelector(".btn-confirmar");
    const container = document.getElementById("lista-carrinho")

    //guarda o estado atualdo carrinho na tela
    let carrinhoAtual = [];

    // obriga fazer o login
    function verificarLogin() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para acessar o carrinho");
            window.location.href = "login.html";
            return null;
        }
        return token;
    }

    //carrega o carrinho
    async function carregarCarrinho() {
        const token = verificarLogin();
        if (!token) return;
        
        const resp = await fetch("/carrinho", {
        headers: { "Authorization": `Bearer ${token}` }
        });

        //se o token for invalido/expirado
        if (resp.status === 401 || resp.status === 403) {
            alert("Sua sessão expirou. Faça login novamente");
            localStorage.removeItem("token");
            window.location.href = "login.html"
            return;
        }

        const itens = await resp.json();
        carrinhoAtual = itens;

        container.innerHTML = "";

        if (itens.lenght === 0) {
            container.innerHTML = `<p style = "padding: 12px;">Carrinho vazio.</p>`;
            return;
        }

        itens.forEach(livro => {
            const div = document.createElement("div");
            div.classList.add("lista-item");

            div.innerHTML = `
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

            container.appendChild(div);
        });
    }

        //remover item clicando no botão
    container.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("botao-remover")) return;
        
        const token = verificarLogin();
        if (!token) return;

        const id = e.target.dataset.id;

        
        const resp = await fetch(`/carrinho/${id}`, { 
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (resp.status === 401 || resp.status === 403) {
            alert("Sua sessão expirou. Faça login novamente");
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;

        }
        
        if (resp.ok) {
            e.target.closest(".lista-item").remove();
            carrinhoAtual = carrinhoAtual.filter(l => String(l.id) !== String(id));

            if (carrinhoAtual.length === 0) {
                container.innerHTML = `<p style = "padding: 12px;">Carrinho vazio.</p>`;
            }
        } else {
            alert("Não consegui remover");
        }
    });

    //limpar carrinho
    if (btnLimpar) {
        btnLimpar.addEventListener("click", async () => {
            const token = verificarLogin();
            if (!token) return;

            const resp = await fetch("/carrinho", {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (resp.status === 401 || resp.status === 403) {
                alert("Sua sessão expirou. Faça login novamente");
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            }

            if (resp.ok) {
                carrinhoAtual = [];
                container.innerHTML = `<p style = "padding: 12px;">Carrinho vazio.</p>`;
            } else {
                alert("Não foi possível limpar o carrinho");
            }
        });
    }  

    //so vai pra tela de confirmacao se tiver livro
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", (e) => {
            if (carrinhoAtual.length === 0) {
            e.preventDefault();
            alert("Adicione pelo menos 1 livro no carrinho antes de confirmar o pedido.");
            return;
        }
        window.location.href = "confirmacao-pedido.html";
    });
  }
  carregarCarrinho();
});

