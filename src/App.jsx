import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importações Existentes
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Main } from './components/Main';
import ProdutosPage from './pages/ProdutosPage';
import ProdutoDetalhePage from './pages/ProdutoDetalhePage';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import CheckoutPage from './pages/CheckoutPage';

// Importando as páginas de pedidos e rastreio
import MeusPedidosPage from './pages/MeusPedidosPage';
import RastreioPage from './pages/RastreioPage'; 

// [NOVA IMPORTAÇÃO] Importando a página de carrinho
import CarrinhoPage from './pages/CarrinhoPage';

export default function App() {
  return (
    // O Router engloba tudo para que os hooks de navegação funcionem perfeitamente
    <Router>
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<><Header /><Menu /><Main /></>} />
          <Route path="/produtos" element={<><Header /><Menu /><ProdutosPage /></>} />
          
          {/* Rota de detalhes do produto dinâmico */}
          <Route path="/produto/:id" element={<><Header /><Menu /><ProdutoDetalhePage /></>} />
          
          {/* [NOVA ROTA] Adicionando a rota da página de carrinho */}
          <Route path="/carrinho" element={<><Header /><Menu /><CarrinhoPage /></>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/checkout" element={<><Header /><CheckoutPage /></>} />

          {/* Rotas de área do cliente e pós-venda */}
          <Route path="/meus-pedidos" element={<><Header /><MeusPedidosPage /></>} />
          <Route path="/rastreio" element={<><Header /><RastreioPage /></>} />
        </Routes>
      </div>
    </Router>
  );
}