import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CarrinhoPage() {
  const navigate = useNavigate();
  const [itensCarrinho, setItensCarrinho] = useState([]);

  useEffect(() => {
    const dadosSalvos = JSON.parse(localStorage.getItem("carrinho")) || [];
    setItensCarrinho(dadosSalvos);
  }, []);

  const salvarEAtualizar = (novoCarrinho) => {
    setItensCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    window.dispatchEvent(new Event("storage"));
  };

  const alterarQuantidade = (id, tipo) => {
    const novoCarrinho = itensCarrinho.map((item) => {
      if (item.id === id) {
        const novaQtd = tipo === "somar" ? item.quantidade + 1 : item.quantidade - 1;
        return { ...item, quantidade: Math.max(1, novaQtd) };
      }
      return item;
    });
    salvarEAtualizar(novoCarrinho);
  };

  const removerItem = (id) => {
    const novoCarrinho = itensCarrinho.filter((item) => item.id !== id);
    salvarEAtualizar(novoCarrinho);
  };

  const subtotalOriginal = itensCarrinho.reduce((acc, item) => acc + (Number(item.precoOriginal) || 0) * item.quantidade, 0);
  const subtotalAtual = itensCarrinho.reduce((acc, item) => acc + (Number(item.precoAtual) || 0) * item.quantidade, 0);
  const totalDesconto = subtotalOriginal - subtotalAtual;
  const valorFrete = subtotalAtual > 20000 ? 0 : 1990;

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
          {itensCarrinho.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100 gap-4 text-left w-full"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 border border-gray-100 shrink-0 mix-blend-multiply">
                  <img src={item.imagem} alt={item.nome} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.nome}</h3>
                  <p className="text-[10px] text-gray-400 line-through">
                    ${(Number(item.precoOriginal) || 0).toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm font-black text-gray-900">
                    ${(Number(item.precoAtual) || 0).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                  <button
                    onClick={() => alterarQuantidade(item.id, "subtrair")}
                    className="p-1.5 hover:bg-gray-50 rounded-full text-gray-500 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantidade}</span>
                  <button
                    onClick={() => alterarQuantidade(item.id, "somar")}
                    className="p-1.5 hover:bg-gray-50 rounded-full text-gray-500 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-gray-900 min-w-[70px] text-right">
                    ${((Number(item.precoAtual) || 0) * item.quantidade).toLocaleString("pt-BR")}
                  </span>
                  <button
                    onClick={() => removerItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left w-full sticky top-24">
          <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-200 mb-4">
            Resumo do Pedido
          </h2>

          <div className="flex flex-col gap-3 text-xs font-medium text-gray-500 mb-5">
            <div className="flex justify-between">
              <span>Subtotal bruto</span>
              <span className="text-gray-900">${subtotalOriginal.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Descontos economizados</span>
              <span>-${totalDesconto.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span>Frete</span>
              <span className="text-gray-900">
                {valorFrete === 0 ? "Grátis" : `$${(valorFrete / 100).toLocaleString("pt-BR")}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-bold text-gray-900">Total à pagar</span>
              <span className="text-xl font-black text-indigo-600">
                ${(subtotalAtual + (valorFrete === 0 ? 0 : valorFrete / 100)).toLocaleString("pt-BR")}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              // Se o checkout lê de 'checkout_atual', preparamos a chave com a lista ou o resumo apropriado para prosseguir
              const dadosCheckout = {
                produto: {
                  nome: itensCarrinho.length === 1 ? itensCarrinho[0].nome : "Vários Itens",
                  precoAtual: subtotalAtual,
                  imagem: itensCarrinho[0].imagem
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