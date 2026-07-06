import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  country: z.string().trim().min(1).max(100),
  specialty: z.string().trim().min(1).max(100),
  message: z.string().trim().min(10).max(2000),
  cvPath: z.string().max(500).nullable().optional(),
  turnstileToken: z.string().max(2048).optional(),
})

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
  // If Turnstile is not configured, skip verification (rate limit still applies).
  if (!secret) return true
  if (!token) return false
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  form.append('remoteip', ip)
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const json = await r.json().catch(() => ({ success: false }))
  return !!json.success
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const { name, email, country, specialty, message, cvPath, turnstileToken } = parsed.data

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      'unknown'

    // Turnstile (optional — only enforced if TURNSTILE_SECRET_KEY is set)
    const turnstileOk = await verifyTurnstile(turnstileToken, ip)
    if (!turnstileOk) {
      return new Response(JSON.stringify({ error: 'Validación anti-spam fallida.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Rate limit (5/h por IP, 3/h por email)
    const { data: rl, error: rlErr } = await supabase.rpc('check_contact_rate_limit', {
      _ip: ip,
      _email: email,
    })
    if (rlErr) throw rlErr
    if (rl && (rl as { allowed?: boolean }).allowed === false) {
      return new Response(
        JSON.stringify({
          error: 'Has enviado demasiados mensajes recientemente. Intenta nuevamente más tarde.',
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { error: insertErr } = await supabase.from('contact_submissions').insert([
      { name, email, country, specialty, message, cv_url: cvPath ?? null },
    ])
    if (insertErr) throw insertErr

    // Best-effort notification email
    try {
      await supabase.functions.invoke('send-contact-email', {
        body: {
          name,
          email,
          country,
          specialty,
          message,
          cvPath: cvPath ?? null,
          adminEmail: 'magisterenhipertensionpulmonar@gmail.com',
        },
      })
    } catch {
      // ignore
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('submit-contact error:', e)
    return new Response(JSON.stringify({ error: 'Error procesando la solicitud.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})