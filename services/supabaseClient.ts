import { createClient } from '@supabase/supabase-js';
import { ScanResult } from '../types';
import { Capacitor } from '@capacitor/core';

/**
 * Utilitário para buscar variáveis de ambiente de forma segura no navegador.
 * No Vite, variáveis devem começar com VITE_ para serem expostas.
 */
const getEnvVar = (key: string): string => {
  // @ts-ignore
  const viteVar = import.meta.env?.[`VITE_${key}`];
  // @ts-ignore
  const metaVar = import.meta.env?.[key];
  const procVar = process.env?.[key];

  return viteVar || metaVar || procVar || '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

// Log de depuração amigável
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Configuração do Supabase incompleta no .env\n" +
    "Certifique-se de usar os prefixos: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY"
  );
}

// Inicializa o cliente. Se os valores forem vazios, usamos placeholders 
// apenas para evitar que o bundle do React quebre (tela branca), 
// mas as chamadas de rede falharão graciosamente.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const signInWithGoogle = async () => {
  if (!supabaseUrl) return alert("Erro: Configuração do Supabase ausente.");
  try {
    const isNative = Capacitor.isNativePlatform();
    const redirectTo = isNative
      ? 'com.ecoscan.app://callback'
      : window.location.origin;

    console.log(`Iniciando login Google. Redirecionar para: ${redirectTo}`);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: isNative,
      },
    });
    if (error) throw error;
  } catch (error: any) {
    console.error('Erro ao entrar com Google:', error.message);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.reload();
  } catch (error: any) {
    console.error('Erro ao sair:', error.message);
  }
};

export const saveScan = async (userId: string, scan: ScanResult) => {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) return false;
  try {
    const { data, error } = await supabase.from('scans').insert({
      user_id: userId,
      item_name: scan.itemName,
      material: scan.material,
      recyclability: scan.recyclability,
      disposal_advice: scan.disposalAdvice,
      confidence: scan.confidence,
      image_url: scan.imageUrl
    }).select();

    if (error) throw error;
    console.log("✅ Dados sincronizados com o Supabase.");
    return true;
  } catch (err: any) {
    console.error('Falha ao salvar no banco:', err.message);
    return false;
  }
};

export const getUserScans = async (userId: string) => {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) return [];
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    return [];
  }
};