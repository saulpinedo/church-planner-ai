import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-md px-5 py-16 sm:px-8">
          <LoginForm searchParams={searchParams} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin";
  const error = params.error;

  async function loginWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <p className="text-sm text-muted-foreground">Acceso de administrador</p>
        <h1 className="text-balance text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl">
          Inicia sesión con Google.
        </h1>
        <p className="text-base text-muted-foreground">
          Solo los correos autorizados pueden crear y editar actividades.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error === "AccessDenied"
            ? "Tu cuenta de Google no está en la lista de administradores. Contacta al admin del sistema si crees que debería estar."
            : "Hubo un error al iniciar sesión. Intentá de nuevo."}
        </div>
      ) : null}

      <form action={loginWithGoogle}>
        <Button type="submit" size="lg" className="w-full">
          Continuar con Google
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground/70">
        Al continuar, autorizás a Church Planner a leer y editar eventos en tu
        Google Calendar.
      </p>
    </div>
  );
}