"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
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

type StatutCommande = "en_cours" | "livree" | "annulee"
type ModeLivraison = "domicile" | "relais"
type StatutPaiement = "collecte" | "a_collecter"
type VehiculeId = "moto" | "tricycle" | "camionette" | "repas"
type TypeColis = "documents" | "petit" | "moyen" | "gros" | "nourriture"
type Urgence = "urgent" | "detendu" | "trois-heures"

type Commande = {
  id: string
  client: string
  clientTel: string
  prestataire: string
  prestataireTel: string
  modeLivraison: ModeLivraison
  pointRelais: string | null
  commune: string
  vehicule: VehiculeId
  typeColis: TypeColis
  urgence: Urgence
  montant: number
  paiement: StatutPaiement
  statut: StatutCommande
  date: string
}

import commandesMockData from "@/data/mock/commandes.json"

const commandesData: Commande[] = commandesMockData as Commande[]

const statutConfig = {
  en_cours: { label: "En cours", className: "bg-blue-600/10 text-blue-600" },
  livree: { label: "Livrée", className: "bg-green-600/10 text-green-600" },
  annulee: { label: "Annulée", className: "bg-red-600/10 text-red-600" },
}

const paiementConfig = {
  collecte: { label: "Collecté", className: "bg-green-600/10 text-green-600" },
  a_collecter: { label: "À collecter", className: "bg-orange-600/10 text-orange-600" },
}

const modeConfig = {
  domicile: { label: "Domicile", className: "bg-purple-600/10 text-purple-600" },
  relais: { label: "Relais", className: "bg-cyan-600/10 text-cyan-600" },
}

const statutOptions = [
  { value: "en_cours", label: "En cours" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
]

export default function CommandesView() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const today = "2026-04-25"
  const commandesDuJour = commandesData.filter((c) => c.date === today).length
  const enCours = commandesData.filter((c) => c.statut === "en_cours").length
  const livreesMois = commandesData.filter((c) => c.statut === "livree").length
  const annuleesMois = commandesData.filter((c) => c.statut === "annulee").length

  const columns: ColumnDef<Commande>[] = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">{row.getValue("id")}</span>
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
        cell: ({ row }) => (
          <div>
            <div>{row.getValue("prestataire")}</div>
            <div className="text-xs text-muted-foreground">{row.original.prestataireTel}</div>
          </div>
        ),
      },
      {
        accessorKey: "modeLivraison",
        header: "Mode livraison",
        cell: ({ row }) => {
          const mode = row.getValue("modeLivraison") as ModeLivraison
          const cfg = modeConfig[mode]
          return (
            <div className="flex flex-col gap-0.5">
              <Badge variant="outline" className={`border-none rounded-sm w-fit ${cfg.className}`}>
                {cfg.label}
              </Badge>
              {row.original.pointRelais && (
                <span className="text-xs text-muted-foreground truncate max-w-[140px]" title={row.original.pointRelais}>
                  {row.original.pointRelais}
                </span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "commune",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Commune
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <span>{row.getValue("commune")}</span>,
      },
      {
        accessorKey: "montant",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Montant (FCFA)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {(row.getValue("montant") as number).toLocaleString("fr-FR")}
          </span>
        ),
      },
      {
        accessorKey: "paiement",
        header: "Paiement",
        cell: ({ row }) => {
          const p = row.getValue("paiement") as StatutPaiement
          const cfg = paiementConfig[p]
          return (
            <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
              {cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
          const s = row.getValue("statut") as StatutCommande
          const cfg = statutConfig[s]
          return (
            <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
              {cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const d = new Date(row.getValue("date") as string)
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
          const cmd = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" type="button">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(cmd.id)}
                >
                  Copier l&apos;ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/commandes/${cmd.id}`)}>
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  Forcer le statut
                </DropdownMenuLabel>
                {statutOptions
                  .filter((o) => o.value !== cmd.statut)
                  .map((o) => (
                    <DropdownMenuItem key={o.value}>
                      → {o.label}
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Annuler la commande
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [router]
  )

  const table = useReactTable({
    data: commandesData,
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
        <div className="text-2xl font-semibold tracking-tight">Commandes</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Suivi et gestion de toutes les commandes de la plateforme
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Commandes du jour</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {commandesDuJour}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+12%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Activité en hausse <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">aujourd&apos;hui, 25 avr. 2026</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">En cours</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {enCours}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-sky-500 text-white">
                <IconTrendingUp className="text-white" />+5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-sky-300">
              File active <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">en attente de livraison</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Livrées ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {livreesMois}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+18%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Bon mois <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Avril 2026</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Annulées ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {annuleesMois}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-rose-500 text-white">
                <IconTrendingDown className="text-white" />-4%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-rose-300">
              En baisse <IconTrendingDown className="size-4" />
            </div>
            <div className="text-white/60">Avril 2026</div>
          </CardFooter>
        </Card>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder="Rechercher par ID, client, prestataire, commune..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-md"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => {
                  const labels: Record<string, string> = {
                    id: "ID",
                    client: "Client",
                    prestataire: "Prestataire",
                    modeLivraison: "Mode livraison",
                    commune: "Commune",
                    montant: "Montant",
                    paiement: "Paiement",
                    statut: "Statut",
                    date: "Date",
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={col.getIsVisible()}
                      onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    >
                      {labels[col.id] || col.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[950px]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredRowModel().rows.length} commande(s)
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
                  {[5, 8, 10, 20, 50].map((s) => (
                    <SelectItem key={s} value={`${s}`}>
                      {s}
                    </SelectItem>
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
