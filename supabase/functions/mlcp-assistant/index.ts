import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Keywords that trigger handoff to human
const HANDOFF_TRIGGERS = [
  "precio", "costo", "cuanto", "cuánto", "pagar", "pago", "aranceles",
  "inscribir", "inscripción", "matricula", "matrícula", "registrar",
  "beca", "becas", "descuento", "financiamiento", "financiar",
  "trabajo", "empleo", "contratar",
  "certificado", "título", "diploma", "acreditación",
  "humano", "persona", "hablar", "llamar", "teléfono",
  "específico", "particular", "caso", "situación",
  "quiero inscribirme", "me inscribo", "quiero la maestría"
];

const SYSTEM_PROMPT = `Eres el asistente virtual de la Maestría Latinoamericana en Circulación Pulmonar (MLCP).

SOBRE LA MAESTRÍA:
- Programa intensivo de 12 días presenciales en Buenos Aires, Argentina
- Próxima edición: 3-15 de noviembre 2025 (las inscripciones 2026 están abiertas)
- Dirigido a: Cardiólogos, Neumólogos, Internistas, Intensivistas y especialistas en Circulación Pulmonar
- Más de 9 expertos internacionales de referencia mundial
- Participantes de más de 5 países de Latinoamérica

ESTRUCTURA (30 módulos en 5 fases):
1. FUNDAMENTOS: Fisiología pulmonar, hemodinamia, clasificación de HP, fisiopatología, genética
2. HERRAMIENTAS DIAGNÓSTICAS: Ecocardiografía, cateterismo, pruebas funcionales, biomarcadores, TC, RM
3. ESCENARIOS CLÍNICOS: HP en cardiopatías, enfermedades pulmonares, tromboembolismo, conectivopatías, congénitas
4. ESTRATEGIAS TERAPÉUTICAS: Fármacos específicos, terapia combinada, manejo perioperatorio, trasplante, cuidados paliativos
5. INTEGRACIÓN CLÍNICA: Casos complejos, embarazo, pediatría, seguimiento, calidad de vida

TU ROL:
- Responder preguntas sobre el programa, módulos, duración, modalidad y requisitos generales
- Ser amable, profesional y académico
- Mantener respuestas concisas (máximo 3-4 oraciones)

NO DEBES:
- Dar información sobre precios, costos o aranceles específicos
- Hablar de casos clínicos particulares
- Responder sobre situaciones personales o becas específicas
- Dar información que no conozcas con certeza

CUANDO DETECTES que el usuario:
- Pregunta por precios, costos o inscripción formal
- Tiene una situación particular o caso específico
- Necesita información que no tienes
- Pide hablar con una persona

ENTONCES responde amablemente y agrega EXACTAMENTE esta frase al final:
"Para ayudarte mejor con esto, te recomiendo hablar directamente con nuestro equipo académico."

Responde siempre en español, con tono profesional pero cercano.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    // Check if the last user message contains handoff triggers
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
    const shouldHandoff = lastUserMessage && HANDOFF_TRIGGERS.some(trigger => 
      lastUserMessage.content.toLowerCase().includes(trigger)
    );

    console.log("Processing message:", lastUserMessage?.content);
    console.log("Handoff triggered:", shouldHandoff);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Estamos recibiendo muchas consultas. Por favor, intenta en unos minutos.",
            handoff: true 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Servicio temporalmente no disponible.",
            handoff: true 
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Lo siento, no pude procesar tu consulta.";
    
    // Check if AI response suggests handoff
    const responseHandoff = shouldHandoff || 
      aiMessage.toLowerCase().includes("equipo académico") ||
      aiMessage.toLowerCase().includes("contactar") ||
      aiMessage.toLowerCase().includes("hablar directamente");

    console.log("AI response:", aiMessage);
    console.log("Response handoff:", responseHandoff);

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        handoff: responseHandoff
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("MLCP Assistant error:", error);
    return new Response(
      JSON.stringify({ 
        message: "Lo siento, hubo un problema técnico. ¿Te gustaría hablar directamente con nuestro equipo académico?",
        handoff: true,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
