import { ChevronRight } from "lucide-react";
import Cel from "../assets/produtos/image-1.png";
import Cel2 from "../assets/produtos/image-2.png";
import Cel3 from "../assets/produtos/image-3.png";
import Cel4 from "../assets/produtos/image-4.png";
import Cel5 from "../assets/produtos/image-5.png";
import { Link } from "react-router-dom";

const produtos = [
  {
    id: 1,
    nome: "Galaxy S22 Ultra",
    precoAtual: 32999,
    precoOriginal: 74999,
    desconto: 56,
    imagem: Cel,
  },
  {
    id: 2,
    nome: "Galaxy M13 4GB|64GB",
    precoAtual: 10499,
    precoOriginal: 14999,
    desconto: 56,
    imagem: Cel2,
  },
  {
    id: 3,
    nome: "Galaxy M33 5G|64GB",
    precoAtual: 16999,
    precoOriginal: 24999,
    desconto: 56,
    imagem: Cel3,
  },
  {
    id: 4,
    nome: "Galaxy M53 4GB|64GB",
    precoAtual: 31999,
    precoOriginal: 40999,
    desconto: 56,
    imagem: Cel4,
  },
  {
    id: 5,
    nome: "Galaxy S22 Ultra",
    precoAtual: 67999,
    precoOriginal: 86999,
    desconto: 56,
    imagem: Cel5,
  },
];

export default function Section1() {
  return (
    <section className="px-4 py-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-sm md:text-base font-medium border-b-3 border-blue-300 rounded-b-lg w-fit">
          Aproveite as melhores ofertas em{" "}
          <span className="text-blue-500 font-semibold">Smartphones</span>
        </h2>
        <div className="">
          <Link to='/produtos' className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
            View All <ChevronRight size={16} color="#3B82F6" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-between gap-4 lg:gap-9">
        {produtos.slice(0, 5).map((produto, index) => (
          <Link
            key={produto.id}
            to={`/produto/${produto.id}`}
            className={`flex flex-col h-full group cursor-pointer ${index >= 2 ? "hidden lg:block" : ""} `}
          >
            {/* Adicionado group-hover:border-blue-400, group-hover:shadow-md e transition-all */}
            <div className="w-full lg:w-[200px] h-full bg-gray-100 rounded-xl border-2 border-gray-200 group-hover:border-blue-400 group-hover:shadow-md flex flex-col items-center relative transition-all duration-300">
              
              <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                {produto.desconto}% OFF
              </span>
              
              <div className="p-3">
                {/* Adicionado group-hover:scale-105 para leve zoom na imagem */}
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-24 h-32 object-contain mb-3 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="bg-white w-full flex-1 p-3 flex flex-col justify-between gap-4 rounded-b-xl text-left">
                {/* Adicionado group-hover:text-blue-500 no nome do produto */}
                <p className="text-xs text-start font-medium text-gray-800 mb-1 transition-colors group-hover:text-blue-500">
                  {produto.nome}
                </p>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    ${produto.precoAtual.toLocaleString()}{" "}
                    <span className="text-xs text-gray-400 line-through font-normal">
                      ${produto.precoOriginal.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs text-start text-green-500 font-medium">
                    Save - $
                    {(
                      produto.precoOriginal - produto.precoAtual
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}