(() => {
    document.addEventListener("DOMContentLoaded", async () => {
        await carregarHeader()

        ativarMenu()
        await carregarLivrosHeader()
        ativarBusca()
    })

    let livrosHeader = []

    async function carregarHeader() {
        const res = await fetch("/header.html")
        document.getElementById("header").innerHTML = await res.text()

        ativarMenuAdmin();
    }

    function ativarMenuAdmin() {
        const usuarioStr = localStorage.getItem("usuarioLogado");
        if (!usuarioStr) return;

        const usuario = JSON.parse(usuarioStr);

        if (usuario.email === "admin@biblioteca.com") {
            const linkUsuarios = document.getElementById("link-admin-usuarios");
            const linkPedidos = document.getElementById("link-admin-pedidos");

            if (linkUsuarios) linkUsuarios.style.display = "block";
            if (linkPedidos) linkPedidos.style.display = "block";
        }
    }

    async function carregarLivrosHeader() {
        const res = await fetch("/livros/tela-inicial")
        livrosHeader = await res.json()
    }

    function ativarMenu() {
        const btn = document.querySelector(".btn-menu")
        const menu = document.querySelector(".menu-mobile")
        if (!btn || !menu) return

        btn.onclick = () => menu.classList.toggle("ativo")
    }

    function ativarBusca() {
        const input = document.getElementById("campo-busca")
        const resultado = document.getElementById("resultado-busca")
        if (!input || !resultado) return

        input.oninput = () => {
            const termo = input.value.toLowerCase().trim()
            resultado.innerHTML = ""

            if (!termo) {
                resultado.style.display = "none"
                return
            }

            livrosHeader
                .filter(livro => livro.titulo.toLowerCase().includes(termo) )
                .forEach(livro => {
                    resultado.innerHTML += `
                        <a href="informacao.html?titulo=${encodeURIComponent(livro.titulo)}">
                            ${livro.titulo}
                        </a>
                    `
                })

            resultado.style.display = "flex"
        }
    }
})()
