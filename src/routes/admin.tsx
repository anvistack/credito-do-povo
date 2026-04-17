import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Loader2, BarChart3, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginRoute) {
      navigate({ to: "/admin/login" });
    }
    if (user && isLoginRoute) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [user, loading, isLoginRoute, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login route renders standalone
  if (isLoginRoute) {
    return <Outlet />;
  }

  // Block protected content while redirecting
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span>Crédito do Povo · Admin</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                to="/admin/dashboard"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-muted text-foreground font-medium" }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  Leads
                </span>
              </Link>
              <Link
                to="/admin/relatorios"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-muted text-foreground font-medium" }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Relatórios
                </span>
              </Link>
              <Link
                to="/admin/agentes"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-muted text-foreground font-medium" }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Agentes
                </span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate({ to: "/admin/login" });
              }}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}
