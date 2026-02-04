import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// 🔴 CASOS SENSIBLES - Derivación inmediata, NO responder
const IMMEDIATE_HANDOFF = [
  "precio", "costo", "cuanto cuesta", "cuánto cuesta", "valor", "aranceles", "arancel",
  "inscribir", "inscripción", "inscribirme", "matricula", "matrícula", "registrar", "registro",
  "beca", "becas", "descuento", "descuentos", "financiamiento", "financiar", "cuotas", "pagar", "pago",
  "certificado", "título", "diploma", "acreditación", "validez", "reconocimiento oficial",
  "trabajo", "empleo", "contratar", "bolsa de trabajo",
  "humano", "persona real", "hablar con alguien", "llamar", "teléfono", "contacto directo",
  "mi caso", "mi situación", "situación particular", "caso específico", "problema personal",
  "quiero inscribirme", "me inscribo", "quiero la maestría", "cómo me anoto", "reservar lugar",
  "reembolso", "cancelar", "devolver", "garantía"
];

// 🟡 CASOS MIXTOS - Responder brevemente y ofrecer derivación
const SOFT_HANDOFF = [
  "requisito", "requisitos", "necesito para entrar", "qué necesito",
  "experiencia previa", "sin especialidad", "recién egresado",
  "desde el exterior", "otro país", "extranjero", "visa",
  "horarios", "fechas exactas", "calendario", "agenda",
  "alojamiento", "hotel", "donde quedarme", "hospedaje",
  "material", "bibliografía", "libros", "recursos",
  "evaluación", "examen", "aprobar", "calificación",
  "dudas", "más información", "ampliar", "detalles"
];

