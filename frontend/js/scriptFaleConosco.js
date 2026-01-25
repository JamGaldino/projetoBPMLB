window.addEventListener("load", carregarFaleConosco) // executa quando a página carregar

function carregarFaleConosco() {

    const botaoEnviar = document.querySelector(".botao-enviar")

    if (botaoEnviar) {
        botaoEnviar.addEventListener("click", enviarMensagem)
    }
}

function enviarMensagem() {

    const nome = document.getElementById("nome").value.trim()
    const email = document.getElementById("email").value.trim()
    const numero = document.getElementById("numero").value.trim()
    const mensagem = document.getElementById("mensagem").value.trim()

    if (!nome || !email || !mensagem) {
        alert("Por favor, preencha os campos obrigatórios.")
        return
    }

    alert("Mensagem enviada com sucesso!")

    // limpa os campos
    document.getElementById("nome").value = ""
    document.getElementById("email").value = ""
    document.getElementById("numero").value = ""
    document.getElementById("mensagem").value = ""
}
