import { Router } from "express";
import { 
    listarLivros, 
    detalhesLivro,
    importarLivros,
    listarLivrosTelaInicial,
    explorar
} from "../controller/controllerLivros.js";   
const router = Router();

router.get("/", listarLivros); 
// Lista todos os livros do banco

router.get("/detalhes", detalhesLivro); 
// Retorna os detalhes de um livro específico (por título)

router.post("/importar-livros", importarLivros); 
// Importa livros para o banco de dados

router.get("/tela-inicial", listarLivrosTelaInicial); 
// Retorna livros de destaque e lançamentos da tela inicial

router.get("/explorar", explorar); 
// Lista livros da página Explorar (com ou sem filtro por gênero)




export default router;