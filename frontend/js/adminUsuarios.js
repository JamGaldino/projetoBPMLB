window.addEventListener("load", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado");
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!usuario || usuario.email !== "admin@biblioteca.com") {
        alert("Acesso negado!");
        window.location.href = "index.html";
        return;
    }

    const lista = document.getElementById("lista-usuarios");
    if (!lista) {
        alert("Não achei a div lista-usuarios no html");
        return;
    }

    async function carregarUsuarios() {
        try {
            const resp = await fetch("/admin/usuarios", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (resp.status === 401 || resp.status === 403) {
                alert("Sessão expirada! Faça login novamente");
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            }

            const usuarios = await resp.json();

            lista.innerHTML = "";

            if (usuarios.length === 0) {
                lista.innerHTML = `<p style="padding: 12px;">Nenhum usuário cadastrado.</p>`;
                return;
            }

            usuarios.forEach(u => {
                const linha = document.createElement("div");
                linha.className = "tabela-linha";

                linha.innerHTML = `
                    <div class="tabela-celula celula-id">${u.id ?? "-"}</div>
                    <div class="tabela-celula celula-nome">${u.nome ?? "-"}</div>
                    <div class="tabela-celula">${u.email ?? "-"}</div>
                    <div class="tabela-celula">${u.telefone ?? "-"}</div>
                    <div class="tabela-celula">${u.tipo ?? "Leitor"}</div>
                    <div class="tabela-celula">${u.status ?? "Ativo"}</div>
                    <div class="tabela-celula celula-acoes">
                        <button class="botao-acao botao-editar" data-id="${u.id}">Editar</button>
                        <button class="botao-acao botao-excluir" data-id="${u.id}">Excluir</button>
                    </div>
                `;

                lista.appendChild(linha);
            });

        } catch (e) {
            alert("Erro de conexão com o servidor");
        }
    }

    lista.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("botao-excluir")) return;

        const id = e.target.dataset.id;
        if (!id) return;

        const ok = confirm("Tem certeza que deseja excluir esse usuário?");
        if (!ok) return;

        try {
            const resp = await fetch(`/admin/usuarios/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (resp.status === 401 || resp.status === 403) {
                alert("Sessão expirada! Faça login novamente");
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            }

            if (resp.ok) {
                alert("Usuário excluído!");
                carregarUsuarios();
            } else {
                alert("Não consegui excluir esse usuário.");
            }
        } catch (e) {
            alert("Erro de conexão com o servidor");
        }
    });
    carregarUsuarios();
});