import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { getCart, updateCartItem, removeCartItem, isLoggedIn } from "../services/cartService";
import { getProductById } from "../services/productService";

export default function CarrinhoPage() {
  const navigate = useNavigate();
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(null); 

  
  const carregarCarrinho = useCallback(async () => {
    setCarregando(true);
    try {
      const rawItems = await getCart();

      if (!isLoggedIn()) {
        
        setItensCarrinho(rawItems.map(i => ({
          cartItemId: i.cartItemId,
          id: i.productId,
          productId: i.productId,
          nome: i.nome || "Produto",
          precoAtual: Number(i.precoAtual) || 0,
          precoOriginal: Number(i.precoOriginal) || Number(i.precoAtual) || 0,
          imagem: i.imagem || "",
          quantidade: i.quantity || i.quantidade || 1,
        })));
        return;
      }

      
      const enriquecidos = await Promise.all(
        rawItems.map(async (item) => {
          try {
            const prod = await getProductById(item.productId);
            return {
              cartItemId: item.id,   
              id: item.productId,
              productId: item.productId,
              nome: prod.nome || "Produto",
              precoAtual: Number(prod.precoAtual) || 0,
              precoOriginal: Number(prod.precoOriginal) || Number(prod.precoAtual) || 0,
              imagem: prod.imagem || "",
              quantidade: item.quantity || 1,
            };
          } catch {
            return {
              cartItemId: item.id,
              id: item.productId,
              productId: item.productId,
              nome: "Produto indisponível",
              precoAtual: 0,
              precoOriginal: 0,
              imagem: "",
              quantidade: item.quantity || 1,
            };
          }
        })
      );
      setItensCarrinho(enriquecidos);
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarCarrinho();
    window.addEventListener("cartChange", carregarCarrinho);
    return () => window.removeEventListener("cartChange", carregarCarrinho);
  }, [carregarCarrinho]);

  
  const alterarQuantidade = async (item, tipo) => {
    const novaQtd = tipo === "somar" ? item.quantidade + 1 : Math.max(1, item.quantidade - 1);
    setAtualizando(item.cartItemId || item.id);
    try {
      const chave = item.cartItemId || item.id;
      await updateCartItem(chave, novaQtd);
      setItensCarrinho(prev =>
        prev.map(i =>
          (i.cartItemId || i.id) === chave ? { ...i, quantidade: novaQtd } : i
        )
      );
      window.dispatchEvent(new CustomEvent("cartChange"));
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
    } finally {
      setAtualizando(null);
    }
  };

  
  const removerItem = async (item) => {
    const chave = item.cartItemId || item.id;
    setAtualizando(chave);
    try {
      await removeCartItem(chave);
      setItensCarrinho(prev => prev.filter(i => (i.cartItemId || i.id) !== chave));
      window.dispatchEvent(new CustomEvent("cartChange"));
    } catch (err) {
      console.error("Erro ao remover item:", err);
    } finally {
      setAtualizando(null);
    }
  };

  
  const subtotalOriginal = itensCarrinho.reduce((acc, i) => acc + (Number(i.precoOriginal) || 0) * i.quantidade, 0);
  const subtotalAtual    = itensCarrinho.reduce((acc, i) => acc + (Number(i.precoAtual)    || 0) * i.quantidade, 0);
  const totalDesconto    = subtotalOriginal - subtotalAtual;
  const valorFrete       = subtotalAtual > 20000 ? 0 : 1990;

  const fmt = (val) =>
    (Number(val) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  
  if (carregando) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />

        <p className="text-sm font-semibold text-gray-400">Carregando carrinho...</p>

      </main>

    );
  }

  
  if (itensCarrinho.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4">
        <div className="text-center flex flex-col items-center max-w-md">
          <div className="p-4 bg-gray-50 rounded-full mb-4 text-gray-400">
            <ShoppingBag size={48} />

          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>

          <p className="text-sm text-gray-500 mb-6">
            Explore nossa seleção de smartphones e adicione itens para finalizar a sua compra.
          </p>

          <Link
            to="/produtos"
            className="w-full sm:w-auto bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Voltar para os produtos
          </Link>

        </div>

      </main>

    );
  }

  
  return (
    <main className="py-6 md:py-10 bg-white text-gray-800 font-sans w-full max-w-[1440px] mx-auto overflow-x-hidden px-6 md:px-16 box-border">
      <div className="mb-6">
        <Link to="/produtos" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={14} />

          <span>Continuar comprando</span>

        </Link>

      </div>


      <h1 className="text-2xl font-black text-gray-900 tracking-tight text-left mb-8">Meu Carrinho</h1>


      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start w-full">
        
        <div className="flex flex-col gap-4 w-full">
          {itensCarrinho.map((item) => {
            const chave = item.cartItemId || item.id;
            const estaAtualizando = atualizando === chave;
            return (
              <div
                key={chave}
                className={`flex flex-col sm:flex-row items-center sm:justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100 gap-4 text-left w-full transition-opacity ${estaAtualizando ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 border border-gray-100 shrink-0 mix-blend-multiply">
                    {item.imagem
                      ? <img src={item.imagem} alt={item.nome} className="max-h-full max-w-full object-contain" />

                      : <ShoppingBag size={32} className="text-gray-300" />

                    }
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{item.nome}</h3>

                    {item.precoOriginal > item.precoAtual && (
                      <p className="text-[10px] text-gray-400 line-through">{fmt(item.precoOriginal)}</p>

                    )}
                    <p className="text-sm font-black text-gray-900">{fmt(item.precoAtual)}</p>

                  </div>

                </div>


                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                  <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                    <button
                      onClick={() => alterarQuantidade(item, "subtrair")}
                      className="p-1.5 hover:bg-gray-50 rounded-full text-gray-500 transition-colors"
                    >
                      <Minus size={14} />

                    </button>

                    <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantidade}</span>

                    <button
                      onClick={() => alterarQuantidade(item, "somar")}
                      className="p-1.5 hover:bg-gray-50 rounded-full text-gray-500 transition-colors"
                    >
                      <Plus size={14} />

                    </button>

                  </div>


                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-gray-900 min-w-[70px] text-right">
                      {fmt(item.precoAtual * item.quantidade)}
                    </span>

                    <button
                      onClick={() => removerItem(item)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />

                    </button>

                  </div>

                </div>

              </div>

            );
          })}
        </div>


        
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left w-full sticky top-24">
          <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-200 mb-4">
            Resumo do Pedido
          </h2>


          <div className="flex flex-col gap-3 text-xs font-medium text-gray-500 mb-5">
            <div className="flex justify-between">
              <span>Subtotal bruto</span>

              <span className="text-gray-900">{fmt(subtotalOriginal)}</span>

            </div>

            {totalDesconto > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Descontos economizados</span>

                <span>-{fmt(totalDesconto)}</span>

              </div>

            )}
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span>Frete</span>

              <span className="text-gray-900">
                {valorFrete === 0 ? "Grátis" : fmt(valorFrete / 100)}
              </span>

            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-bold text-gray-900">Total à pagar</span>

              <span className="text-xl font-black text-indigo-600">
                {fmt(subtotalAtual + (valorFrete === 0 ? 0 : valorFrete / 100))}
              </span>

            </div>

          </div>


          <button
            onClick={() => {
              const dadosCheckout = {
                produto: {
                  nome: itensCarrinho.length === 1 ? itensCarrinho[0].nome : "Vários Itens",
                  precoAtual: subtotalAtual,
                  imagem: itensCarrinho[0]?.imagem
                },
                quantidade: 1
              };
              localStorage.setItem("checkout_atual", JSON.stringify(dadosCheckout));
              navigate("/checkout");
            }}
            className="w-full bg-indigo-600 text-white text-sm font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 mb-3"
          >
            Finalizar Compra
          </button>


          <Link
            to="/produtos"
            className="block text-center w-full bg-white text-gray-700 border border-gray-200 text-xs font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all"
          >
            Adicionar mais produtos
          </Link>

        </div>

      </div>

    </main>

  );
}