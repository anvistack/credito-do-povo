import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase, type Lead, type Agente } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Loader2, Search, RefreshCw, Trash2, Eye, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { formatBRL } from "@/lib/utils-lead";
import { downloadCsv, leadsToCsv } from "@/lib/csv";
import { ImportLeadsDialog } from "@/components/admin/ImportLeadsDialog";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin · Dashboard — Crédito do Povo" }, { name: "robots", content: "noindex" }],
  }),
  component: DashboardPage,
});

const STATUS_OPTIONS = ["novo", "contatado", "qualificado", "convertido", "descartado"] as const;

function statusVariant(s?: string): "default" | "secondary" | "destructive" | "outline" {
  switch (s) {
    case "convertido":
      return "default";
    case "descartado":
      return "destructive";
    case "qualificado":
    case "contatado":
      return "secondary";
    default:
      return "outline";
  }
}

type PendingChange = {
  lead: Lead;
  newStatus: string;
};

function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [toDelete, setToDelete] = useState<Lead | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [agenteEscolhido, setAgenteEscolhido] = useState<string>("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Erro ao carregar leads", { description: error.message });
      return;
    }
    setLeads((data as Lead[]) ?? []);
  };

  const fetchAgentes = async () => {
    const { data } = await supabase
      .from("agentes")
      .select("*")
      .eq("ativo", true)
      .order("nome", { ascending: true });
    setAgentes((data as Agente[]) ?? []);
  };

  useEffect(() => {
    fetchLeads();
    fetchAgentes();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "todos" && (l.status ?? "novo") !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        l.nome?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.whatsapp?.toLowerCase().includes(q) ||
        l.cpf?.toLowerCase().includes(q) ||
        l.cidade?.toLowerCase().includes(q) ||
        l.agente?.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const novos = leads.filter((l) => (l.status ?? "novo") === "novo").length;
    const convertidos = leads.filter((l) => l.status === "convertido").length;
    const totalValor = leads.reduce((acc, l) => acc + (Number(l.valor_pretendido) || 0), 0);
    return { total, novos, convertidos, totalValor };
  }, [leads]);

  const requestStatusChange = (lead: Lead, newStatus: string) => {
    if ((lead.status ?? "novo") === newStatus) return;
    setAgenteEscolhido(lead.agente ?? "");
    setPending({ lead, newStatus });
  };

  const confirmStatusChange = async () => {
    if (!pending) return;
    if (!agenteEscolhido) {
      toast.error("Selecione o agente responsável");
      return;
    }
    const { lead, newStatus } = pending;
    setSavingStatus(true);
    const prev = { status: lead.status, agente: lead.agente };
    setLeads((all) =>
      all.map((l) =>
        l.id === lead.id ? { ...l, status: newStatus, agente: agenteEscolhido } : l
      )
    );
    const { error } = await supabase
      .from("leads")
      .update({
        status: newStatus,
        agente: agenteEscolhido,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);
    setSavingStatus(false);
    if (error) {
      setLeads((all) => all.map((l) => (l.id === lead.id ? { ...l, ...prev } : l)));
      toast.error("Falha ao atualizar status", { description: error.message });
      return;
    }
    toast.success("Status atualizado");
    setPending(null);
    setAgenteEscolhido("");
  };

  const deleteLead = async (lead: Lead) => {
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) {
      toast.error("Falha ao excluir", { description: error.message });
      return;
    }
    setLeads((all) => all.filter((l) => l.id !== lead.id));
    toast.success("Lead excluído");
    setToDelete(null);
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("Nenhum lead para exportar");
      return;
    }
    const csv = leadsToCsv(filtered);
    const ts = new Date().toISOString().slice(0, 10);
    downloadCsv(`leads-${ts}.csv`, csv);
    toast.success(`${filtered.length} lead(s) exportado(s)`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie todas as solicitações recebidas pelo formulário do site.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Novos" value={stats.novos} />
        <StatCard label="Convertidos" value={stats.convertidos} />
        <StatCard label="Valor pretendido" value={formatBRL(stats.totalValor)} />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, telefone, CPF, cidade, agente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setImportOpen(true)} disabled={loading}>
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
            <Button variant="outline" onClick={exportCsv} disabled={loading || filtered.length === 0}>
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={fetchLeads} disabled={loading}>
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Nenhum lead encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">WhatsApp</TableHead>
                  <TableHead className="hidden lg:table-cell">Cidade/UF</TableHead>
                  <TableHead className="hidden lg:table-cell">Serviço</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Agente</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{l.nome}</div>
                      <div className="text-xs text-muted-foreground">{l.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{l.whatsapp}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {l.cidade}/{l.estado}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{l.servico}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatBRL(Number(l.valor_pretendido) || 0)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={l.status ?? "novo"}
                        onValueChange={(v) => requestStatusChange(l, v)}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue>
                            <Badge variant={statusVariant(l.status ?? "novo")}>
                              {l.status ?? "novo"}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {l.agente ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setSelected(l)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setToDelete(l)}
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

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.nome}</DialogTitle>
            <DialogDescription>
              Recebido em{" "}
              {selected ? new Date(selected.created_at).toLocaleString("pt-BR") : ""}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="CPF" value={selected.cpf} />
              <Field label="Nascimento" value={selected.data_nascimento} />
              <Field label="Idade" value={`${selected.idade} (${selected.faixa_etaria})`} />
              <Field label="WhatsApp" value={selected.whatsapp} />
              <Field label="E-mail" value={selected.email} className="col-span-2" />
              <Field label="Cidade/UF" value={`${selected.cidade}/${selected.estado}`} />
              <Field label="Como conheceu" value={selected.como_conheceu} />
              <Field label="Serviço" value={selected.servico} />
              <Field label="Perfil" value={selected.perfil} />
              <Field label="Agente" value={selected.agente ?? "—"} />
              <Field
                label="Valor pretendido"
                value={formatBRL(Number(selected.valor_pretendido) || 0)}
                className="col-span-2"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status change with agent selection */}
      <Dialog
        open={!!pending}
        onOpenChange={(o) => {
          if (!o) {
            setPending(null);
            setAgenteEscolhido("");
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Atribuir agente</DialogTitle>
            <DialogDescription>
              Quem está alterando o status de{" "}
              <span className="font-medium text-foreground">{pending?.lead.nome}</span> para{" "}
              <Badge variant={statusVariant(pending?.newStatus)}>{pending?.newStatus}</Badge>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {agentes.length === 0 ? (
              <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                Nenhum agente ativo cadastrado. Cadastre em <strong>Agentes</strong>.
              </div>
            ) : (
              <Select value={agenteEscolhido} onValueChange={setAgenteEscolhido}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um agente" />
                </SelectTrigger>
                <SelectContent>
                  {agentes.map((a) => (
                    <SelectItem key={a.id} value={a.nome}>
                      {a.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPending(null);
                setAgenteEscolhido("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={confirmStatusChange} disabled={savingStatus || !agenteEscolhido}>
              {savingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O lead {toDelete?.nome} será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && deleteLead(toDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImportLeadsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={fetchLeads}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
