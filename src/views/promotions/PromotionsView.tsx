"use client"

import * as React from "react"
import {
  Plus,
  Tag,
  Percent,
  TrendingUp,
  Calendar,
  Users,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit,
} from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type StatutPromo = "actif" | "expire" | "epuise" | "planifie"
type TypePromo = "pourcentage" | "montant"
type CiblePromo = "tous" | "nouveaux" | "fidels" | "livreurs"

type CodePromo = {
  id: string
  code: string
  type: TypePromo
  valeur: number
  cible: CiblePromo
  utilisations: number
  utilisationsMax: number | null
  dateDebut: string
  dateFin: string
  statut: StatutPromo
}

const promosData: CodePromo[] = [
  {
    id: "PRM-001",
    code: "BIENVENUE20",
    type: "pourcentage",
    valeur: 20,
    cible: "nouveaux",
    utilisations: 124,
    utilisationsMax: 500,
    dateDebut: "2026-04-01",
    dateFin: "2026-05-31",
    statut: "actif",
  },
  {
    id: "PRM-002",
    code: "RAMADAN15",
    type: "pourcentage",
    valeur: 15,
    cible: "tous",
    utilisations: 458,
    utilisationsMax: 1000,
    dateDebut: "2026-03-15",
    dateFin: "2026-04-30",
    statut: "actif",
  },
  {
    id: "PRM-003",
    code: "FCFA1000",
    type: "montant",
    valeur: 1000,
    cible: "fidels",
    utilisations: 67,
    utilisationsMax: 200,
    dateDebut: "2026-04-10",
    dateFin: "2026-05-10",
    statut: "actif",
  },
  {
    id: "PRM-004",
    code: "LIVREUR2X",
    type: "pourcentage",
    valeur: 100,
    cible: "livreurs",
    utilisations: 89,
    utilisationsMax: null,
    dateDebut: "2026-04-15",
    dateFin: "2026-04-30",
    statut: "actif",
  },
  {
    id: "PRM-005",
    code: "MAI2026",
    type: "pourcentage",
    valeur: 10,
    cible: "tous",
    utilisations: 0,
    utilisationsMax: 2000,
    dateDebut: "2026-05-01",
    dateFin: "2026-05-31",
    statut: "planifie",
  },
  {
    id: "PRM-006",
    code: "PAQUES25",
    type: "pourcentage",
    valeur: 25,
    cible: "tous",
    utilisations: 200,
    utilisationsMax: 200,
    dateDebut: "2026-03-25",
    dateFin: "2026-04-15",
    statut: "epuise",
  },
  {
    id: "PRM-007",
    code: "MARS500",
    type: "montant",
    valeur: 500,
    cible: "nouveaux",
    utilisations: 312,
    utilisationsMax: 500,
    dateDebut: "2026-03-01",
    dateFin: "2026-03-31",
    statut: "expire",
  },
]

const statutConfig: Record<StatutPromo, { label: string; className: string }> = {
  actif: { label: "Actif", className: "bg-green-600/10 text-green-600" },
  expire: { label: "Expiré", className: "bg-muted text-muted-foreground" },
  epuise: { label: "Épuisé", className: "bg-orange-600/10 text-orange-600" },
  planifie: { label: "Planifié", className: "bg-blue-600/10 text-blue-600" },
}

const cibleLabel: Record<CiblePromo, string> = {
  tous: "Tous les clients",
  nouveaux: "Nouveaux clients",
  fidels: "Clients fidèles",
  livreurs: "Livreurs",
}

