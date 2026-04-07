import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const LOGO_URL = 'https://tvgkinrbtnbtseooaiex.supabase.co/storage/v1/object/public/email-assets/logo-maestria.jpg'

const BodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  country: z.string().min(1).max(100),
  specialty: z.string().min(1).max(100),
  message: z.string().min(1).max(2000),
  adminEmail: z.string().email().max(255),
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured')

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')

    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { name, email, country, specialty, message, adminEmail } = parsed.data

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeCountry = escapeHtml(country)
    const safeSpecialty = escapeHtml(specialty)
    const safeMessage = escapeHtml(message)

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'Contacto MLCP <contacto@maestriacp.com>',
        reply_to: email,
        to: [adminEmail],
        subject: `Nueva consulta de ${safeName} — Maestría en Circulación Pulmonar`,
        html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f2f8;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(33,62,204,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#213ECC 0%,#1a32a8 100%);padding:28px 32px;text-align:center;">
            <img src="${LOGO_URL}" alt="MLCP" width="64" height="64" style="border-radius:12px;border:2px solid rgba(255,255,255,0.3);display:block;margin:0 auto 12px;" />
            <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;letter-spacing:-0.3px;">Nueva Consulta Recibida</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0;">Maestría en Circulación Pulmonar</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <!-- Info cards -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 12px;background:#f8f9fc;border-radius:10px;margin-bottom:8px;" colspan="2">
                  <p style="font-size:11px;color:#8890a4;margin:0 0 2px;text-transform:uppercase;letter-spacing:0.5px;">Nombre</p>
                  <p style="font-size:15px;color:#1a1a2e;margin:0;font-weight:600;">${safeName}</p>
                </td>
              </tr>
              <tr><td height="8" colspan="2"></td></tr>
              <tr>
                <td style="padding:10px 12px;background:#f8f9fc;border-radius:10px;" width="50%">
                  <p style="font-size:11px;color:#8890a4;margin:0 0 2px;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
                  <p style="font-size:14px;color:#213ECC;margin:0;font-weight:600;">${safeEmail}</p>
                </td>
                <td width="8"></td>
                <td style="padding:10px 12px;background:#f8f9fc;border-radius:10px;" width="50%">
                  <p style="font-size:11px;color:#8890a4;margin:0 0 2px;text-transform:uppercase;letter-spacing:0.5px;">País</p>
                  <p style="font-size:14px;color:#1a1a2e;margin:0;font-weight:600;">${safeCountry}</p>
                </td>
              </tr>
              <tr><td height="8" colspan="2"></td></tr>
              <tr>
                <td style="padding:10px 12px;background:#f8f9fc;border-radius:10px;" colspan="2">
                  <p style="font-size:11px;color:#8890a4;margin:0 0 2px;text-transform:uppercase;letter-spacing:0.5px;">Especialidad</p>
                  <p style="font-size:14px;color:#1a1a2e;margin:0;font-weight:600;">${safeSpecialty}</p>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <div style="margin-top:20px;padding:16px 18px;background:linear-gradient(135deg,#f0f4ff 0%,#eef1fb 100%);border-radius:12px;border-left:4px solid #213ECC;">
              <p style="font-size:11px;color:#8890a4;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">Mensaje</p>
              <p style="font-size:14px;color:#333;margin:0;line-height:1.6;">${safeMessage}</p>
            </div>

            <!-- Tip -->
            <p style="font-size:12px;color:#8890a4;margin:20px 0 0;text-align:center;">
              💡 Puedes responder directamente a este correo para contactar a ${safeName}.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fc;padding:16px 32px;text-align:center;border-top:1px solid #eef0f5;">
            <p style="font-size:11px;color:#a0a8c0;margin:0;">© ${new Date().getFullYear()} Maestría en Circulación Pulmonar · Todos los derechos reservados</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
        `,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Resend API error [${response.status}]: ${JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error sending contact email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
