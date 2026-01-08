import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Loader2, Info, Image as ImageIcon, User, LogOut, CheckCircle2 } from 'lucide-react';
import { analyzeWasteImage } from '../services/geminiService';
import { ScanResult } from '../types';
import { signInWithGoogle, signOut } from '../services/supabaseClient';

interface ScannerScreenProps {
  onScanComplete: (result: ScanResult) => void;
  isActive: boolean;
  user: any;
}

const ScannerScreen: React.FC<ScannerScreenProps> = ({ onScanComplete, isActive, user }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && !capturedImage && !analyzing) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isActive, capturedImage, analyzing]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      }).catch(() => navigator.mediaDevices.getUserMedia({ video: true, audio: false }));
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play().catch(console.error);
      }
    } catch (err) {
      setCameraError("Câmera indisponível.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !stream || video.videoWidth === 0) return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const b64 = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(b64);
      analyzeImage(b64);
    }
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    setSaveStatus('idle');
    stopCamera();
    try {
      const data = base64.split(',')[1];
      const res = await analyzeWasteImage(data);
      setResult(res);
      setSaveStatus('saving');
      await onScanComplete(res);
      setSaveStatus('saved');
    } catch (e) {
      alert("Erro ao analisar. Tente novamente.");
      setCapturedImage(null);
      if (isActive) startCamera();
    } finally {
      setAnalyzing(false);
    }
  };

  const renderLoginModal = () => (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 animate-[fadeIn_0.2s_ease-out]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
      <div className="bg-white w-full max-w-xs rounded-[40px] p-8 relative z-10 shadow-2xl animate-[scaleIn_0.3s_ease-out]">
        <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {user ? (
            <>
              <div className="w-16 h-16 bg-eco-50 rounded-3xl overflow-hidden mb-6 shadow-inner flex items-center justify-center border-2 border-eco-200">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-eco-600" />
                )}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 truncate max-w-full">
                Olá, {user.user_metadata?.full_name?.split(' ')[0] || 'EcoUser'}
              </h3>
              <p className="text-sm text-gray-500 font-medium mb-8">Sessão protegida. Seus descartes estão sendo salvos.</p>
              <button onClick={() => { signOut(); setShowLoginModal(false); }} className="w-full flex items-center justify-center gap-3 bg-red-50 border-2 border-red-100 py-4 px-6 rounded-2xl font-bold text-red-600 hover:bg-red-100 active:scale-95 transition-all">
                <LogOut size={20} /> Sair da Conta
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-eco-50 text-eco-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <User size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Sua Conta</h3>
              <p className="text-sm text-gray-500 font-medium mb-8">Entre para salvar seu histórico e impacto ambiental.</p>
              <button onClick={() => { signInWithGoogle(); setShowLoginModal(false); }} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Entrar com Google
              </button>
            </>
          )}
          <p className="mt-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">Segurança EcoScan</p>
        </div>
      </div>
    </div>
  );

  if (analyzing) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white p-10 text-center animate-pulse">
        <Loader2 className="text-eco-600 animate-spin mb-4" size={56} />
        <h2 className="text-2xl font-black text-gray-900">Identificando...</h2>
        <p className="text-gray-500 text-sm mt-2">Nossa IA está analisando seu resíduo</p>
      </div>
    );
  }

  if (result && capturedImage) {
    return (
      <div className="h-full w-full flex flex-col bg-white overflow-hidden animate-[fadeIn_0.3s]">
        <div className="h-1/2 w-full bg-black relative">
          <img src={capturedImage} className="w-full h-full object-cover" alt="Scan" />
          <button onClick={() => {setResult(null); setCapturedImage(null);}} className="absolute top-6 right-6 p-2 bg-black/40 text-white rounded-full backdrop-blur-sm active:scale-90">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 p-8 bg-white -mt-8 rounded-t-[40px] relative shadow-2xl overflow-y-auto">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
          
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-black text-gray-900 capitalize">{result.itemName}</h2>
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-eco-600 bg-eco-50 px-3 py-1.5 rounded-xl border border-eco-100 animate-[bounce_0.5s_ease-in-out]">
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Salvo</span>
              </div>
            )}
          </div>

          <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-black w-fit border-2 ${result.recyclability === 'Recyclable' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {result.recyclability === 'Recyclable' ? 'RECICLÁVEL' : 'LIXO COMUM'}
          </div>

          <div className="mt-8 p-6 bg-eco-50 rounded-3xl border border-eco-100">
            <h4 className="font-bold text-eco-800 flex items-center gap-2 mb-3 text-sm"><Info size={16} /> Onde descartar:</h4>
            <p className="text-sm text-eco-900 leading-relaxed font-medium">{result.disposalAdvice}</p>
          </div>

          <button onClick={() => {setResult(null); setCapturedImage(null);}} className="mt-10 mb-24 w-full bg-gray-900 text-white py-5 rounded-2xl font-black active:scale-95 transition-all shadow-xl uppercase text-xs tracking-widest">NOVO SCAN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black relative overflow-hidden">
      {showLoginModal && renderLoginModal()}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => { setCapturedImage(ev.target?.result as string); analyzeImage(ev.target?.result as string); };
          reader.readAsDataURL(file);
        }
      }} />

      {isFlashing && <div className="absolute inset-0 bg-white z-[120] opacity-100" />}

      {!cameraError ? (
        <div className="h-full w-full relative">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
          
          {/* Botão de Perfil com Indicador de Login */}
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="absolute top-6 left-6 w-12 h-12 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all z-[110] overflow-hidden"
          >
            {user ? (
              <div className="relative w-full h-full">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-eco-600"><User size={20} /></div>
                )}
                {/* Selo de Online/Login Ativo */}
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
              </div>
            ) : (
              <User size={20} />
            )}
          </button>

          {/* Dica visual de login para salvar */}
          {!user && (
            <div className="absolute top-8 left-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-none animate-[fadeIn_0.5s_delay-1s]">
              <span className="text-[9px] font-bold text-white uppercase tracking-widest whitespace-nowrap">Entre para salvar</span>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-72 h-72 border-2 border-white/30 rounded-[50px] relative overflow-hidden shadow-[0_0_0_1000px_rgba(0,0,0,0.4)]">
                <div className="scanning-line" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-eco-500 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-eco-500 rounded-br-2xl" />
             </div>
          </div>
          
          <div className="absolute bottom-28 left-0 right-0 flex justify-center items-center pointer-events-none">
             <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex items-center justify-center active:scale-90 transition-all pointer-events-auto">
                <div className="w-14 h-14 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
             </button>
          </div>

          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-32 left-8 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-90 pointer-events-auto">
            <ImageIcon size={20} />
          </button>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-white p-10 text-center">
          <p className="mb-8 font-bold text-lg">Acesso à câmera necessário</p>
          <button onClick={() => fileInputRef.current?.click()} className="bg-eco-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg">ABRIR GALERIA</button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default ScannerScreen;