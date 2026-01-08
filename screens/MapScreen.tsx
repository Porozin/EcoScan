import React, { useState } from 'react';
import { MapPin, Navigation, Droplets, Laptop, Pill, Sparkles, Package, Lightbulb, Battery } from 'lucide-react';

interface Point {
  id: string;
  name: string;
  cat: string;
  address: string;
}

const MOSSORO_DATABASE: { [key: string]: Point[] } = {
  "Plásticos": [
    { id: 'p1', name: 'Partage Shopping', cat: 'Tampinhas', address: 'Nova Betânia' },
    { id: 'p2', name: 'CAERN', cat: 'Tampinhas', address: 'Centro' },
    { id: 'p3', name: 'Câmara Municipal (Gabinete Tony Fernandes)', cat: 'Tampinhas', address: 'Centro' },
    { id: 'p4', name: 'Cafeteria Bom Doce', cat: 'Tampinhas', address: 'R. Frei Miguelinho' },
    { id: 'p5', name: 'APAE Mossoró', cat: 'Tampinhas', address: 'Santa Delmira' }
  ],
  "Eletrônicos": [
    { id: 'e1', name: 'Parque Municipal', cat: 'Hardware', address: 'Vinte de Janeiro' },
    { id: 'e2', name: 'Escola de Artes Municipal', cat: 'Hardware', address: 'Centro' },
    { id: 'e3', name: 'UERN / Universidade Católica', cat: 'E-Waste', address: 'Mossoró' },
    { id: 'e4', name: 'Magazine Luiza', cat: 'Eletrônicos', address: 'Centro' },
    { id: 'e5', name: 'OAB Subseccional', cat: 'Eletrônicos', address: 'Mossoró' }
  ],
  "Saúde/Químicos": [
    { id: 's1', name: 'Drogasil Prudente de Morais', cat: 'Remédios/Pilhas', address: 'Centro' },
    { id: 's2', name: 'Drogasil Av. Diocesana', cat: 'Remédios/Pilhas', address: 'Nova Betânia' },
    { id: 's3', name: 'Atacadão (Lâmpadas/Pilhas)', cat: 'Lâmpadas', address: 'BR-304' },
    { id: 's4', name: 'Supermercado Rebouças', cat: 'Pilhas/Baterias', address: 'Várias Unidades' },
    { id: 's5', name: 'Hotel Ibis', cat: 'Pilhas/Baterias', address: 'Nova Betânia' }
  ],
  "Geral/Óleo": [
    { id: 'g1', name: 'ACREVI', cat: 'Papel/Metal/Vidro', address: 'Bom Jardim' },
    { id: 'g2', name: 'ASCAMAREM', cat: 'Recicláveis', address: 'Mossoró' },
    { id: 'g3', name: 'Albergue de Mossoró (Óleo)', cat: 'Óleo', address: 'R. Alberto Maranhão' },
    { id: 'g4', name: 'TCM Telecom (Óleo)', cat: 'Óleo', address: 'Belo Horizonte' },
    { id: 'g5', name: 'O Boticário', cat: 'Embalagens', address: 'Boti Recicla' }
  ]
};

const MapScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('Geral/Óleo');

  const categories = [
    { id: 'Geral/Óleo', icon: <Droplets size={16} /> },
    { id: 'Plásticos', icon: <Sparkles size={16} /> },
    { id: 'Saúde/Químicos', icon: <Pill size={16} /> },
    { id: 'Eletrônicos', icon: <Laptop size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="p-6 pt-10 border-b border-gray-50 bg-white">
        <h1 className="text-2xl font-black text-gray-900 leading-tight">EcoMapa Mossoró</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pontos Oficiais de Coleta</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="w-full h-80 bg-gray-100">
          <iframe 
            src="https://www.google.com/maps/d/embed?mid=1XU0cI5ERYdw4TIBtNJINsS91df2aveU&ehbc=2E312F&z=13" 
            width="100%" height="100%" style={{ border: 0 }} title="Mapa"
          ></iframe>
        </div>

        <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar py-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase transition-all
                ${selectedFilter === cat.id 
                  ? 'bg-eco-600 text-white shadow-xl scale-105' 
                  : 'bg-gray-50 text-gray-400'}`}
            >
              {cat.icon} {cat.id}
            </button>
          ))}
        </div>

        <div className="px-4 space-y-3">
          {MOSSORO_DATABASE[selectedFilter].map((point) => (
            <div key={point.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
              <div className="flex gap-4 items-center">
                <div className="bg-eco-50 p-3 rounded-2xl text-eco-600 group-hover:bg-eco-600 group-hover:text-white transition-all">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{point.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{point.cat} • {point.address}</p>
                </div>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-2xl text-gray-300 group-hover:text-eco-600 transition-colors">
                <Navigation size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapScreen;