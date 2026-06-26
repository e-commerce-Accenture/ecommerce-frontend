import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, PlusCircle, Image, ArrowLeft, X, Save, Trash2, Upload, ShoppingBag, Sparkles, Pencil, Minus, Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { getCategories } from '../services/categoryService';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getToken } from '../services/tokenService';
import { getBanners } from '../services/bannerService';



export default function AdminPage() {
    const navigate = useNavigate();

    const [produtos, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]);
    const [bannersPrincipais, setBannersPrincipais] = useState([]);
    const [bannersPromo, setBannersPromo] = useState([]);

    const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
    const [modalBannersAberto, setModalBannersAberto] = useState(false);
    const [bannersSaving, setBannersSaving] = useState(false);
    const [produtoParaRemover, setProdutoParaRemover] = useState(null);

    const [novoProd, setNovoProd] = useState({
        nome: '',
        marca: '',
        precoAtual: '',
        precoOriginal: '',
        categoriaId: '',
        descricao: '',
        estoque: '',
        imagemBase64: ''
    });
    const [iaLoading, setIaLoading] = useState(false);
    const [iaError, setIaError] = useState('');

    const [categoriasApi, setCategoriasApi] = useState([]);
    const CATEGORIAS_FALLBACK = [
        { id: '361bb008-4f45-487a-b1f0-0598911ab267', label: 'SmartPhone (SmartPhone)' },
        { id: '70b56836-1866-4936-bb34-813a9685c54e', label: 'SmartWatch (Smartwatch)' },
        { id: 'Acessory', label: 'Acessory (Acessórios)' },
    ];

    const [produtoParaEditar, setProdutoParaEditar] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [iaEditLoading, setIaEditLoading] = useState(false);
    const [iaEditError, setIaEditError] = useState('');

    const [bannersInput, setBannersInput] = useState({ main1: '', main2: '', main3: '' });
    const [promosInput, setPromosInput] = useState({ p1: '', p2: '', p3: '', p4: '', p5: '' });
    useEffect(() => {
        const token = getToken();
        const role = localStorage.getItem('user_role');

        if (!token || role !== 'admin') {
            alert('Acesso negado. Apenas administradores podem acessar esta página.');
            navigate('/');
            return;
        }

        const carregarDados = () => {
            getProducts()
                .then(setProdutos)
                .catch(err => {
                    console.error("Erro ao carregar produtos da API:", err);
                });

            
            
            const vendasSalvas = JSON.parse(localStorage.getItem('historico_vendas') || 'null')
                || JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
            
            
            const vendasNormalizadas = vendasSalvas.map(v => ({
                id: v.id || v.idPedido,
                produto: v.produto || v.produtoNome || "Produto",
                qtd: v.qtd || v.quantidade || 1,
                total: v.total || 0,
                data: v.data || v.dataPedido || "-"
            }));

            setVendas(vendasNormalizadas);
            getBanners()
                .then(data => {
                    setBannersPrincipais(data.main || []);
                    setBannersPromo(data.promo || []);
                })
                .catch(err => {
                    console.error("Erro ao carregar banners no AdminPage:", err);
                });
        };

        carregarDados();
        window.addEventListener('storage', carregarDados);
        return () => window.removeEventListener('storage', carregarDados);
    }, [navigate]);

    
    useEffect(() => {
        getCategories()
            .then(data => setCategoriasApi(data))
            .catch(() => setCategoriasApi(CATEGORIAS_FALLBACK));
    }, []);

    const handleConverterImagem = (file, callback) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

    const removerUmaUnidade = async () => {
        if (!produtoParaRemover) return;
        try {
            const novoEstoque = Math.max(0, (produtoParaRemover.estoque || 0) - 1);
            await updateProduct(produtoParaRemover.id, { estoque: novoEstoque });
            const prods = await getProducts();
            setProdutos(prods);
        } catch (err) {
            alert("Erro ao remover unidade: " + err.message);
        } finally {
            setProdutoParaRemover(null);
        }
    };

    const removerProdutoCompleto = async () => {
        if (!produtoParaRemover) return;
        try {
            await deleteProduct(produtoParaRemover.id);
            const prods = await getProducts();
            setProdutos(prods);
        } catch (err) {
            alert("Erro ao excluir produto: " + err.message);
        } finally {
            setProdutoParaRemover(null);
        }
    };

    const handleGerarDescricaoIA = async () => {
        if (!novoProd.nome || !novoProd.marca) {
            setIaError('Preencha o Nome do Produto e a Marca antes de gerar.');
            setTimeout(() => setIaError(''), 3500);
            return;
        }
        setIaLoading(true);
        setIaError('');
        try {
            const token = getToken();
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await fetch(`${API_URL}/ai/description`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ nome: novoProd.nome, marca: novoProd.marca })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Erro ao gerar descrição');
            setNovoProd(prev => ({ ...prev, descricao: data.text || '' }));
        } catch (err) {
            setIaError(err.message || 'Erro ao conectar com a IA.');
        } finally {
            setIaLoading(false);
        }
    };

    const abrirModalEditar = (produto) => {
        setProdutoParaEditar(produto);
        
        const specs = produto.especificacoes
            ? Object.entries(produto.especificacoes).map(([chave, valor]) => ({ chave, valor }))
            : [];
        setEditForm({
            nome: produto.nome || '',
            marca: produto.marca || '',
            precoAtual: produto.precoAtual || '',
            precoOriginal: produto.precoOriginal || '',
            categoriaId: produto.categoriaId || produto.categoria || '',
            descricao: produto.descricao || '',
            estoque: produto.estoque || '',
            imagemBase64: produto.imagem || '',
            especificacoes: specs
        });
        setIaEditError('');
    };

    const handleGerarDescricaoIAEdit = async () => {
        if (!editForm.nome || !editForm.marca) {
            setIaEditError('Preencha o Nome e a Marca antes de gerar.');
            setTimeout(() => setIaEditError(''), 3500);
            return;
        }
        setIaEditLoading(true);
        setIaEditError('');
        try {
            const token = getToken();
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await fetch(`${API_URL}/ai/description`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ nome: editForm.nome, marca: editForm.marca })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Erro ao gerar descrição');
            setEditForm(prev => ({ ...prev, descricao: data.text || '' }));
        } catch (err) {
            setIaEditError(err.message || 'Erro ao conectar com a IA.');
        } finally {
            setIaEditLoading(false);
        }
    };

    const handleSalvarEdicao = async (e) => {
        e.preventDefault();
        const precoA = Number(editForm.precoAtual);
        const precoO = Number(editForm.precoOriginal || precoA);
        const desc = precoO > 0 ? Math.round(((precoO - precoA) / precoO) * 100) : 0;
        
        const especificacoesObj = editForm.especificacoes
            ? editForm.especificacoes.reduce((acc, { chave, valor }) => {
                if (chave.trim()) acc[chave.trim()] = valor;
                return acc;
              }, {})
            : {};
        
        const catSel = categoriasApi.find(c => c.id === editForm.categoriaId);
        const updatedData = {
            nome: editForm.nome,
            marca: editForm.marca,
            precoAtual: precoA,
            precoOriginal: precoO,
            desconto: desc,
            categoriaId: editForm.categoriaId,
            categoria: catSel?.label ?? editForm.categoriaId,
            estoque: Number(editForm.estoque) || 0,
            descricao: editForm.descricao || 'Sem descrição informada.',
            imagem: editForm.imagemBase64,
            especificacoes: especificacoesObj
        };

        try {
            await updateProduct(produtoParaEditar.id, updatedData);
            const prods = await getProducts();
            setProdutos(prods);
            setProdutoParaEditar(null);
            setEditForm(null);
        } catch (err) {
            alert("Erro ao salvar edição do produto: " + err.message);
        }
    };

    const handleCriarProduto = async (e) => {
        e.preventDefault();
        const precoA = Number(novoProd.precoAtual);
        const precoO = Number(novoProd.precoOriginal || precoA);
        const desc = precoO > 0 ? Math.round(((precoO - precoA) / precoO) * 100) : 0;

        const catSel = categoriasApi.find(c => c.id === novoProd.categoriaId);
        const prodData = {
            nome: novoProd.nome,
            marca: novoProd.marca || "Smartly",
            precoAtual: precoA,
            precoOriginal: precoO,
            desconto: desc,
            categoriaId: novoProd.categoriaId,
            categoria: catSel?.label ?? novoProd.categoriaId,
            estoque: Number(novoProd.estoque) || 0,
            descricao: novoProd.descricao || "Sem descrição informada.",
            imagem: novoProd.imagemBase64 || "",
            especificacoes: { Marca: novoProd.marca || "Smartly" }
        };

        try {
            await createProduct(prodData);
            const prods = await getProducts();
            setProdutos(prods);
            setNovoProd({ nome: '', marca: '', precoAtual: '', precoOriginal: '', categoriaId: '', descricao: '', estoque: '', imagemBase64: '' });
            setModalProdutoAberto(false);
        } catch (err) {
            alert("Erro ao criar produto: " + err.message);
        }
    };

    const abrirModalBanners = () => {
        setBannersInput({
            main1: bannersPrincipais[0] || '',
            main2: bannersPrincipais[1] || '',
            main3: bannersPrincipais[2] || '',
        });
        setPromosInput({
            p1: bannersPromo[0] || '',
            p2: bannersPromo[1] || '',
            p3: bannersPromo[2] || '',
            p4: bannersPromo[3] || '',
            p5: bannersPromo[4] || '',
        });
        setModalBannersAberto(true);
    };

    const handleSalvarBanners = async (e) => {
        e.preventDefault();
        setBannersSaving(true);
        try {
            const token = getToken();
            const API_URL = import.meta.env.VITE_API_URL;

            
            const getRes = await fetch(`${API_URL}/banners`);
            if (!getRes.ok) throw new Error("Não foi possível carregar os banners existentes.");
            const listaExistente = await getRes.json();

            
            const bannersParaDeletar = listaExistente.filter(banner => {
                try {
                    const parsed = JSON.parse(banner.imgUrl);
                    return parsed.slot && parsed.value;
                } catch (e) {
                    return false;
                }
            });

            
            for (const banner of bannersParaDeletar) {
                await fetch(`${API_URL}/banners/${banner.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            
            const salvosMain = [];
            const salvosPromo = [];

            
            for (let num = 1; num <= 3; num++) {
                const val = bannersInput[`main${num}`];
                if (val) {
                    salvosMain.push(val);
                    const payload = { slot: `main${num}`, value: val };
                    await fetch(`${API_URL}/banners`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ imgUrl: JSON.stringify(payload) })
                    });
                }
            }

            
            for (let num = 1; num <= 5; num++) {
                const val = promosInput[`p${num}`];
                if (val) {
                    salvosPromo.push({ id: num, imagem: val });
                    const payload = { slot: `p${num}`, value: val };
                    await fetch(`${API_URL}/banners`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ imgUrl: JSON.stringify(payload) })
                    });
                }
            }

            
            const localStorageMain = [
                bannersInput.main1 || null,
                bannersInput.main2 || null,
                bannersInput.main3 || null,
            ];
            const localStoragePromo = [
                promosInput.p1 || null,
                promosInput.p2 || null,
                promosInput.p3 || null,
                promosInput.p4 || null,
                promosInput.p5 || null,
            ];
            try {
                localStorage.setItem('banners_principais', JSON.stringify(localStorageMain));
                localStorage.setItem('banners_promocionais', JSON.stringify(localStoragePromo));
            } catch (storageErr) {
                console.warn("⚠️ Não foi possível persistir no localStorage (cota excedida):", storageErr);
            }

            
            setBannersPrincipais(localStorageMain);
            setBannersPromo(localStoragePromo);

            
            window.dispatchEvent(new Event('storage'));
            setModalBannersAberto(false);
            alert('Campanhas visuais atualizadas com sucesso na API!');
        } catch (err) {
            alert('Erro ao atualizar banners: ' + err.message);
        } finally {
            setBannersSaving(false);
        }
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
                        <button onClick={abrirModalBanners} className="bg-gray-950 hover:bg-black text-white font-medium text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors flex-1 md:flex-initial">
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
                            <span className="text-2xl font-bold text-gray-900">{vendas.reduce((acc, v) => acc + (v.total || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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
                                            <span className="block text-[11px] font-bold text-gray-900 mt-1">{p.precoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => abrirModalEditar(p)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors" title="Editar produto">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => setProdutoParaRemover(p)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors" title="Remover produto">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
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
                                                <span className="text-xs font-extrabold text-green-600">{(v.total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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

            
            {produtoParaEditar && editForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col text-left">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h2 className="font-black text-gray-900 text-base">Editar Produto</h2>
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{produtoParaEditar.nome}</p>
                            </div>
                            <button onClick={() => { setProdutoParaEditar(null); setEditForm(null); }} className="p-1 hover:bg-gray-200 rounded-full text-gray-400"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSalvarEdicao} className="p-6 overflow-y-auto space-y-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Produto *</label>
                                    <input type="text" required value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Marca *</label>
                                    <input type="text" required value={editForm.marca} onChange={e => setEditForm({...editForm, marca: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Preço Atual (R$) *</label>
                                    <input type="number" required value={editForm.precoAtual} onChange={e => setEditForm({...editForm, precoAtual: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Preço Original (R$)</label>
                                    <input type="number" value={editForm.precoOriginal} onChange={e => setEditForm({...editForm, precoOriginal: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Estoque *</label>
                                    <input type="number" required value={editForm.estoque} onChange={e => setEditForm({...editForm, estoque: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria *</label>
                                <select required value={editForm.categoriaId} onChange={e => setEditForm({...editForm, categoriaId: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white outline-none">
                                    <option value="">Selecione uma categoria</option>
                                    {categoriasApi.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Foto do Produto</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        {editForm.imagemBase64 && (
                                            <img src={editForm.imagemBase64} alt="" className="w-12 h-12 object-contain rounded-xl border p-1 bg-gray-50" />
                                        )}
                                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-500 px-4 py-2.5 rounded-xl cursor-pointer bg-gray-50 text-xs font-bold text-gray-600 flex-1">
                                            <Upload size={14} />
                                            <span>Trocar Foto</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleConverterImagem(e.target.files[0], base64 => setEditForm({...editForm, imagemBase64: base64}))} />
                                        </label>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={editForm.imagemBase64} 
                                        onChange={e => setEditForm({...editForm, imagemBase64: e.target.value})} 
                                        placeholder="Ou cole a URL da imagem / Base64 aqui..." 
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-gray-700">Descrição</label>
                                    <button
                                        type="button"
                                        onClick={handleGerarDescricaoIAEdit}
                                        disabled={iaEditLoading}
                                        className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {iaEditLoading ? (
                                            <><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Gerando...</>
                                        ) : (
                                            <><Sparkles size={11} /> Gerar com IA</>
                                        )}
                                    </button>
                                </div>
                                {iaEditError && <p className="text-[10px] text-red-500 font-medium mb-1">{iaEditError}</p>}
                                <textarea rows={3} value={editForm.descricao} onChange={e => setEditForm({...editForm, descricao: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs resize-none outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-gray-700">Especificações Técnicas</label>
                                    <button
                                        type="button"
                                        onClick={() => setEditForm(prev => ({ ...prev, especificacoes: [...(prev.especificacoes || []), { chave: '', valor: '' }] }))}
                                        className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                    >
                                        <Plus size={11} /> Adicionar linha
                                    </button>
                                </div>
                                {editForm.especificacoes && editForm.especificacoes.length > 0 ? (
                                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                        {editForm.especificacoes.map((spec, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={spec.chave}
                                                    onChange={e => {
                                                        const updated = [...editForm.especificacoes];
                                                        updated[idx] = { ...updated[idx], chave: e.target.value };
                                                        setEditForm(prev => ({ ...prev, especificacoes: updated }));
                                                    }}
                                                    placeholder="Ex: Memória RAM"
                                                    className="w-2/5 border border-gray-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                                />
                                                <input
                                                    type="text"
                                                    value={spec.valor}
                                                    onChange={e => {
                                                        const updated = [...editForm.especificacoes];
                                                        updated[idx] = { ...updated[idx], valor: e.target.value };
                                                        setEditForm(prev => ({ ...prev, especificacoes: updated }));
                                                    }}
                                                    placeholder="Ex: 12 GB"
                                                    className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditForm(prev => ({ ...prev, especificacoes: prev.especificacoes.filter((_, i) => i !== idx) }))}
                                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-gray-400 italic py-2">Nenhuma especificação adicionada. Clique em "Adicionar linha" para começar.</p>
                                )}
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                                <button type="button" onClick={() => { setProdutoParaEditar(null); setEditForm(null); }} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Save size={14} /> Salvar Altera&#231;&#245;es</button>
                            </div>
                        </form>
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
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Preço Atual (R$) *</label>
                                    <input type="number" required value={novoProd.precoAtual} onChange={e => setNovoProd({...novoProd, precoAtual: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Preço Original (R$)</label>
                                    <input type="number" value={novoProd.precoOriginal} onChange={e => setNovoProd({...novoProd, precoOriginal: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Estoque Inicial *</label>
                                    <input type="number" required value={novoProd.estoque} onChange={e => setNovoProd({...novoProd, estoque: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria *</label>
                                <select required value={novoProd.categoriaId} onChange={e => setNovoProd({...novoProd, categoriaId: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white outline-none">
                                    <option value="">Selecione uma categoria</option>
                                    {categoriasApi.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Foto do Produto *</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        {novoProd.imagemBase64 && (
                                            <img src={novoProd.imagemBase64} alt="" className="w-12 h-12 object-contain rounded-xl border p-1 bg-gray-50" />
                                        )}
                                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-indigo-500 px-4 py-3 rounded-xl cursor-pointer bg-gray-50 text-xs font-bold text-gray-600 flex-1">
                                            <Upload size={16} />
                                            <span>{novoProd.imagemBase64 ? "Imagem Carregada ✓" : "Carregar Foto do Computador"}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleConverterImagem(e.target.files[0], base64 => setNovoProd({...novoProd, imagemBase64: base64}))} />
                                        </label>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={novoProd.imagemBase64} 
                                        onChange={e => setNovoProd({...novoProd, imagemBase64: e.target.value})} 
                                        placeholder="Ou cole a URL da imagem / Base64 aqui..." 
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-gray-700">Descrição</label>
                                    <button
                                        type="button"
                                        onClick={handleGerarDescricaoIA}
                                        disabled={iaLoading}
                                        className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {iaLoading ? (
                                            <>
                                                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                                Gerando...
                                            </>
                                        ) : (
                                            <><Sparkles size={11} /> Gerar com IA</>
                                        )}
                                    </button>
                                </div>
                                {iaError && (
                                    <p className="text-[10px] text-red-500 font-medium mb-1">{iaError}</p>
                                )}
                                <textarea rows={3} value={novoProd.descricao} onChange={e => setNovoProd({...novoProd, descricao: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs resize-none outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ou clique em 'Gerar com IA' acima para preencher automaticamente..." />
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
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col text-left">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="font-black text-gray-900 text-base">Atualizar Campanhas Visuais (Banners)</h2>
                            <button onClick={() => !bannersSaving && setModalBannersAberto(false)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400" disabled={bannersSaving}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSalvarBanners} className="p-6 overflow-y-auto space-y-6 text-left">
                            <div>
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">1. Banners Principais do Carrossel (Recomendado 3 slides)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((num) => (
                                        <div key={num} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700">Slide {num}</span>
                                                {bannersInput[`main${num}`] && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setBannersInput({...bannersInput, [`main${num}`]: ''})}
                                                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer transition-colors"
                                                        title="Remover banner"
                                                        disabled={bannersSaving}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center justify-center gap-1.5 border border-gray-300 hover:border-gray-900 px-2 py-1.5 rounded-xl cursor-pointer bg-white text-[11px] font-bold text-gray-600 flex-1">
                                                    <Upload size={12} />
                                                    <span className="truncate">Upload</span>
                                                    <input type="file" accept="image/*" className="hidden" disabled={bannersSaving} onChange={e => handleConverterImagem(e.target.files[0], (base64) => setBannersInput({...bannersInput, [`main${num}`]: base64}))} />
                                                </label>
                                                {bannersInput[`main${num}`] && (
                                                    <img src={bannersInput[`main${num}`]} className="w-12 h-8 object-cover rounded border bg-white animate-fade-in" alt="" />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={bannersInput[`main${num}`]}
                                                onChange={e => setBannersInput({...bannersInput, [`main${num}`]: e.target.value})}
                                                placeholder="Cole a URL da Imagem..."
                                                className="w-full border border-gray-300 rounded-xl px-2.5 py-1.5 text-[11px] bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                                                disabled={bannersSaving}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">2. Marcas e Ofertas Promocionais (Section 3 - 5 Banners)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <div key={num} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700">Promo {num}</span>
                                                {promosInput[`p${num}`] && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPromosInput({...promosInput, [`p${num}`]: ''})}
                                                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer transition-colors"
                                                        title="Remover banner"
                                                        disabled={bannersSaving}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center justify-center gap-1.5 border border-gray-300 hover:border-gray-900 px-2 py-1.5 rounded-xl cursor-pointer bg-white text-[11px] font-bold text-gray-600 flex-1">
                                                    <Upload size={12} />
                                                    <span className="truncate">Upload</span>
                                                    <input type="file" accept="image/*" className="hidden" disabled={bannersSaving} onChange={e => handleConverterImagem(e.target.files[0], (base64) => setPromosInput({...promosInput, [`p${num}`]: base64}))} />
                                                </label>
                                                {promosInput[`p${num}`] && (
                                                    <img src={promosInput[`p${num}`]} className="w-12 h-8 object-cover rounded border bg-white animate-fade-in" alt="" />
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={promosInput[`p${num}`]}
                                                onChange={e => setPromosInput({...promosInput, [`p${num}`]: e.target.value})}
                                                placeholder="Cole a URL da Imagem..."
                                                className="w-full border border-gray-300 rounded-xl px-2.5 py-1.5 text-[11px] bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                                                disabled={bannersSaving}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100 flex justify-end gap-2">
                                <button type="button" onClick={() => setModalBannersAberto(false)} disabled={bannersSaving} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200">Cancelar</button>
                                <button type="submit" disabled={bannersSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {bannersSaving ? 'Salvando...' : <><Save size={14} /> Atualizar Campanhas</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}