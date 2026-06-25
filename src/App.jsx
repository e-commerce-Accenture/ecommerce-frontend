import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Main } from './components/Main';
import Footer from './components/Footer';
import ProdutosPage from './pages/ProdutosPage';
import ProdutoDetalhePage from './pages/ProdutoDetalhePage';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import MeusPedidosPage from './pages/MeusPedidosPage';
import RastreioPage from './pages/RastreioPage';
import CarrinhoPage from './pages/CarrinhoPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<><Header /><Menu /><Main /><Footer /></>} />
          <Route path="/produtos" element={<><Header /><Menu /><ProdutosPage /></>} />
          <Route path="/produto/:id" element={<><Header /><Menu /><ProdutoDetalhePage /></>} />
          <Route path="/carrinho" element={<><Header /><Menu /><CarrinhoPage /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/checkout" element={<><Header /><CheckoutPage /></>} />
          <Route path="/meus-pedidos" element={<><Header /><MeusPedidosPage /></>} />
          <Route path="/rastreio" element={<><Header /><RastreioPage /></>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}