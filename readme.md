# Resumo da Estrutura e Funcionamento do Projeto

O projeto foi desenvolvido seguindo o padrão **MVC (Model–View–Controller)**, que separa responsabilidades e organiza melhor o código.

## Model

O **Model** é responsável exclusivamente por acessar o banco de dados.  
Nele ficam as consultas SQL (SELECT, INSERT, etc.).

No projeto, o Model:
- busca os livros no banco de dados
- remove duplicações por título
- seleciona apenas os livros marcados como **destaques** ou **lançamentos**
- retorna os dados em formato JSON

O Model **não conhece rotas**, **requisições HTTP** ou **páginas HTML**
---

## Controller

O **Controller** faz a ligação entre as rotas e o Model.  
Ele recebe a requisição, chama a função correta do Model, trata possíveis erros e devolve a resposta para o cliente.

No projeto, o Controller é responsável por:
- listar todos os livros
- retornar os detalhes de um livro específico
- importar livros para o banco de dados
- fornecer os livros exibidos na tela inicial

O Controller **não acessa diretamente o banco de dados** e **não cria HTML**.
---
## Routes

As **Routes** definem os caminhos da aplicação (URLs).  
Elas apenas indicam qual Controller será executado quando uma rota for acessada.

Exemplos de rotas:
- `/livros` → lista os livros
- `/livros/detalhes` → retorna os detalhes de um livro
- `/livros/tela-inicial` → retorna livros de destaque e lançamentos

As rotas **não contêm lógica de negócio**.

---

## App (Servidor)

O arquivo principal do servidor:
- inicializa o Express
- configura middlewares
- conecta as rotas
- disponibiliza os arquivos estáticos do frontend (HTML, CSS e JavaScript)

---

## Funcionamento Geral

O fluxo do sistema acontece da seguinte forma:

1. O usuário abre a página no navegador  
2. O JavaScript faz uma requisição para a API  
3. A rota direciona a requisição para o Controller  
4. O Controller chama o Model  
5. O Model consulta o banco de dados  
6. Os dados retornam em formato JSON  
7. O JavaScript renderiza as informações na página
