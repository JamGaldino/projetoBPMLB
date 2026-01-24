window.addEventListener("load", carregarConfirmacao);

function verificarLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado");
        window.location.href = "login.html";
        return null;
    }
    return token;
}

async function carregarConfirmacao() {
    const token = verificarLogin();
    if (!token) return;

    const lista = document.getElementById("lista-confirmacao-livros");
    const detalhes = document.getElementById("detalhes-pedido");

    if (!lista || !detalhes) return;

    try {
        const resp = await fetch("/carrinho", {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (resp.status === 401 || resp.status === 403) {
      alert("Sua sessão expirou. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const itens = await resp.json();

    lista.innerHTML = "";
    detalhes.innerHTML = "";

    if (itens.length === 0) {
      alert("Seu carrinho está vazio. Volte e adicione um livro.");
      window.location.href = "carrinho.html";
      return;
    }

    itens.forEach((livro) => {
      const div = document.createElement("div");
      div.classList.add("item-pedido");
      div.innerHTML = `
        <div class="livro-capa">
          <img src="${livro.imagem_url}" alt="Capa ${livro.titulo}">
        </div>
        <div class="livro-acoes">
          <div class="quantidade-box">Quantidade 1</div>
          <a href="carrinho.html"><button class="botao-adicionar-mais">Adicionar</button></a>
        </div>
      `;
      lista.appendChild(div);

      const p = document.createElement("p");
      p.classList.add("detalhe-item");
      p.textContent = `${livro.titulo} - ${livro.autor}`;
      detalhes.appendChild(p);
    });

    const btnFinalizar = document.querySelector(".botao-confirmacao-principal");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", async () => {
        await fetch("/carrinho", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        window.location.href = "carrinho.html";
      });
    }
  } catch {
    alert("Erro de conexão com o servidor");
  }
} 