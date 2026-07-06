import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Minimal typed shim: supabase.auth.oauth is a beta namespace not yet in types.
type OAuthNs = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
};
const oauth = (): OAuthNs => (supabase.auth as unknown as { oauth: OAuthNs }).oauth;

function ConsentBody({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-primary/90 to-accent">
      <Card className="w-full max-w-md card-base bg-card/95 backdrop-blur-xl shadow-2xl">
        {children}
      </Card>
    </main>
  );
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Falta el parámetro authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const res = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (res.error) {
      setBusy(false);
      return setError(res.error.message);
    }
    const target = res.data?.redirect_url ?? res.data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("El servidor de autorización no devolvió una URL de redirección.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <ConsentBody>
        <CardHeader>
          <CardTitle>No pudimos cargar esta autorización</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </ConsentBody>
    );
  }

  if (!details) {
    return (
      <ConsentBody>
        <CardHeader>
          <CardTitle>Cargando…</CardTitle>
          <CardDescription>Preparando la solicitud de acceso.</CardDescription>
        </CardHeader>
      </ConsentBody>
    );
  }

  const clientName = details.client?.name ?? "una aplicación externa";

  return (
    <ConsentBody>
      <CardHeader>
        <CardTitle>Conectar {clientName} a tu cuenta</CardTitle>
        <CardDescription>
          Esta app podrá usar las herramientas habilitadas del Campus de la Maestría en tu nombre.
          No se saltan las políticas de acceso ni los permisos existentes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p><strong>Aplicación:</strong> {clientName}</p>
          {details.client?.redirect_uri && (
            <p className="truncate"><strong>Redirección:</strong> {details.client.redirect_uri}</p>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <Button disabled={busy} onClick={() => decide(true)} className="flex-1 btn-accent">
            Aprobar
          </Button>
          <Button
            disabled={busy}
            onClick={() => decide(false)}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </ConsentBody>
  );
}