import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from server-side env (NOT exposed to frontend)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not configured on server');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const { image } = req.body;
    if (!image || typeof image !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid image data' });
    }

    const prompt = `
    Você é um especialista em reciclagem em Mossoró, RN. 
    Analise a imagem e identifique o objeto.
    
    REGRAS DE RESPOSTA:
    1. Se o item for reciclável, indique OBRIGATORIAMENTE um dos locais deste contexto: ${MOSSORO_CONTEXT}.
    2. Se não houver um local específico no contexto, recomende a ACREVI ou ASCAMAREM para recicláveis gerais.
    3. Para lixo comum (não reciclável), informe que deve ser descartado na coleta domiciliar comum de Mossoró.
  `;

    try {
        // Using Google's REST API directly to avoid SDK issues in serverless
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { inline_data: { mime_type: 'image/jpeg', data: image } },
                            { text: prompt }
                        ]
                    }],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: 'OBJECT',
                            properties: {
                                itemName: { type: 'STRING', description: 'Nome simples do objeto identificado (ex: Garrafa PET, Pilha, Papel).' },
                                material: { type: 'STRING', description: 'Material principal (ex: Plástico, Metal, Químico).' },
                                recyclability: { type: 'STRING', enum: ['Recyclable', 'Non-Recyclable', 'Organic', 'Hazardous'], description: 'Categoria de reciclabilidade.' },
                                disposalAdvice: { type: 'STRING', description: 'Instrução de descarte citando o local real em Mossoró.' },
                                confidence: { type: 'NUMBER', description: 'Nível de confiança da análise de 0 a 1.' },
                            },
                            required: ['itemName', 'material', 'recyclability', 'disposalAdvice', 'confidence'],
                        }
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            return res.status(500).json({ error: 'Failed to analyze image' });
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultText) {
            return res.status(500).json({ error: 'Empty response from AI model' });
        }

        const parsedResult = JSON.parse(resultText);
        return res.status(200).json(parsedResult);

    } catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
