window.addEventListener("load", () => {

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
});