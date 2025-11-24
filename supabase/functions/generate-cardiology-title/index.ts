import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "No se proporcionó imagen" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY no está configurada");
    }

    // Llamar a Lovable AI para analizar la imagen y generar título
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Eres un experto en cardiología y circulación pulmonar. Tu tarea es analizar imágenes médicas, educativas o promocionales relacionadas con cardiología y generar un título profesional y académico en español.

El título debe:
- Ser conciso (máximo 60 caracteres)
- Usar terminología médica correcta
- Ser apropiado para contenido académico
- Relacionarse con circulación pulmonar, cardiología, hemodinamia, o temas relacionados
- NO incluir comillas ni puntuación final

Ejemplos de títulos apropiados:
- "Evaluación Hemodinámica Avanzada"
- "Técnicas de Cateterismo Derecho"
- "Fisiopatología de la Circulación Pulmonar"
- "Diagnóstico por Imagen en Cardiología"
- "Monitorización Cardiorrespiratoria en UCI"
- "Hipertensión Pulmonar: Diagnóstico y Manejo"
- "Ecocardiografía Transesofágica"
- "Metodología de Investigación Clínica"

Responde SOLO con el título, sin explicaciones adicionales.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analiza esta imagen y genera un título cardiológico apropiado:"
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Fondos insuficientes en Lovable AI" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Error al comunicarse con AI gateway");
    }

    const data = await response.json();
    const title = data.choices?.[0]?.message?.content?.trim() || "Imagen Cardiológica";

    // Limpiar el título
    const cleanTitle = title
      .replace(/^["']|["']$/g, '') // Eliminar comillas
      .replace(/[.!?]$/, '') // Eliminar puntuación final
      .substring(0, 60); // Limitar a 60 caracteres

    return new Response(
      JSON.stringify({ title: cleanTitle }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error desconocido",
        title: "Imagen Cardiológica" // Título por defecto en caso de error
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
