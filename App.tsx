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

import { App as CapApp } from '@capacitor/app';

// ... (imports)

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('scanner');
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Configurar listener para Deep Links (Redirecionamento de Auth)
    CapApp.addListener('appUrlOpen', async (data) => {
      console.log('App aberto via URL:', data.url);

      try {
        // Tenta extrair tokens da URL (pode vir como hash # ou query ?)
        const urlObj = new URL(data.url);

        // Verifica hash e query params para cobrir diferentes retornos
        const paramsHash = new URLSearchParams(urlObj.hash.substring(1)); // Remove o #
        const paramsQuery = new URLSearchParams(urlObj.search);

        const accessToken = paramsHash.get('access_token') || paramsQuery.get('access_token');
        const refreshToken = paramsHash.get('refresh_token') || paramsQuery.get('refresh_token');

        if (accessToken && refreshToken) {
          console.log("Tokens encontrados na URL! Configurando sessão...");
          const { data: sessionData, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          if (sessionData.session?.user) {
            console.log('Login via Deep Link SUCESSO!');
            setUser(sessionData.session.user);
            loadUserHistory(sessionData.session.user.id);
          }
        } else {
          console.log("Nenhum token encontrado na URL. Tentando getSession normal...");
          // Fallback: Tenta deixar o Supabase detectar sozinho, caso venha de outra forma
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) setUser(session.user);
        }
      } catch (err: any) {
        console.error("Erro ao processar Deep Link:", err.message);
      }
    });

    // Monitora mudanças na sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserHistory(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserHistory(session.user.id);
    });

    return () => {
      subscription.unsubscribe();
      CapApp.removeAllListeners();
    };
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
      <div className="w-full h-full relative flex flex-col overflow-hidden bg-white">
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