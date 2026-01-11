import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";
import { Capacitor } from "@capacitor/core";

/**
 * Detecta se está rodando em um app nativo (Capacitor) ou na web
 */
const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Tenta obter a chave de API de múltiplas fontes possíveis no ambiente Vite/Browser
 * Só é usada no app mobile (nativo)
 */
const getApiKey = (): string => {
  // @ts-ignore
  return import.meta.env?.VITE_API_KEY || import.meta.env?.API_KEY || process.env?.API_KEY || '';
};

const MOSSORO_CONTEXT = `
DATABASE MOSSORÓ (PONTOS DE COLETA OFICIAIS):
1. TAMPINHAS PLÁSTICAS: Partage Shopping, CAERN, Câmara Municipal (Gabinete Tony Fernandes), Cafeteria Bom Doce, Pedro Bala Motos, Clube dos Bancários, APAE.
2. ÓLEO DE COZINHA: Albergue de Mossoró, TCM Telecom, CAERN.
3. ELETRÔNICOS (E-WASTE): Parque Municipal, Escola de Artes, CAERN, OAB Mossoró, Partage Shopping, Católica, UERN, Magalu.
4. REMÉDIOS E BLISTERS: Drogasil (Prudente de Morais, Av. Diocesana, Nova Betânia, Alberto Maranhão, Alto de São Manoel).
5. LÂMPADAS MERCÚRIO: Atacadão (BR-304).
6. RECICLÁVEIS GERAIS (PAPEL/VIDRO/METAL): ACREVI (Bairro Bom Jardim), ASCAMAREM.
7. PILHAS E BATERIAS: Supermercado Rebouças (Todas as unidades), Drogasil, Atacadão, Dia a Dia Atacado, Hotel Ibis.
8. COSMÉTICOS/EMBALAGENS: O Boticário (Programa Boti Recicla).
`;

/**
 * Chama o endpoint serverless /api/analyze (web segura)
 */
const analyzeViaServerless = async (base64Image: string): Promise<any> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Falha ao analisar imagem');
  }

  return response.json();
};

/**
 * Chama a API do Gemini diretamente (app mobile nativo)
 */
const analyzeViaDirect = async (base64Image: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const prompt = `
    Você é um especialista em reciclagem em Mossoró, RN. 
    Analise a imagem e identifique o objeto.
    
    REGRAS DE RESPOSTA:
    1. Se o item for reciclável, indique OBRIGATORIAMENTE um dos locais deste contexto: ${MOSSORO_CONTEXT}.
    2. Se não houver um local específico no contexto, recomende a ACREVI ou ASCAMAREM para recicláveis gerais.
    3. Para lixo comum (não reciclável), informe que deve ser descartado na coleta domiciliar comum de Mossoró.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          itemName: {
            type: Type.STRING,
            description: "Nome simples do objeto identificado (ex: Garrafa PET, Pilha, Papel)."
          },
          material: {
            type: Type.STRING,
            description: "Material principal (ex: Plástico, Metal, Químico)."
          },
          recyclability: {
            type: Type.STRING,
            enum: ["Recyclable", "Non-Recyclable", "Organic", "Hazardous"],
            description: "Categoria de reciclabilidade."
          },
          disposalAdvice: {
            type: Type.STRING,
            description: "Instrução de descarte citando o local real em Mossoró."
          },
          confidence: {
            type: Type.NUMBER,
            description: "Nível de confiança da análise de 0 a 1."
          },
        },
        required: ["itemName", "material", "recyclability", "disposalAdvice", "confidence"],
      }
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("Resposta vazia do modelo");
  return JSON.parse(resultText);
};

export const analyzeWasteImage = async (base64Image: string): Promise<ScanResult> => {
  try {
    // Usa serverless na web (seguro), API direta no mobile
    const parsedResult = isNativePlatform()
      ? await analyzeViaDirect(base64Image)
      : await analyzeViaServerless(base64Image);

    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      itemName: parsedResult.itemName,
      material: parsedResult.material,
      recyclability: parsedResult.recyclability,
      disposalAdvice: parsedResult.disposalAdvice,
      confidence: parsedResult.confidence,
      imageUrl: `data:image/jpeg;base64,${base64Image}`
    };
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    throw new Error("Não foi possível analisar a imagem. Tente novamente.");
  }
};