export default function PromotionsView() {
  const [data, setData] = React.useState<CodePromo[]>(promosData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [statutFilter, setStatutFilter] = React.useState<string>("tous")
  const [openCreate, setOpenCreate] = React.useState(false)
  const [form, setForm] = React.useState({
    code: "",
    type: "pourcentage" as TypePromo,
    valeur: "",
    cible: "tous" as CiblePromo,
    utilisationsMax: "",
    dateDebut: "",
    dateFin: "",
  })

  const filteredData = React.useMemo(() => {
    return data.filter((p) => {
      if (statutFilter !== "tous" && p.statut !== statutFilter) return false
      return true
    })
  }, [data, statutFilter])

  const kpis = React.useMemo(() => {
    const actifs = data.filter((p) => p.statut === "actif")
    const utilisationsTotales = data.reduce((s, p) => s + p.utilisations, 0)
    return {
      actifs: actifs.length,
      total: data.length,
      utilisations: utilisationsTotales,
      planifies: data.filter((p) => p.statut === "planifie").length,
    }
  }, [data])

  const columns: ColumnDef<CodePromo>[] = React.useMemo(() => [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-sm">{row.getValue("code")}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => navigator.clipboard.writeText(row.original.code)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Réduction",
      cell: ({ row }) => {
        const t = row.getValue("type") as TypePromo
        const v = row.original.valeur
        return (
          <span className="font-medium">
            {t === "pourcentage" ? `${v}%` : `${v.toLocaleString("fr-FR")} FCFA`}
          </span>
        )
      },
    },
    {
      accessorKey: "cible",
      header: "Cible",
      cell: ({ row }) => (
        <span className="text-sm">{cibleLabel[row.getValue("cible") as CiblePromo]}</span>
      ),
    },
    {
      accessorKey: "utilisations",
      header: "Utilisations",
      cell: ({ row }) => {
        const u = row.original.utilisations
        const max = row.original.utilisationsMax
        const pct = max ? (u / max) * 100 : 0
        return (
          <div className="space-y-1">
            <div className="text-sm tabular-nums">
              {u.toLocaleString("fr-FR")} {max ? `/ ${max.toLocaleString("fr-FR")}` : "/ ∞"}
            </div>
            {max && (
              <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${pct >= 100 ? "bg-orange-500" : "bg-blue-500"}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "dateFin",
      header: "Période",
      cell: ({ row }) => {
        const debut = new Date(row.original.dateDebut)
        const fin = new Date(row.original.dateFin)
        const fmt = (d: Date) =>
          new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(d)
        return (
          <span className="text-xs text-muted-foreground">
            {fmt(debut)} → {fmt(fin)}
          </span>
        )
      },
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const s = row.getValue("statut") as StatutPromo
        const cfg = statutConfig[s]
        return (
          <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
            {cfg.label}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const promo = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(promo.code)}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copier le code
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setData((prev) => prev.filter((p) => p.id !== promo.id))}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 8 } },
  })

  function handleCreate() {
    if (!form.code || !form.valeur || !form.dateDebut || !form.dateFin) return
    const nouveau: CodePromo = {
      id: `PRM-${String(data.length + 1).padStart(3, "0")}`,
      code: form.code.toUpperCase(),
      type: form.type,
      valeur: Number(form.valeur),
      cible: form.cible,
      utilisations: 0,
      utilisationsMax: form.utilisationsMax ? Number(form.utilisationsMax) : null,
      dateDebut: form.dateDebut,
      dateFin: form.dateFin,
      statut: "planifie",
    }
    setData((prev) => [nouveau, ...prev])
    setForm({
      code: "",
      type: "pourcentage",
      valeur: "",
      cible: "tous",
      utilisationsMax: "",
      dateDebut: "",
      dateFin: "",
    })
    setOpenCreate(false)
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Codes promo et campagnes de réduction
          </p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un code promo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Nouveau code promo</DialogTitle>
              <DialogDescription>
                Configurez votre code promo et ses paramètres
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Code</Label>
                <Input
                  placeholder="EX: SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm({ ...form, type: v as TypePromo })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pourcentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="montant">Montant (FCFA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Valeur</Label>
                  <Input
                    type="number"
                    placeholder={form.type === "pourcentage" ? "20" : "1000"}
                    value={form.valeur}
                    onChange={(e) => setForm({ ...form, valeur: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Cible</Label>
                <Select
                  value={form.cible}
                  onValueChange={(v) => setForm({ ...form, cible: v as CiblePromo })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les clients</SelectItem>
                    <SelectItem value="nouveaux">Nouveaux clients</SelectItem>
                    <SelectItem value="fidels">Clients fidèles</SelectItem>
                    <SelectItem value="livreurs">Livreurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Limite d&apos;utilisation (optionnelle)</Label>
                <Input
                  type="number"
                  placeholder="Illimité si vide"
                  value={form.utilisationsMax}
                  onChange={(e) => setForm({ ...form, utilisationsMax: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Date début</Label>
                  <Input
                    type="date"
                    value={form.dateDebut}
                    onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date fin</Label>
                  <Input
                    type="date"
                    value={form.dateFin}
                    onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Codes actifs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{kpis.actifs}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <Tag className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">en circulation</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Utilisations totales</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.utilisations.toLocaleString("fr-FR")}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-sky-500 text-white">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">tous codes confondus</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Codes planifiés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{kpis.planifies}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-violet-500 text-white">
                <Calendar className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">à venir</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Total créés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{kpis.total}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-white/20 text-white">
                <Percent className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">historique complet</div>
          </CardFooter>
        </Card>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="flex flex-wrap items-center gap-3 py-4">
          <Input
            placeholder="Rechercher un code..."
            value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("code")?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="planifie">Planifié</SelectItem>
              <SelectItem value="epuise">Épuisé</SelectItem>
              <SelectItem value="expire">Expiré</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun code promo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredRowModel().rows.length} code(s)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
