import { Link } from "react-router-dom";
import Cat1 from "../assets/category/image 3.png";
import Cat2 from "../assets/category/image 5.png";
import Cat3 from "../assets/category/image 6.png";

const categorias = [
  { id: 1, nome: "SmartPhone", slug: "SmartPhone", imagem: Cat1 },
  { id: 5, nome: "SmartWatch", slug: "SmartWatch", imagem: Cat2 },
  { id: 7, nome: "Accessories", slug: "Accessories", imagem: Cat3 },
];

export default function Section2() {
  return (
    <section className="px-4 py-6 flex flex-col gap-4">
      <div className="flex justify-between border-gray-300">
        <h2 className="text-base font-medium border-b-3 border-blue-300 rounded-b-lg">
          Compre nas{" "}
          <span className="text-blue-500 font-semibold">
            principais categorias
          </span>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center items-center mt-2 gap-4 sm:gap-6">
        {categorias.slice(0, 10).map((categoria) => (
          <Link 
            key={categoria.id} 
            to={`/produtos?categoria=${categoria.slug}`}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="rounded-full bg-gray-100 p-3 sm:p-4 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-all group-hover:bg-blue-50 group-hover:shadow-sm">
              <img
                src={categoria.imagem}
                alt={categoria.nome}
                className="w-16 h-16 object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <p className="text-sm mt-2 text-gray-700 group-hover:text-blue-500 font-medium transition-colors">
              {categoria.nome}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}