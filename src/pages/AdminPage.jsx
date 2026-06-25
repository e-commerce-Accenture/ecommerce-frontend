import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, PlusCircle, Image, ArrowLeft, X, Save, Trash2, Upload, ShoppingBag } from 'lucide-react';
import { Header } from '../components/Header';

import ImgGalaxyS22 from "../assets/produtos/image-1.png"; 
import ImgGalaxyM13 from "../assets/produtos/image-2.png";
import ImgIphone14 from "../assets/produtos/image-3.png";   
import ImgAppleWatch from "../assets/produtos/image-4.png";  
import ImgGalaxyWatch from "../assets/produtos/image-5.png"; 

export default function AdminPage() {
    const navigate = useNavigate();

    const [produtos, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]);
    const [bannersPrincipais, setBannersPrincipais] = useState([]);
    const [bannersPromo, setBannersPromo] = useState([]);

    const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
    const [modalBannersAberto, setModalBannersAberto] = useState(false);
    const [produtoParaRemover, setProdutoParaRemover] = useState(null);

    const [novoProd, setNovoProd] = useState({
        nome: '',
        marca: '',
        precoAtual: '',
        precoOriginal: '',
        categoria: 'Samsung',
        descricao: '',
        estoque: '',
        imagemBase64: ''
    });

    const [bannersInput, setBannersInput] = useState({ main1: '', main2: '', main3: '' });
    const [promosInput, setPromosInput] = useState({ p1: '', p2: '', p3: '', p4: '', p5: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('user_role');

        if (!token || role !== 'admin') {
            alert('Acesso negado. Apenas administradores podem acessar esta página.');
            navigate('/');
            return;
        }

        if (!localStorage.getItem('banco_produtos')) {
            const produtosIniciais = [
                { id: 1, nome: "Galaxy S22 Ultra", marca: "Samsung", precoAtual: 32999, precoOriginal: 74999, desconto: 56, categoria: "Samsung", estoque: 15, descricao: "Explore novas possibilidades com o Galaxy S22 Ultra...", imagem: ImgGalaxyS22 },
                { id: 2, nome: "Galaxy M13 4GB|64GB", marca: "Samsung", precoAtual: 10499, precoOriginal: 14999, desconto: 56, categoria: "Samsung", estoque: 8, descricao: "O Galaxy M13 combina estilo contemporâneo...", imagem: ImgGalaxyM13 },
                { id: 3, nome: "iPhone 14 Pro Max", marca: "Apple", precoAtual: 69999, precoOriginal: 89999, desconto: 21, categoria: "Apple", estoque: 23, descricao: "iPhone 14 Pro Max. Capture detalhes...", imagem: ImgIphone14 },
                { id: 4, nome: "Apple Watch Series 8", marca: "Apple", precoAtual: 24999, precoOriginal: 39999, desconto: 37, categoria: "Apple Watch", estoque: 4, descricao: "O Apple Watch Series ajuda você...", imagem: ImgAppleWatch },
                { id: 5, nome: "Galaxy Watch 5 Pro", marca: "Samsung", precoAtual: 19999, precoOriginal: 34999, desconto: 42, categoria: "Samsung Watch", estoque: 12, descricao: "Monitore sua saúde de dia e de noite...", imagem: ImgGalaxyWatch }
            ];
            localStorage.setItem('banco_produtos', JSON.stringify(produtosIniciais));
        }

        const carregarDados = () => {
            setProdutos(JSON.parse(localStorage.getItem('banco_produtos')) || []);

            // Lê historico_vendas (salvo pelo CheckoutPage corrigido)
            // Fallback para historico_pedidos caso historico_vendas ainda não exista
            const vendasSalvas = JSON.parse(localStorage.getItem('historico_vendas') || 'null')
                || JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
            
            // Normaliza o formato para garantir que os campos necessários existam
            const vendasNormalizadas = vendasSalvas.map(v => ({
                id: v.id || v.idPedido,
                produto: v.produto || v.produtoNome || "Produto",
                qtd: v.qtd || v.quantidade || 1,
                total: v.total || 0,
                data: v.data || v.dataPedido || "-"
            }));

            setVendas(vendasNormalizadas);
            setBannersPrincipais(JSON.parse(localStorage.getItem('banners_principais')) || []);
            setBannersPromo(JSON.parse(localStorage.getItem('banners_promocionais')) || []);
        };

        carregarDados();
        window.addEventListener('storage', carregarDados);
        return () => window.removeEventListener('storage', carregarDados);
    }, [navigate]);

    const handleConverterImagem = (file, callback) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

    const removerUmaUnidade = () => {
        if (!produtoParaRemover) return;
        const listaAtual = JSON.parse(localStorage.getItem('banco_produtos')) || [];
        const novaLista = listaAtual.map(p => {
            if (p.id === produtoParaRemover.id) {
                return { ...p, estoque: Math.max(0, p.estoque - 1) };
            }
            return p;
        });
        localStorage.setItem('banco_produtos', JSON.stringify(novaLista));
        setProdutos(novaLista);
        window.dispatchEvent(new Event('storage'));
        setProdutoParaRemover(null);
    };

    const removerProdutoCompleto = () => {
        if (!produtoParaRemover) return;
        const listaAtual = JSON.parse(localStorage.getItem('banco_produtos')) || [];
        const novaLista = listaAtual.filter(p => p.id !== produtoParaRemover.id);
        localStorage.setItem('banco_produtos', JSON.stringify(novaLista));
        setProdutos(novaLista);
        window.dispatchEvent(new Event('storage'));
        setProdutoParaRemover(null);
    };

    const handleCriarProduto = (e) => {
        e.preventDefault();
        const listaAtual = JSON.parse(localStorage.getItem('banco_produtos')) || [];
        const precoA = Number(novoProd.precoAtual);
        const precoO = Number(novoProd.precoOriginal || precoA);
        const desc = precoO > 0 ? Math.round(((precoO - precoA) / precoO) * 100) : 0;

        const novoItem = {
            id: Date.now(),
            nome: novoProd.nome,
            marca: novoProd.marca || "Smartly",
            precoAtual: precoA,
            precoOriginal: precoO,
            desconto: desc,
            categoria: novoProd.categoria,
            estoque: Number(novoProd.estoque) || 0,
            descricao: novoProd.descricao || "Sem descrição informada.",
            imagem: novoProd.imagemBase64 || ImgGalaxyS22,
            especificacoes: { Marca: novoProd.marca || "Smartly", Categoria: novoProd.categoria }
        };

        const novaLista = [...listaAtual, novoItem];
        localStorage.setItem('banco_produtos', JSON.stringify(novaLista));
        setProdutos(novaLista);
        window.dispatchEvent(new Event('storage'));

        setNovoProd({ nome: '', marca: '', precoAtual: '', precoOriginal: '', categoria: 'Samsung', descricao: '', estoque: '', imagemBase64: '' });
        setModalProdutoAberto(false);
    };

    const handleSalvarBanners = (e) => {
        e.preventDefault();
        const ativosMain = [];
        if (bannersInput.main1) ativosMain.push(bannersInput.main1);
        if (bannersInput.main2) ativosMain.push(bannersInput.main2);
        if (bannersInput.main3) ativosMain.push(bannersInput.main3);
        if (ativosMain.length > 0) localStorage.setItem('banners_principais', JSON.stringify(ativosMain));

        const ativosPromo = [];
        if (promosInput.p1) ativosPromo.push({ id: 1, imagem: promosInput.p1 });
        if (promosInput.p2) ativosPromo.push({ id: 2, imagem: promosInput.p2 });
        if (promosInput.p3) ativosPromo.push({ id: 3, imagem: promosInput.p3 });
        if (promosInput.p4) ativosPromo.push({ id: 4, imagem: promosInput.p4 });
        if (promosInput.p5) ativosPromo.push({ id: 5, imagem: promosInput.p5 });
        if (ativosPromo.length > 0) localStorage.setItem('banners_promocionais', JSON.stringify(ativosPromo));

        window.dispatchEvent(new Event('storage'));
        setModalBannersAberto(false);
        alert('Campanhas visuais atualizadas com sucesso!');
    };

    const estoquePorCategoria = produtos.reduce((acc, p) => {
        const cat = p.categoria || "Geral";
        acc[cat] = (acc[cat] || 0) + (Number(p.estoque) || 0);
        return acc;
    }, {});

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
                    <div className="text-left">
                        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold mb-1 hover:underline">
                            <ArrowLeft size={14} /> Voltar para o Site
                        </button>
                        <h1 className="text-2xl font-black text-gray-900">Painel de Administração Gerencial</h1>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button onClick={() => setModalProdutoAberto(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors flex-1 md:flex-initial">
                            <PlusCircle size={16} /> Novo Produto
                        </button>
                        <button onClick={() => setModalBannersAberto(true)} className="bg-gray-950 hover:bg-black text-white font-medium text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors flex-1 md:flex-initial">
                            <Image size={16} /> Trocar Banners
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Package size={24} /></div>
                        <div>
                            <span className="text-xs text-gray-400 font-medium block">Total de Modelos em Linha</span>
                            <span className="text-2xl font-bold text-gray-900">{produtos.length} produtos</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600"><DollarSign size={24} /></div>
                        <div>
                            <span className="text-xs text-gray-400 font-medium block">Faturamento Acumulado</span>
                            <span className="text-2xl font-bold text-gray-900">${vendas.reduce((acc, v) => acc + (v.total || 0), 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/70 text-left">
                            <h3 className="font-bold text-sm text-gray-900">Níveis de Estoque por Produto</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
                            {produtos.map(p => (
                                <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0 text-left">
                                        <div className="w-10 h-12 bg-gray-50 rounded border p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                            {p.imagem && <img src={p.imagem} alt="" className="max-h-full max-w-full object-contain" />}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-gray-900 truncate">{p.nome}</h4>
                                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium inline-block mt-0.5">{p.categoria}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-lg inline-block ${p.estoque === 0 ? 'bg-red-50 text-red-600 border border-red-100' : p.estoque <= 5 ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-800'}`}>
                                                {p.estoque === 0 ? 'Sem estoque' : `${p.estoque} un`}
                                            </span>
                                            <span className="block text-[11px] font-bold text-gray-900 mt-1">${p.precoAtual.toLocaleString()}</span>
                                        </div>
                                        <button onClick={() => setProdutoParaRemover(p)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                            <h3 className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-100 pb-2">Estoque por Categoria</h3>
                            <div className="flex flex-col gap-3">
                                {Object.entries(estoquePorCategoria).map(([categoria, qtd]) => (
                                    <div key={categoria} className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-gray-500">{categoria}</span>
                                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-md">{qtd} un</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                            <h3 className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <ShoppingBag size={16} className="text-indigo-600" /> Últimas Vendas Realizadas
                            </h3>
                            <div className="flex flex-col divide-y divide-gray-100 max-h-[250px] overflow-y-auto pr-1">
                                {vendas.length === 0 ? (
                                    <p className="text-xs text-gray-400 py-4 text-center">Nenhuma venda registrada ainda.</p>
                                ) : (
                                    vendas.map((v, idx) => (
                                        <div key={v.id || idx} className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{v.produto}</span>
                                                <span className="text-xs font-extrabold text-green-600">${(v.total || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>Qtd: <strong className="text-gray-600">{v.qtd} un</strong></span>
                                                <span>{v.data}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {produtoParaRemover && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm text-center">
                        <h3 className="font-black text-gray-900 text-base mb-2">Gerenciar Estoque do Produto</h3>
                        <p className="text-xs text-gray-500 mb-5">O que deseja fazer com <span className="font-bold text-gray-800">"{produtoParaRemover.nome}"</span>?</p>
                        <div className="flex flex-col gap-2.5">
                            <button onClick={removerUmaUnidade} className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs py-3 rounded-xl transition-colors">
                                Subtrair 1 Unidade do Estoque
                            </button>
                            <button onClick={removerProdutoCompleto} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition-colors">
                                Excluir Totalmente do Catálogo
                            </button>
                            <button onClick={() => setProdutoParaRemover(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs py-2.5 rounded-xl transition-colors mt-2">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalProdutoAberto && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col text-left">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="font-black text-gray-900 text-base">Adicionar Novo Produto em Catálogo</h2>
                            <button onClick={() => setModalProdutoAberto(false)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCriarProduto} className="p-6 overflow-y-auto space-y-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Produto *</label>
                                    <input type="text" required value={novoProd.nome} onChange={e => setNovoProd({...novoProd, nome: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: iPhone 15 Pro Max" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Marca *</label>
                                    <input type="text" required value={novoProd.marca} onChange={e => setNovoProd({...novoProd, marca: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Apple" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Preço Atual ($) *</label>
                                    <input type="number" required value={novoProd.precoAtual} onChange={e => setNovoProd({...novoProd, precoAtual: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Preço Original ($)</label>
                                    <input type="number" value={novoProd.precoOriginal} onChange={e => setNovoProd({...novoProd, precoOriginal: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Estoque Inicial *</label>
                                    <input type="number" required value={novoProd.estoque} onChange={e => setNovoProd({...novoProd, estoque: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria *</label>
                                <select value={novoProd.categoria} onChange={e => setNovoProd({...novoProd, categoria: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white outline-none">
                                    <option value="Samsung">Samsung</option>
                                    <option value="Apple">Apple</option>
                                    <option value="Apple Watch">Apple Watch</option>
                                    <option value="Samsung Watch">Samsung Watch</option>
                                    <option value="Acessórios">Acessórios</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Foto do Produto *</label>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-indigo-500 px-4 py-3 rounded-xl cursor-pointer bg-gray-50 text-xs font-bold text-gray-600 flex-1">
                                        <Upload size={16} />
                                        <span>{novoProd.imagemBase64 ? "Imagem Carregada ✓" : "Carregar Foto do Computador"}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={e => handleConverterImagem(e.target.files[0], base64 => setNovoProd({...novoProd, imagemBase64: base64}))} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Descrição</label>
                                <textarea rows={3} value={novoProd.descricao} onChange={e => setNovoProd({...novoProd, descricao: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs resize-none outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                                <button type="button" onClick={() => setModalProdutoAberto(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Save size={14} /> Cadastrar Produto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalBannersAberto && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col text-left">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="font-black text-gray-900 text-base">Atualizar Campanhas Visuais (Banners)</h2>
                            <button onClick={() => setModalBannersAberto(false)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSalvarBanners} className="p-6 overflow-y-auto space-y-6 text-left">
                            <div>
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">1. Banners Principais do Carrossel (Recomendado 3 slides)</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {[1, 2, 3].map((num) => (
                                        <div key={num} className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 border border-gray-300 hover:border-gray-900 px-3 py-2 rounded-xl cursor-pointer bg-gray-50 text-xs font-bold text-gray-600 flex-1">
                                                <Upload size={14} />
                                                <span className="truncate">{bannersInput[`main${num}`] ? `Slide ${num} Carregado ✓` : `Upload Imagem Carrossel Slide ${num}`}</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={e => handleConverterImagem(e.target.files[0], (base64) => setBannersInput({...bannersInput, [`main${num}`]: base64}))} />
                                            </label>
                                            {bannersInput[`main${num}`] && <img src={bannersInput[`main${num}`]} className="w-10 h-6 object-cover rounded border" alt="" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">2. Marcas e Ofertas Promocionais (Section 3 - 5 Banners)</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <div key={num} className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 border border-gray-300 hover:border-gray-900 px-3 py-2 rounded-xl cursor-pointer bg-gray-50 text-xs font-bold text-gray-600 flex-1">
                                                <Upload size={14} />
                                                <span className="text-gray-500 truncate">{promosInput[`p${num}`] ? `Promo ${num} Carregado ✓` : `Upload Imagem Promocional ${num}`}</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={e => handleConverterImagem(e.target.files[0], (base64) => setPromosInput({...promosInput, [`p${num}`]: base64}))} />
                                            </label>
                                            {promosInput[`p${num}`] && <img src={promosInput[`p${num}`]} className="w-10 h-6 object-cover rounded border" alt="" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                                <button type="button" onClick={() => setModalBannersAberto(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5"><Save size={14} /> Atualizar Campanhas</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}