import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Agente } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/agentes")({
  head: () => ({
    meta: [
      { title: "Admin · Agentes — Crédito do Povo" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentesPage,
});

function AgentesPage() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Agente> | null>(null);
  const [toDelete, setToDelete] = useState<Agente | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAgentes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("agentes")
      .select("*")
      .order("nome", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Erro ao carregar agentes", { description: error.message });
      return;
    }
    setAgentes((data as Agente[]) ?? []);
  };

  useEffect(() => {
    fetchAgentes();
  }, []);

  const save = async () => {
    if (!editing) return;
    const nome = (editing.nome ?? "").trim();
    if (!nome) {
      toast.error("Informe o nome do agente");
      return;
    }
    setSaving(true);
    const payload = {
      nome,
      email: editing.email?.trim() || null,
      ativo: editing.ativo ?? true,
      updated_at: new Date().toISOString(),
    };
    const { error } = editing.id
      ? await supabase.from("agentes").update(payload).eq("id", editing.id)
      : await supabase.from("agentes").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Falha ao salvar", { description: error.message });
      return;
    }
    toast.success(editing.id ? "Agente atualizado" : "Agente criado");
    setEditing(null);
    fetchAgentes();
  };

  const toggleAtivo = async (a: Agente, ativo: boolean) => {
    setAgentes((all) => all.map((x) => (x.id === a.id ? { ...x, ativo } : x)));
    const { error } = await supabase
      .from("agentes")
      .update({ ativo, updated_at: new Date().toISOString() })
      .eq("id", a.id);
    if (error) {
      setAgentes((all) => all.map((x) => (x.id === a.id ? { ...x, ativo: !ativo } : x)));
      toast.error("Falha ao atualizar", { description: error.message });
    }
  };

  const remove = async (a: Agente) => {
    const { error } = await supabase.from("agentes").delete().eq("id", a.id);
    if (error) {
      toast.error("Falha ao excluir", { description: error.message });
      return;
    }
    setAgentes((all) => all.filter((x) => x.id !== a.id));
    setToDelete(null);
    toast.success("Agente excluído");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agentes de crédito</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre os agentes que poderão ser atribuídos aos leads.
          </p>
        </div>
        <Button onClick={() => setEditing({ ativo: true })}>
          <Plus className="h-4 w-4" />
          Novo agente
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : agentes.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Nenhum agente cadastrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">E-mail</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentes.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {a.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={a.ativo}
                        onCheckedChange={(v) => toggleAtivo(a, v)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setToDelete(a)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar agente" : "Novo agente"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  value={editing.nome ?? ""}
                  onChange={(e) => setEditing({ ...editing, nome: e.target.value })}
                  placeholder="Ex.: Maria Silva"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">E-mail (opcional)</label>
                <Input
                  type="email"
                  value={editing.email ?? ""}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  placeholder="agente@empresa.com"
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="text-sm font-medium">Ativo</div>
                  <div className="text-xs text-muted-foreground">
                    Agentes inativos não aparecem ao atribuir leads.
                  </div>
                </div>
                <Switch
                  checked={editing.ativo ?? true}
                  onCheckedChange={(v) => setEditing({ ...editing, ativo: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agente?</AlertDialogTitle>
            <AlertDialogDescription>
              Os leads já atribuídos a {toDelete?.nome} permanecerão com o nome registrado,
              mas o agente não estará mais disponível para novas atribuições.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && remove(toDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
