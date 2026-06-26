import React, { useEffect } from 'react';
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
import PerfilPage from './pages/PerfilPage';

export default function App() {
  useEffect(() => {
    const sincronizarBanners = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/banners`);
        if (!res.ok) return;
        const lista = await res.json();

        const mainBanners = [null, null, null];
        const promoBanners = [null, null, null, null, null];

        lista.forEach((banner) => {
          try {
            const parsed = JSON.parse(banner.imgUrl);
            if (parsed.slot && parsed.value) {
              if (parsed.slot.startsWith("main")) {
                const idx = parseInt(parsed.slot.replace("main", ""), 10) - 1;
                if (idx >= 0 && idx < 3) {
                  mainBanners[idx] = parsed.value;
                }
              } else if (parsed.slot.startsWith("p")) {
                const idx = parseInt(parsed.slot.replace("p", ""), 10) - 1;
                if (idx >= 0 && idx < 5) {
                  promoBanners[idx] = parsed.value;
                }
              }
            }
          } catch (e) {
            // Ignora links simples
          }
        });

        try {
          localStorage.setItem('banners_principais', JSON.stringify(mainBanners));
          localStorage.setItem('banners_promocionais', JSON.stringify(promoBanners));
        } catch (storageErr) {
          console.warn("⚠️ Não foi possível salvar banners no localStorage (cota excedida):", storageErr);
        }

        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error("Erro ao carregar banners da API:", e);
      }
    };
    sincronizarBanners();
  }, []);
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
          <Route path="/perfil" element={<><Header /><PerfilPage /></>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}