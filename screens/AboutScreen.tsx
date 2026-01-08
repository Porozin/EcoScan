import React from 'react';
import { Info, Users, School, Leaf, ShieldCheck, Heart, Sparkles, GraduationCap } from 'lucide-react';

const AboutScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Hero Header */}
      <div className="relative h-64 bg-eco-600 flex flex-col items-center justify-center text-white overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10">
          <Leaf size={120} className="absolute -top-10 -left-10 rotate-12" />
          <Leaf size={80} className="absolute bottom-10 -right-5 -rotate-45" />
          <Sparkles size={100} className="absolute top-20 right-10 opacity-20" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[32px] flex items-center justify-center mb-4 shadow-xl border border-white/30">
            <Leaf size={40} className="text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">EcoScan</h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Versão 1.0 • Mossoró</p>
        </div>
        
        {/* Curva decorativa */}
        <div className="absolute bottom-0 w-full h-12 bg-white rounded-t-[48px]" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 -mt-4 relative z-10 bg-white">
        <div className="space-y-8">
          
          {/* Propósito */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-eco-50 rounded-xl text-eco-600">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900">Nosso Propósito</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              O <span className="text-eco-700 font-bold">EcoScan</span> nasceu para simplificar a sustentabilidade em Mossoró. 
              Utilizamos inteligência artificial para que qualquer cidadão saiba instantaneamente se um resíduo é reciclável e, 
              mais importante, <span className="underline decoration-eco-500 decoration-2">exatamente onde entregá-lo</span> na nossa cidade.
            </p>
          </section>

          {/* Origem CEEP */}
          <section className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <School size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900">Projeto CEEP</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Esta aplicação é um fruto direto da dedicação acadêmica no <span className="font-bold text-gray-900">CEEP Mossoró</span> (Centro Estadual de Educação Profissional).
              </p>
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Trabalho de Conclusão</h4>
                  <p className="text-sm font-bold text-gray-800 leading-snug">
                    TCC do curso técnico de Meio Ambiente.
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium italic">
                Desenvolvido por estudantes comprometidos com o futuro ambiental da nossa região.
              </p>
            </div>
          </section>

          {/* Iniciativas Locais */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <Heart size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900">Apoio Local</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed font-medium mb-4">
              Apoiamos e incentivamos iniciativas como a <span className="text-amber-600 font-bold">Coletiva Lixo Zero Mossoró</span>, 
              que trabalha incansavelmente para transformar nossa cidade em um exemplo de gestão de resíduos.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50/50 p-4 rounded-2xl text-center border border-amber-100">
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-tighter">Engajamento</p>
                <p className="text-lg font-black text-amber-600 leading-none mt-1">100%</p>
                <p className="text-[9px] text-amber-700 font-bold mt-1">MOSSOROENSE</p>
              </div>
              <div className="bg-eco-50/50 p-4 rounded-2xl text-center border border-eco-100">
                <p className="text-[10px] font-black text-eco-800 uppercase tracking-tighter">Tecnologia</p>
                <p className="text-lg font-black text-eco-600 leading-none mt-1">VERDE</p>
                <p className="text-[9px] text-eco-700 font-bold mt-1">SUSTENTÁVEL</p>
              </div>
            </div>
          </section>

          {/* Footer do Sobre */}
          <div className="text-center pt-4 pb-8">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Feito com ❤️ por alunos do CEEP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;