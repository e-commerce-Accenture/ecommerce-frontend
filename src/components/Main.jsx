import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';

// Importação dos banners salvos na sua pasta de assets
import banner1 from '../assets/main-banner/banner1.png';
import banner2 from '../assets/main-banner/banner2.png';
import banner3 from '../assets/main-banner/banner3.png';

export function Main() {
    const [slideAtivo, setSlideAtivo] = useState(0);
    const [estaPausado, setEstaPausado] = useState(false); // Controla o pause ao passar o mouse
    
    const listaBanners = [banner1, banner2, banner3];
    const totalSlides = listaBanners.length;
    const TEMPO_AUTOPLAY = 4000; // 4 segundos

    // Efeito para controlar o autoplay
    useEffect(() => {
        if (estaPausado) return;

        const timer = setInterval(() => {
            setSlideAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
        }, TEMPO_AUTOPLAY);

        return () => clearInterval(timer);
    }, [estaPausado, totalSlides]);

    return (
        <main className="flex-1 bg-white w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

                {/* BANNER PRINCIPAL RESPONSIVO CORRIGIDO */}
                <section 
                    className="relative rounded-3xl overflow-hidden shadow-xl w-full bg-[#111625]"
                    onMouseEnter={() => setEstaPausado(true)}
                    onMouseLeave={() => setEstaPausado(false)}
                >
                    
                    {/* Seta Esquerda */}
                    <button 
                        onClick={() => setSlideAtivo(prev => (prev === 0 ? totalSlides - 1 : prev - 1))}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm z-20 transition-all"
                    >
                        <ChevronLeft size={20} className="md:size-6" />
                    </button>

                    {/* Conteúdo do Banner - Imagem ajustada para não cortar */}
                    <div className="w-full h-full flex items-center justify-center">
                        <img 
                            src={listaBanners[slideAtivo]} 
                            alt={`Banner promocional ${slideAtivo + 1}`} 
                            className="w-full h-auto object-contain block select-none"
                        />
                    </div>
                    
                    {/* Seta Direita */}
                    <button 
                        onClick={() => setSlideAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1))}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm z-20 transition-all"
                    >
                        <ChevronRight size={20} className="md:size-6" />
                    </button>

                    {/* Dots Funcionais */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {listaBanners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setSlideAtivo(i)}
                                className={`transition-all duration-300 rounded-full ${
                                    slideAtivo === i ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                                }`}
                                aria-label={`Ir para slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </section>

                {/* SEÇÕES INTEGRADAS */}
                <Section1 />
                <Section2 />
                <Section3 />

            </div>
        </main>
    );
}