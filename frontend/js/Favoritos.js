const token = localStorage.getItem("token");

async function carregarFavoritos() {
    const lista = document.getElementById("listaFavoritos");

    try {
        console.log("Carregando favoritos...");
        console.log("Token:", token ? " Existe" : " Não existe");

        if (!token) {
            lista.innerHTML = "<p>Você precisa estar autenticado para ver favoritos</p>";
            return;
        }

        const resposta = await fetch("/favoritos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("📡 Resposta do servidor:", resposta.status, resposta.statusText);

        if (!resposta.ok) {
            if (resposta.status === 401) {
                lista.innerHTML = "<p>Sessão expirada. Faça login novamente</p>";
                console.error(" Não autenticado (401)");
            } else {
                lista.innerHTML = "<p>Erro ao carregar favoritos - Status: " + resposta.status + "</p>";
                console.error(" Erro ao carregar favoritos:", resposta.status);
            }
            return;
        }

        const favoritos = await resposta.json();
        console.log(" Favoritos recebidos:", favoritos);

        if (!favoritos || favoritos.length === 0) {
            lista.innerHTML = "<p>Você ainda não tem nenhum livro favoritado</p>";
            console.log(" Nenhum favorito encontrado");
            return;
        }

        lista.innerHTML = ""; 

        favoritos.forEach(livro => {
            console.log("➕ Adicionando livro:", livro.titulo);
            const html = `
                <div class="LivroContaner">
                    <div class="Retangulo">
                        <img src="${livro.imagem}" alt="${livro.titulo}" class="Livro">
                        <div class="info">
                            <p>${livro.categoria || "Livro"}</p>
                            <p class="titulo-livro">${livro.titulo || ""}</p>
                            <img src="img/Star.png" class="estrela" alt="Favorito">
                            <p class="remover" data-id="${livro.id}">
                                Remover
                            </p>
                        </div>
                    </div>
                </div>
            `;
            lista.innerHTML += html;
        });

        adicionarEventosRemover();
        console.log(" Favoritos carregados com sucesso!");

    } catch (erro) {
        console.error(" Erro ao carregar favoritos:", erro);
        lista.innerHTML = "<p>Erro ao carregar favoritos. Tente novamente mais tarde</p>";
    }
}

function adicionarEventosRemover() {
    document.querySelectorAll(".remover").forEach(botao => {
        botao.addEventListener("click", (e) => {
            e.preventDefault();
            removerFavorito(botao.dataset.id);
        });
    });
}

async function removerFavorito(id) {
    try {
        if (!confirm("Deseja remover este livro dos favoritos?")) {
            return;
        }

        const resposta = await fetch(`/favoritos/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            alert("Erro ao remover favorito");
            console.error("Erro ao remover favorito:", resposta.status);
            return;
        }

        carregarFavoritos();
    } catch (erro) {
        console.error("Erro ao remover favorito:", erro);
        alert("Erro ao remover favorito. Tente novamente");
    }
}

// Carregar favoritos ao abrir a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarFavoritos);
} else {
    carregarFavoritos();
}
