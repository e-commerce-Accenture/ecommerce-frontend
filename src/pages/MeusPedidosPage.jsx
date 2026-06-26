import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, PackageOpen } from "lucide-react";

export default function MeusPedidosPage() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const historico = localStorage.getItem("historico_pedidos");
    if (historico) {
      setPedidos(JSON.parse(historico));
    }
  }, []);

  const verRastreio = (pedido) => {
    localStorage.setItem("ultimo_pedido", JSON.stringify(pedido));
    navigate("/rastreio");
  };

  return (
    <main className="py-8 max-w-4xl mx-auto text-gray-800 text-left">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="text-blue-500" size={22} /> Meus Pedidos Simulado
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Histórico de compras fictícias realizadas neste protótipo</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center gap-3 bg-gray-50">
          <PackageOpen size={40} className="text-gray-300" />
          <p className="text-gray-500 text-sm">Você ainda não realizou nenhuma compra simulada.</p>
          <Link to="/produtos" className="text-xs bg-blue-500 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-blue-600 transition-colors">
            Ir para a Loja
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pedidos.map((pedido) => (
            <div key={pedido.idPedido} className="border border-gray-200 rounded-2xl p-4 bg-white hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-gray-50 border rounded-xl p-1 flex items-center justify-center shrink-0">
                  <img src={pedido.produtoImagem} alt={pedido.produtoNome} className="max-h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded self-start mb-1">{pedido.idPedido}</span>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{pedido.produtoNome}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Data: {pedido.dataPedido} • Qtd: {pedido.quantidade}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="flex flex-col sm:text-right">
                  <span className="text-[10px] text-gray-400 font-medium">Total</span>
                  <span className="text-sm font-extrabold text-gray-900">{pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                
                <button 
                  onClick={() => verRastreio(pedido)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600 bg-blue-50/50 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"
                >
                  Rastrear <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}