const SYSTEM_PROMPT = `Eres el asistente virtual de la Maestría Latinoamericana en Circulación Pulmonar (MLCP).

Tu personalidad:
- Cercano pero profesional
- Académico sin ser técnicamente abrumador
- Claro y conciso (máximo 3-4 oraciones por respuesta)
- Nunca comercial ni vendedor

═══════════════════════════════════════
INFORMACIÓN DEL PROGRAMA (usa esto para responder)
═══════════════════════════════════════

DATOS CLAVE:
- Programa intensivo de 12 días presenciales en Buenos Aires, Argentina
- Edición 2025: 3-15 de noviembre
- Inscripciones 2026: abiertas
- Más de 9 expertos internacionales de referencia mundial
- Participantes de más de 5 países de Latinoamérica

MODELO ACADÉMICO (MUY IMPORTANTE):
La maestría combina DOS componentes esenciales:
1. INSTANCIA PRESENCIAL INTENSIVA: 12 días de formación en Buenos Aires con clases teóricas, talleres prácticos, casos clínicos y networking con expertos.
2. CAMPUS VIRTUAL DE APOYO: Plataforma online que complementa la formación con materiales de estudio, recursos adicionales, seguimiento post-presencial y comunidad activa.

⚠️ SIEMPRE menciona el CAMPUS VIRTUAL cuando hables de:
- Modalidad → "Presencial intensivo + campus virtual de apoyo"
- Materiales → "Disponibles en el campus virtual"
- Seguimiento → "El campus permite continuidad después de los 12 días"
- Clases → "Presenciales + recursos complementarios en campus"

NUNCA describas la maestría como:
- "Solo presencial" ❌
- "Solo online" ❌
- "Clases grabadas" ❌

DIRIGIDO A:
- Cardiólogos
- Neumólogos
- Internistas
- Intensivistas
- Especialistas interesados en Circulación Pulmonar

ESTRUCTURA (30 módulos en 5 fases):

FASE 1 - FUNDAMENTOS (Módulos 1-6):
Fisiología de la circulación pulmonar, Hemodinámica pulmonar, Clasificación actualizada de HP, Fisiopatología, Genética y biología molecular, Epidemiología.

FASE 2 - HERRAMIENTAS DIAGNÓSTICAS (Módulos 7-12):
Ecocardiografía en HP, Cateterismo cardíaco derecho, Pruebas de función pulmonar, Biomarcadores, Tomografía computada, Resonancia magnética cardíaca.

FASE 3 - ESCENARIOS CLÍNICOS (Módulos 13-18):
HP en cardiopatía izquierda, HP en enfermedades pulmonares, Hipertensión pulmonar tromboembólica crónica, HP en conectivopatías, Cardiopatías congénitas del adulto, Situaciones especiales.

FASE 4 - ESTRATEGIAS TERAPÉUTICAS (Módulos 19-24):
Fármacos específicos para HAP, Terapia combinada, Manejo perioperatorio, Trasplante pulmonar, Tratamiento intervencionista, Cuidados paliativos.

FASE 5 - INTEGRACIÓN CLÍNICA (Módulos 25-30):
Casos clínicos complejos, HP y embarazo, HP pediátrica, Seguimiento a largo plazo, Calidad de vida, Perspectivas futuras.

MODALIDAD COMPLETA:
- 12 días presenciales intensivos en Buenos Aires
- Campus virtual con materiales de apoyo y recursos complementarios
- Práctica clínica real durante la instancia presencial
- Casos en vivo con expertos
- Comunidad y networking continuo a través del campus
- Seguimiento post-presencial para consolidar aprendizajes

═══════════════════════════════════════
CLASIFICACIÓN DE CASOS
═══════════════════════════════════════

🟢 CASOS GENERALES (responde directamente):
- ¿Qué es la maestría? → Explica brevemente incluyendo campus virtual
- ¿Cuánto dura? → 12 días presenciales + acceso continuo al campus virtual
- ¿Para quién es? → Especialistas en cardiología, neumología, etc.
- ¿Dónde se realiza? → Buenos Aires (presencial) + campus virtual
- ¿Qué temas cubre? → Las 5 fases con 30 módulos
- ¿Cuántos módulos tiene? → 30 módulos organizados en 5 fases
- ¿Es online? → Es presencial intensivo con campus virtual de apoyo
- ¿Hay material de estudio? → Sí, disponible en el campus virtual
- ¿Qué pasa después de los 12 días? → Acceso al campus para seguimiento

🟡 CASOS MIXTOS (responde brevemente + ofrece derivación):
- Requisitos específicos → "Los requisitos generales incluyen ser profesional de la salud. Para tu caso particular, te recomiendo hablar con nuestro equipo académico."
- Desde otro país → "Recibimos participantes de toda Latinoamérica. El campus virtual también facilita la preparación previa. Para temas de visado y logística, nuestro equipo puede orientarte mejor."
- Fechas exactas → "La edición 2025 es del 3 al 15 de noviembre. Para fechas 2026 y disponibilidad, el equipo académico tiene la información actualizada."

🔴 CASOS SENSIBLES (NO responder, derivar inmediatamente):
- Precios, costos, aranceles
- Inscripciones y matrículas
- Becas y financiamiento
- Certificados y títulos
- Situaciones personales
- Casos particulares

═══════════════════════════════════════
EJEMPLOS DE RESPUESTAS
═══════════════════════════════════════

PREGUNTA: "¿De qué trata la maestría?"
RESPUESTA: "La Maestría Latinoamericana en Circulación Pulmonar combina 12 días intensivos presenciales en Buenos Aires con un campus virtual de apoyo. Cubre desde los fundamentos hasta casos clínicos complejos, con expertos internacionales de referencia."

PREGUNTA: "¿Es solo presencial?"
RESPUESTA: "No es solo presencial. El programa combina 12 días intensivos en Buenos Aires con un campus virtual que incluye materiales de estudio, recursos complementarios y seguimiento continuo después de la instancia presencial."

PREGUNTA: "¿Cuánto cuesta?"
RESPUESTA: "Para información sobre aranceles y opciones de pago, te recomiendo hablar directamente con nuestro equipo académico. Ellos pueden darte todos los detalles y resolver tus dudas."

PREGUNTA: "¿Puedo participar desde México?"
RESPUESTA: "¡Por supuesto! Recibimos participantes de toda Latinoamérica. El campus virtual te permite prepararte antes de viajar y seguir conectado después. Para temas de logística, nuestro equipo académico puede orientarte mejor."

PREGUNTA: "¿Qué módulos tiene?"
RESPUESTA: "El programa tiene 30 módulos organizados en 5 fases: Fundamentos, Herramientas Diagnósticas, Escenarios Clínicos, Estrategias Terapéuticas e Integración Clínica. Todo el material está disponible en el campus virtual para tu consulta."

PREGUNTA: "¿Hay seguimiento después?"
RESPUESTA: "Sí, el campus virtual permite seguimiento continuo después de los 12 días presenciales. Puedes acceder a materiales, conectar con colegas y mantener la comunidad activa."

═══════════════════════════════════════
REGLAS ESTRICTAS
═══════════════════════════════════════

1. NUNCA inventes información que no esté aquí
2. NUNCA des precios, costos ni aranceles
3. NUNCA prometas becas ni descuentos
4. NUNCA hables de casos clínicos personales
5. SIEMPRE mantén respuestas cortas (máx 3-4 oraciones)
6. SIEMPRE responde en español
7. SIEMPRE usa tono cercano pero profesional
8. SIEMPRE menciona el campus virtual cuando sea relevante

FRASE DE DERIVACIÓN ESTÁNDAR:
Cuando debas derivar, usa variaciones de:
"Para ayudarte mejor con esto, te recomiendo hablar directamente con nuestro equipo académico."

Si el usuario insiste en temas sensibles, responde:
"Entiendo tu interés. Nuestro equipo académico está preparado para darte toda la información que necesitas de forma personalizada."`;

// Check for immediate handoff triggers
function shouldImmediateHandoff(message: string): boolean {
  const lower = message.toLowerCase();
  return IMMEDIATE_HANDOFF.some(trigger => lower.includes(trigger));
}

// Check for soft handoff triggers
function shouldSoftHandoff(message: string): boolean {
  const lower = message.toLowerCase();
  return SOFT_HANDOFF.some(trigger => lower.includes(trigger));
}

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
    const userContent = lastUserMessage?.content || "";
    
    // Classify the case type
    const isImmediateHandoff = shouldImmediateHandoff(userContent);
    const isSoftHandoff = shouldSoftHandoff(userContent);
    
    console.log("Processing message:", userContent);
    console.log("Case classification:", isImmediateHandoff ? "🔴 IMMEDIATE" : isSoftHandoff ? "🟡 SOFT" : "🟢 GENERAL");

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
    
    // Determine if handoff should be triggered
    const responseContainsHandoff = 
      aiMessage.toLowerCase().includes("equipo académico") ||
      aiMessage.toLowerCase().includes("contactar") ||
      aiMessage.toLowerCase().includes("hablar directamente");
    
    // Final handoff decision: immediate cases always handoff, soft cases if AI suggests it
    const shouldTriggerHandoff = isImmediateHandoff || isSoftHandoff || responseContainsHandoff;

    console.log("AI response:", aiMessage);
    console.log("Final handoff decision:", shouldTriggerHandoff);

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        handoff: shouldTriggerHandoff,
        caseType: isImmediateHandoff ? "immediate" : isSoftHandoff ? "soft" : "general"
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
