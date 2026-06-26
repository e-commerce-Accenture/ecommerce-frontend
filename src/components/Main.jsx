import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';

import { getBanners } from '../services/bannerService';

export function Main() {
    const [slideAtivo, setSlideAtivo] = useState(0);
    const [estaPausado, setEstaPausado] = useState(false);
    const [listaBanners, setListaBanners] = useState([]);
    const [carregando, setCarregando] = useState(true);
    
    useEffect(() => {
        const carregarBanners = () => {
            getBanners()
                .then(data => {
                    const ativos = (data.main || []).filter(Boolean);
                    setListaBanners(ativos);
                })
                .catch(err => {
                    console.error("Erro ao carregar banners principais:", err);
                })
                .finally(() => {
                    setCarregando(false);
                });
        };

        carregarBanners();
        window.addEventListener('storage', carregarBanners);
        return () => window.removeEventListener('storage', carregarBanners);
    }, []);

    const totalSlides = listaBanners.length;
    const TEMPO_AUTOPLAY = 4000;

    useEffect(() => {
        if (estaPausado || totalSlides <= 1) return;
        const timer = setInterval(() => {
            setSlideAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
        }, TEMPO_AUTOPLAY);
        return () => clearInterval(timer);
    }, [estaPausado, totalSlides]);

    return (
        <main className="flex-1 bg-white w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

                <section 
                    className="relative rounded-3xl overflow-hidden shadow-xl w-full bg-[#111625] aspect-[2.7/1] sm:aspect-[3/1]"
                    onMouseEnter={() => setEstaPausado(true)}
                    onMouseLeave={() => setEstaPausado(false)}
                >
                    {totalSlides > 1 && (
                        <button 
                            onClick={() => setSlideAtivo(prev => (prev === 0 ? totalSlides - 1 : prev - 1))}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm z-20 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <div className="w-full h-full">
                        {carregando ? (
                            <div className="w-full h-full flex justify-center items-center bg-[#111625]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : listaBanners.length === 0 ? (
                            <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white p-8 text-center select-none">
                                <h1 className="text-xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">
                                    NEXTGEN E-COMMERCE
                                </h1>
                                <p className="text-xs md:text-sm text-gray-400 mt-2 max-w-md font-medium">
                                    Conecte seus banners no painel administrativo para personalizar o carrossel.
                                </p>
                            </div>
                        ) : (
                            <img 
                                src={listaBanners[slideAtivo]} 
                                alt={`Banner promocional ${slideAtivo + 1}`} 
                                className="w-full h-full object-cover block select-none"
                            />
                        )}
                    </div>
                    
                    {totalSlides > 1 && (
                        <button 
                            onClick={() => setSlideAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1))}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm z-20 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {totalSlides > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {listaBanners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlideAtivo(i)}
                                    className={`transition-all duration-300 rounded-full ${slideAtivo === i ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <Section1 />
                <Section2 />
                <Section3 />

            </div>
        </main>
    );
}