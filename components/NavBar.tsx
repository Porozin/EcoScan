import React from 'react';
import { Camera, Map, History, BookOpen, Info, Sparkles } from 'lucide-react';
import { ScreenName } from '../types';

interface NavBarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'history', icon: <History size={20} />, label: 'Histórico' },
    { id: 'map', icon: <Map size={20} />, label: 'Mapa' },
    { id: 'scanner', icon: <Camera size={24} />, label: 'Scanner', isScanner: true },
    { id: 'guide', icon: <BookOpen size={20} />, label: 'Guia' },
    { id: 'about', icon: <Info size={20} />, label: 'Sobre' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border border-white/50 flex items-center justify-between px-2 h-20 pointer-events-auto">
        
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          
          if (item.isScanner) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ScreenName)}
                className={`relative flex flex-col items-center justify-center px-6 h-[85%] rounded-2xl transition-all duration-300 active:scale-95 overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-br from-eco-600 to-eco-800 text-white shadow-lg shadow-eco-200' 
                    : 'bg-gradient-to-br from-eco-500 to-eco-700 text-white opacity-90 shadow-md'
                  }`}
              >
                {/* Efeito de brilho estilo Lixo Zero */}
                <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
                  <Sparkles size={40} />
                </div>
                
                <Camera size={24} className={isActive ? 'animate-pulse' : ''} />
                <span className="text-[9px] font-black uppercase tracking-widest mt-1">Scanner</span>
                
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenName)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90
                ${isActive ? 'text-eco-600' : 'text-gray-400'}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-eco-50' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;