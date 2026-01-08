import React from 'react';
import { Recycle, Leaf, Zap, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { GuideCard } from '../types';

const GUIDES: GuideCard[] = [
  { id: '1', title: 'Papel', category: 'Lixeira Azul', color: 'bg-blue-500', description: 'Jornais, revistas, caixas de papelão limpas.', icon: 'Recycle' },
  { id: '2', title: 'Plásticos', category: 'Lixeira Vermelha', color: 'bg-red-500', description: 'Garrafas PET, potes de comida lavados.', icon: 'Recycle' },
  { id: '3', title: 'Vidro', category: 'Lixeira Verde', color: 'bg-green-500', description: 'Garrafas, potes e frascos inteiros.', icon: 'Recycle' },
  { id: '4', title: 'Metal', category: 'Lixeira Amarela', color: 'bg-yellow-500', description: 'Latas de alumínio e embalagens de aço.', icon: 'Recycle' },
  { id: '5', title: 'Orgânico', category: 'Lixeira Marrom', color: 'bg-amber-700', description: 'Restos de alimentos e cascas de frutas.', icon: 'Leaf' },
  { id: '6', title: 'Eletrônicos', category: 'Descarte Especial', color: 'bg-eco-600', description: 'Celulares, cabos e periféricos antigos.', icon: 'Zap' },
];

const GuideScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 pt-10 border-b border-gray-50 shrink-0">
        <h1 className="text-2xl font-black text-gray-900 leading-tight">Guia de Bolso</h1>
        <p className="text-gray-500 text-sm font-medium">Aprenda a descartar corretamente</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-gray-50">
        
        {/* Banner de Destaque: Lixo Zero Mossoró */}
        <a 
          href="https://entr.ai/lixozeromossoro" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mb-6 relative overflow-hidden bg-gradient-to-br from-eco-600 to-eco-800 rounded-[32px] p-6 text-white shadow-xl shadow-eco-100 group active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                Destaque
              </span>
            </div>
            <h2 className="text-2xl font-black leading-tight mb-2">Lixo Zero Mossoró</h2>
            <p className="text-sm font-medium opacity-90 mb-4 max-w-[80%]">
              Acesse informações úteis da Coletiva Lixo Zero em Mossoró. Conheça projetos e iniciativas locais.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-eco-700 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg">
              Ver Informações <ExternalLink size={14} />
            </div>
          </div>
        </a>

        <div className="grid grid-cols-2 gap-3">
          {GUIDES.map((guide) => (
            <div key={guide.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col h-48 animate-[scaleIn_0.3s_ease-out]">
              <div className={`${guide.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-sm`}>
                {guide.icon === 'Leaf' ? <Leaf size={20} /> : 
                 guide.icon === 'Zap' ? <Zap size={20} /> : 
                 <Recycle size={20} />}
              </div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{guide.title}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-wider">{guide.category}</p>
              <p className="text-[10px] text-gray-500 mt-3 line-clamp-3 leading-relaxed font-medium">
                {guide.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-5 bg-white rounded-[32px] border border-gray-200 text-gray-800 shadow-sm">
          <h4 className="font-bold flex items-center gap-2 mb-2 text-eco-600">
            <Trash2 size={18} /> Lixo Comum?
          </h4>
          <p className="text-[11px] font-medium leading-relaxed opacity-70">Itens como papel higiênico, cerâmicas e espelhos devem ir para o rejeito (lixo comum).</p>
        </div>
      </div>
    </div>
  );
};

export default GuideScreen;