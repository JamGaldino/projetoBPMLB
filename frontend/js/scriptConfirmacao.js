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

function preencherEndereco() {
  const usuarioStr = localStorage.getItem("usuarioLogado");
  if (!usuarioStr) return;

  const usuario = JSON.parse(usuarioStr);

  const ruaCompleta = `${usuario.rua || ""}${usuario.numero ? ", " + usuario.numero : ""}${usuario.complemento ? " - " + usuario.complemento : ""}`;

  const elRua = document.getElementById("end-rua");
  const elCep = document.getElementById("end-cep");
  const elBairro = document.getElementById("end-bairro");
  const elCidade = document.getElementById("end-cidade");
  const elUf = document.getElementById("end-uf");

  if (elRua) elRua.textContent = ruaCompleta.trim() || "Rua não cadastrada";
  if (elCep) elCep.textContent = `CEP: ${usuario.cep || "-"}`;
  if (elBairro) elBairro.textContent = `Bairro: ${usuario.bairro || "-"}`;
  if (elCidade) elCidade.textContent = `Cidade: ${usuario.cidade || "-"}`;
  if (elUf) elUf.textContent = `Estado: ${usuario.uf || "-"}`;
}

function formatarDataBR(data) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function preencherInfoEmprestimo() {
  const PRAZO_DIAS = 30;

  const hoje = new Date();
  const devolucao = new Date();
  devolucao.setDate(hoje.getDate() + PRAZO_DIAS);

  const elPrazo = document.getElementById("prazo-emprestimo");
  const elDevolucao = document.getElementById("data-devolucao");

  if (elPrazo) elPrazo.textContent = `${PRAZO_DIAS} dias`;
  if (elDevolucao) elDevolucao.textContent = formatarDataBR(devolucao);
}

async function carregarConfirmacao() {
    const token = verificarLogin();
    if (!token) return;

    preencherEndereco();
    preencherInfoEmprestimo();

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

        alert("Pedido realizado com sucesso!");
        window.location.href = "carrinho.html";
      });
    }
  } catch {
    alert("Erro de conexão com o servidor");
  }
} 