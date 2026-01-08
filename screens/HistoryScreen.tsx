import React, { useState } from 'react';
import { ScanResult } from '../types';
import { Calendar, Trash2, ChevronRight, X, Info, ArrowLeft, Recycle, AlertCircle, ImageIcon } from 'lucide-react';

interface HistoryScreenProps {
  history: ScanResult[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history }) => {
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const handleCloseDetail = () => setSelectedScan(null);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden relative">
      {/* Detalhes do Item (Overlay/Modal) */}
      {selectedScan && (
        <div className="absolute inset-0 z-50 bg-white animate-[slideUp_0.3s_ease-out_forwards] flex flex-col">
          <div className="p-6 pt-12 flex items-center justify-between border-b border-gray-100">
            <button 
              onClick={handleCloseDetail}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Detalhes do Resíduo</h2>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-y-auto p-8 pb-32">
            {selectedScan.imageUrl && (
              <div className="w-full h-48 rounded-[32px] overflow-hidden mb-8 shadow-lg">
                <img src={selectedScan.imageUrl} className="w-full h-full object-cover" alt={selectedScan.itemName} />
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-3xl shadow-inner shrink-0
                ${selectedScan.recyclability === 'Recyclable' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {selectedScan.recyclability === 'Recyclable' ? <Recycle size={32} /> : <AlertCircle size={32} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight capitalize">{selectedScan.itemName}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1">{selectedScan.material}</p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider mb-8 border-2
              ${selectedScan.recyclability === 'Recyclable' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'}`}>
              {selectedScan.recyclability === 'Recyclable' ? 'RECICLÁVEL' : 'NÃO RECICLÁVEL'}
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-eco-50 rounded-[32px] border border-eco-100 shadow-sm">
                <h4 className="font-black text-eco-800 flex items-center gap-2 mb-3 text-xs uppercase tracking-widest">
                  <Info size={16} /> Onde levar em Mossoró:
                </h4>
                <p className="text-sm text-eco-900 leading-relaxed font-medium">
                  {selectedScan.disposalAdvice}
                </p>
              </div>

              <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold uppercase px-2 tracking-widest">
                <Calendar size={14} />
                <span>{new Date(selectedScan.timestamp).toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <button 
              onClick={handleCloseDetail}
              className="mt-12 w-full bg-gray-900 text-white py-5 rounded-3xl font-black active:scale-95 transition-all shadow-xl shadow-gray-200 uppercase text-[10px] tracking-[0.2em]"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}

      {/* Cabeçalho do Histórico */}
      <div className="p-6 pt-12 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900">Seu Impacto</h1>
        <div className="flex items-center gap-2 mt-1">
           <span className="text-3xl font-black text-eco-600 leading-none">{history.length}</span>
           <p className="text-gray-400 text-[10px] font-bold uppercase leading-tight tracking-wider">itens escaneados<br/>e descartados</p>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-10 opacity-60">
            <div className="w-16 h-16 bg-gray-100 rounded-[24px] flex items-center justify-center mb-4">
              <Calendar className="text-gray-300" />
            </div>
            <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest">Histórico Vazio</h3>
            <p className="text-gray-400 text-[10px] font-medium mt-2">Os itens que você escanear aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] px-2 mb-4">Recentes</h2>
            {history.map((scan, index) => (
              <button 
                key={scan.id} 
                onClick={() => setSelectedScan(scan)}
                className="w-full text-left bg-white p-3 rounded-[24px] flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all border border-transparent hover:border-eco-100 animate-[itemIn_0.4s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center relative">
                  {scan.imageUrl ? (
                    <img src={scan.imageUrl} className="w-full h-full object-cover" alt="Scan" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={20} />
                  )}
                  <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg flex items-center justify-center text-[10px] shadow-sm
                    ${scan.recyclability === 'Recyclable' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {scan.recyclability === 'Recyclable' ? '✓' : '!'}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 truncate capitalize text-sm">{scan.itemName}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{scan.material}</p>
                </div>

                <div className="pr-1">
                  <ChevronRight size={18} className="text-gray-200" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes itemIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HistoryScreen;