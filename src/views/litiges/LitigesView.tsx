"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
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
  type VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

type StatutLitige = "ouvert" | "en_enquete" | "resolu" | "rejete"
type Motif =
  | "Colis abîmé"
  | "Colis non reçu"
  | "Erreur de livraison"
  | "Comportement prestataire"
  | "Frais incorrect"
  | "Article manquant"

type Litige = {
  id: string
  commandeId: string
  client: string
  clientTel: string
  prestataire: string
  motif: Motif
  montantConteste: number
  statut: StatutLitige
  dateOuverture: string
  derniereMaj: string
  piecesJointes: number
}

import litigesMockData from "@/data/mock/litiges.json"

const litigesData: Litige[] = litigesMockData as Litige[]

const statutConfig: Record<StatutLitige, { label: string; className: string }> = {
  ouvert: { label: "Ouvert", className: "bg-orange-600/10 text-orange-600" },
  en_enquete: { label: "En enquête", className: "bg-blue-600/10 text-blue-600" },
  resolu: { label: "Résolu", className: "bg-green-600/10 text-green-600" },
  rejete: { label: "Rejeté", className: "bg-red-600/10 text-red-600" },
}

export default function LitigesView() {
  const router = useRouter()
  const [data, setData] = React.useState<Litige[]>(litigesData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statutFilter, setStatutFilter] = React.useState<string>("tous")
  const [motifFilter, setMotifFilter] = React.useState<string>("tous")
  const [globalFilter, setGlobalFilter] = React.useState("")

  const filteredData = React.useMemo(() => {
    return data.filter((l) => {
      if (statutFilter !== "tous" && l.statut !== statutFilter) return false
      if (motifFilter !== "tous" && l.motif !== motifFilter) return false
      return true
    })
  }, [data, statutFilter, motifFilter])

  const kpis = React.useMemo(() => ({
    ouverts: data.filter((l) => l.statut === "ouvert").length,
    enquetes: data.filter((l) => l.statut === "en_enquete").length,
    resolusMois: data.filter((l) => l.statut === "resolu").length,
    montantConteste: data
      .filter((l) => l.statut === "ouvert" || l.statut === "en_enquete")
      .reduce((s, l) => s + l.montantConteste, 0),
  }), [data])

  const motifs: ("tous" | Motif)[] = [
    "tous",
    "Colis abîmé",
    "Colis non reçu",
    "Erreur de livraison",
    "Comportement prestataire",
    "Frais incorrect",
    "Article manquant",
  ]

  const columns: ColumnDef<Litige>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ID litige <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "commandeId",
      header: "Commande",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">{row.getValue("commandeId")}</span>
      ),
    },
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("client")}</div>
          <div className="text-xs text-muted-foreground">{row.original.clientTel}</div>
        </div>
      ),
    },
    {
      accessorKey: "prestataire",
      header: "Prestataire",
      cell: ({ row }) => <span className="text-sm">{row.getValue("prestataire")}</span>,
    },
    {
      accessorKey: "motif",
      header: "Motif",
      cell: ({ row }) => <span className="text-sm">{row.getValue("motif")}</span>,
    },
    {
      accessorKey: "montantConteste",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant (FCFA) <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const m = row.getValue("montantConteste") as number
        return (
          <span className="font-medium tabular-nums">
            {m === 0 ? "—" : m.toLocaleString("fr-FR")}
          </span>
        )
      },
    },
    {
      accessorKey: "piecesJointes",
      header: "PJ",
      cell: ({ row }) => {
        const n = row.getValue("piecesJointes") as number
        return n > 0 ? (
          <Badge variant="outline" className="text-xs">{n}</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const s = row.getValue("statut") as StatutLitige
        const cfg = statutConfig[s]
        return (
          <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
            {cfg.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "dateOuverture",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ouvert le <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const d = new Date(row.getValue("dateOuverture") as string)
        return (
          <span className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(d)}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const litige = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" type="button">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/litiges/${litige.id}`)}>
                Voir le dossier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(litige.commandeId)}
              >
                Copier l&apos;ID commande
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {litige.statut === "ouvert" && (
                <DropdownMenuItem
                  onClick={() =>
                    setData((prev) =>
                      prev.map((l) =>
                        l.id === litige.id ? { ...l, statut: "en_enquete" } : l
                      )
                    )
                  }
                  className="text-blue-600"
                >
                  Ouvrir une enquête
                </DropdownMenuItem>
              )}
              {(litige.statut === "ouvert" || litige.statut === "en_enquete") && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      setData((prev) =>
                        prev.map((l) =>
                          l.id === litige.id ? { ...l, statut: "resolu" } : l
                        )
                      )
                    }
                    className="text-green-600"
                  >
                    Approuver remboursement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setData((prev) =>
                        prev.map((l) =>
                          l.id === litige.id ? { ...l, statut: "rejete" } : l
                        )
                      )
                    }
                    className="text-red-600"
                  >
                    Rejeter le litige
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [router])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 8 } },
  })

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Litiges &amp; réclamations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestion des contestations et incidents de livraison
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Litiges ouverts</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{kpis.ouverts}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-amber-500 text-white">
                <AlertTriangle className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">à traiter</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">En enquête</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{kpis.enquetes}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-sky-500 text-white">
                <Search className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">enquêtes en cours</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Résolus ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{kpis.resolusMois}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <CheckCircle className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">Avril 2026</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Montant contesté</CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums text-white">
              {kpis.montantConteste.toLocaleString("fr-FR")}
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-rose-500 text-white">
                <XCircle className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">en attente de décision</div>
          </CardFooter>
        </Card>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="flex flex-wrap items-center gap-3 py-4">
          <Input
            placeholder="Rechercher (client, commande, prestataire)..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="ouvert">Ouvert</SelectItem>
              <SelectItem value="en_enquete">En enquête</SelectItem>
              <SelectItem value="resolu">Résolu</SelectItem>
              <SelectItem value="rejete">Rejeté</SelectItem>
            </SelectContent>
          </Select>
          <Select value={motifFilter} onValueChange={setMotifFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Motif" />
            </SelectTrigger>
            <SelectContent>
              {motifs.map((m) => (
                <SelectItem key={m} value={m}>
                  {m === "tous" ? "Tous les motifs" : m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((c) => c.getCanHide()).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[1100px]">
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
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/litiges/${row.original.id}`)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} onClick={(e) => {
                          if (cell.column.id === "actions") e.stopPropagation()
                        }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Aucun litige.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredRowModel().rows.length} litige(s)
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium whitespace-nowrap">Lignes par page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 8, 10, 20].map((s) => (
                    <SelectItem key={s} value={`${s}`}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </div>
  )
}
