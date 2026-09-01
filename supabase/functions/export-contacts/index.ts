import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const LOGO_URL =
  'https://tvgkinrbtnbtseooaiex.supabase.co/storage/v1/object/public/email-assets/logo-maestria.jpg'

const BodySchema = z.object({
  recipientEmail: z.string().email().max(255),
  ids: z.array(z.string().uuid()).max(500).optional(),
  note: z.string().max(1000).optional(),
})

const STATUS_LABEL: Record<string, string> = {
  nuevo: 'Nuevo',
  leido: 'Leído',
  respondido: 'Respondido',
  spam: 'Spam',
}

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })
}

interface Submission {
  id: string
  name: string
  email: string
  country: string
  specialty: string
  message: string
  status: string
  created_at: string
  cv_url: string | null
}

/** Institutional record card for a single submission. */
function recordHtml(s: Submission, index: number): string {
  const field = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 12px 6px 0;font-size:12px;color:#8890a4;white-space:nowrap;vertical-align:top;width:130px;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#1a1a2e;vertical-align:top;">${value}</td>
    </tr>`

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e6e9f5;border-radius:12px;margin:0 0 16px;">
    <tr>
      <td style="background:#f4f6fd;padding:12px 18px;border-radius:12px 12px 0 0;border-bottom:1px solid #e6e9f5;">
        <span style="font-size:12px;font-weight:700;color:#213ECC;">REGISTRO #${index}</span>
        <span style="float:right;font-size:11px;color:#8890a4;">${escapeHtml(fmtDate(s.created_at))}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 18px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${field('Nombre', escapeHtml(s.name))}
          ${field('Email', `<a href="mailto:${escapeHtml(s.email)}" style="color:#213ECC;text-decoration:none;">${escapeHtml(s.email)}</a>`)}
          ${field('País', escapeHtml(s.country))}
          ${field('Especialidad', escapeHtml(s.specialty))}
          ${field('Estado', escapeHtml(STATUS_LABEL[s.status] ?? s.status))}
          ${field('Currículum', s.cv_url ? 'Adjuntó CV (disponible en el panel de administración)' : 'No adjuntó')}
          ${field('Mensaje', `<span style="white-space:pre-line;line-height:1.6;">${escapeHtml(s.message)}</span>`)}
        </table>
      </td>
    </tr>
  </table>`
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

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
    const { recipientEmail, ids, note } = parsed.data

    let query = supabase
      .from('contact_submissions')
      .select('id,name,email,country,specialty,message,status,created_at,cv_url')
      .order('created_at', { ascending: false })
      .limit(500)
    if (ids && ids.length > 0) query = query.in('id', ids)

    const { data: rows, error: rowsError } = await query
    if (rowsError) throw rowsError

    const submissions = (rows ?? []) as Submission[]
    if (submissions.length === 0) {
      return new Response(JSON.stringify({ error: 'No hay envíos para exportar' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const counts = submissions.reduce<Record<string, number>>((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    }, {})
    const summary = Object.entries(counts)
      .map(([k, v]) => `${STATUS_LABEL[k] ?? k}: <strong>${v}</strong>`)
      .join(' &nbsp;·&nbsp; ')

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f2f8;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(33,62,204,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#213ECC 0%,#1a32a8 100%);padding:28px 32px;text-align:center;">
            <img src="${LOGO_URL}" alt="MLCP" width="64" height="64" style="border-radius:12px;border:2px solid rgba(255,255,255,0.3);display:block;margin:0 auto 12px;" />
            <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0;">Maestría en Circulación Pulmonar</h1>
            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:6px 0 0;">Reporte de Envíos de Contacto</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 8px;">
            <p style="font-size:13px;color:#555;margin:0 0 6px;">Generado el ${escapeHtml(fmtDate(new Date().toISOString()))}</p>
            <p style="font-size:13px;color:#1a1a2e;margin:0 0 6px;">Total de envíos: <strong>${submissions.length}</strong></p>
            <p style="font-size:12px;color:#555;margin:0;">${summary}</p>
            ${note ? `<div style="margin-top:16px;padding:14px 16px;background:#f0f4ff;border-left:4px solid #CE2020;border-radius:10px;font-size:13px;color:#333;white-space:pre-line;">${escapeHtml(note)}</div>` : ''}
            <div style="border-top:1px solid #eef0f5;margin:20px 0 4px;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 24px;">
            ${submissions.map((s, i) => recordHtml(s, i + 1)).join('')}
          </td>
        </tr>
        <tr>
          <td style="background:#f8f9fc;padding:16px 32px;text-align:center;border-top:1px solid #eef0f5;">
            <p style="font-size:11px;color:#a0a8c0;margin:0;">Documento interno · © ${new Date().getFullYear()} Maestría en Circulación Pulmonar</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'Maestría en Circulación Pulmonar <contacto@maestriacp.com>',
        to: [recipientEmail],
        subject: `Reporte de Envíos de Contacto — ${submissions.length} registros`,
        html,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`Resend gateway error [${response.status}]: ${errorBody}`)
      return new Response(
        JSON.stringify({ error: 'No se pudo enviar el reporte', status: response.status, details: errorBody }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    return new Response(JSON.stringify({ success: true, count: submissions.length, id: data?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('export-contacts error:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
