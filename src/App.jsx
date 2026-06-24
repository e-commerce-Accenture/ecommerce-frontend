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

// [NOVAS IMPORTAÇÕES] Importando as páginas que faltavam
import MeusPedidosPage from './pages/MeusPedidosPage';
import RastreioPage from './pages/RastreioPage'; // Certifique-se de que o nome do arquivo/pasta bate com este

export default function App() {
  return (
    // O Router precisa estar aqui em cima para o useNavigate funcionar nos componentes abaixo
    <Router>
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<><Header /><Menu /><Main /></>} />
          <Route path="/produtos" element={<><Header /><Menu /><ProdutosPage /></>} />
          
          {/* A rota de detalhes agora está dentro do contexto do Router */}
          <Route path="/produto/:id" element={<><Header /><Menu /><ProdutoDetalhePage /></>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/checkout" element={<><Header /><CheckoutPage /></>} />

          {/* [NOVAS ROTAS] Adicionadas aqui para corrigir os erros de navegação */}
          <Route path="/meus-pedidos" element={<><Header /><MeusPedidosPage /></>} />
          <Route path="/rastreio" element={<><Header /><RastreioPage /></>} />
        </Routes>
      </div>
    </Router>
  );
}