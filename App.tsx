import React, { useState, useEffect } from 'react';
import { ScreenName, ScanResult } from './types';
import NavBar from './components/NavBar';
import ScannerScreen from './screens/ScannerScreen';
import MapScreen from './screens/MapScreen';
import HistoryScreen from './screens/HistoryScreen';
import GuideScreen from './screens/GuideScreen';
import AboutScreen from './screens/AboutScreen';
import { Leaf } from 'lucide-react';
import { supabase, saveScan, getUserScans } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('scanner');
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Monitora mudanças na sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserHistory(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserHistory(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserHistory = async (userId: string) => {
    const data = await getUserScans(userId);
    if (data) {
      const formatted = data.map((s: any) => ({
        id: s.id,
        itemName: s.item_name,
        material: s.material,
        recyclability: s.recyclability,
        disposalAdvice: s.disposal_advice,
        confidence: s.confidence,
        imageUrl: s.image_url,
        timestamp: new Date(s.created_at).getTime()
      }));
      setHistory(formatted);
    }
  };

  const handleScanComplete = async (result: ScanResult) => {
    // Atualiza estado local primeiro para feedback imediato
    setHistory(prev => [result, ...prev]);

    // Salva no Supabase se logado
    if (user) {
      await saveScan(user.id, result);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'history':
        return <HistoryScreen history={history} />;
      case 'map':
        return <MapScreen />;
      case 'guide':
        return <GuideScreen />;
      case 'about':
        return <AboutScreen />;
      case 'scanner':
      default:
        return <ScannerScreen user={user} onScanComplete={handleScanComplete} isActive={currentScreen === 'scanner'} />;
    }
  };

  const renderLogo = () => {
    if (currentScreen !== 'scanner') return null;
    return (
      <div className="absolute top-6 right-6 z-[110] flex items-center gap-1.5 opacity-30 pointer-events-none select-none">
        <div className="text-right">
          <span className="block text-[10px] font-black uppercase tracking-tighter leading-none text-gray-400">eco</span>
          <span className="block text-[10px] font-black uppercase tracking-tighter leading-none text-gray-400">scan</span>
        </div>
        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
          <Leaf size={16} className="text-white fill-white" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white h-full relative flex flex-col overflow-hidden shadow-2xl">
        {renderLogo()}
        <main className="flex-1 relative overflow-hidden">
          <div key={currentScreen} className="h-full w-full animate-[screenIn_0.3s_ease-out]">
            {renderScreen()}
          </div>
        </main>
        <NavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </div>
      <style>{`
        @keyframes screenIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;