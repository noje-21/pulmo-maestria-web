import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const LOGO_URL = 'https://tvgkinrbtnbtseooaiex.supabase.co/storage/v1/object/public/email-assets/logo-maestria.jpg'

const BodySchema = z.object({
  recipientEmail: z.string().email().max(255),
  recipientName: z.string().min(1).max(100),
  replyMessage: z.string().min(1).max(5000),
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

    // Verify admin auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { check_user_id: user.id })
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { recipientEmail, recipientName, replyMessage } = parsed.data
    const safeName = escapeHtml(recipientName)
    const safeMessage = escapeHtml(replyMessage)

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'Maestría en Circulación Pulmonar <contacto@maestriacp.com>',
        reply_to: 'magisterenhipertensionpulmonar@gmail.com',
        to: [recipientEmail],
        subject: `Respuesta a tu consulta — Maestría en Circulación Pulmonar`,
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
            <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;letter-spacing:-0.3px;">Maestría en Circulación Pulmonar</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0;">Respuesta a tu consulta</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <h2 style="font-size:18px;color:#1a1a2e;margin:0 0 16px;font-weight:600;">
              Hola ${safeName},
            </h2>
            <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 20px;">
              Gracias por tu interés en la Maestría en Circulación Pulmonar. A continuación, nuestra respuesta a tu consulta:
            </p>

            <!-- Reply message -->
            <div style="padding:18px 20px;background:linear-gradient(135deg,#f0f4ff 0%,#eef1fb 100%);border-radius:12px;border-left:4px solid #213ECC;">
              <p style="font-size:14px;color:#333;margin:0;line-height:1.7;white-space:pre-line;">${safeMessage}</p>
            </div>

            <p style="font-size:14px;color:#555;line-height:1.6;margin:20px 0 0;">
              Si tienes alguna otra pregunta, no dudes en responder a este correo.
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 32px;">
            <div style="border-top:1px solid #eef0f5;"></div>
          </td>
        </tr>

        <!-- Team signature -->
        <tr>
          <td style="padding:20px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:14px;vertical-align:middle;">
                  <img src="${LOGO_URL}" alt="MLCP" width="40" height="40" style="border-radius:10px;" />
                </td>
                <td style="vertical-align:middle;">
                  <p style="font-size:13px;color:#1a1a2e;margin:0;font-weight:600;">Equipo Académico</p>
                  <p style="font-size:12px;color:#8890a4;margin:2px 0 0;">Maestría en Circulación Pulmonar</p>
                </td>
              </tr>
            </table>
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
    console.error('Error sending reply email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
