"use client"

import * as React from "react"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
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
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { WeeklySalesChart } from "@/components/charts/weekly-sales-chart"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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

type Commande = {
  id: string
  client: string
  livreur: string
  commune: string
  mode: "Domicile" | "Relais"
  montant: string
  statut: "en_cours" | "livree" | "annulee" | "en_attente"
  date: string
}

const commandesData: Commande[] = [
  { id: "XYV-1042", client: "Konan Yao", livreur: "Diabaté Moussa", commune: "Cocody", mode: "Domicile", montant: "1 500 FCFA", statut: "livree", date: "2026-04-26" },
  { id: "XYV-1041", client: "Adjoua Kouassi", livreur: "Koffi Serge", commune: "Plateau", mode: "Relais", montant: "3 500 FCFA", statut: "en_cours", date: "2026-04-26" },
  { id: "XYV-1040", client: "Aya Traoré", livreur: "Touré Ismail", commune: "Yopougon", mode: "Domicile", montant: "8 000 FCFA", statut: "en_attente", date: "2026-04-26" },
  { id: "XYV-1039", client: "Bamba Issouf", livreur: "N'Guessan Paul", commune: "Abobo", mode: "Domicile", montant: "2 100 FCFA", statut: "livree", date: "2026-04-25" },
  { id: "XYV-1038", client: "Fatou Diallo", livreur: "Coulibaly Lamine", commune: "Marcory", mode: "Relais", montant: "1 620 FCFA", statut: "annulee", date: "2026-04-25" },
  { id: "XYV-1037", client: "Kouadio Marc", livreur: "Diabaté Moussa", commune: "Adjamé", mode: "Domicile", montant: "4 900 FCFA", statut: "livree", date: "2026-04-25" },
  { id: "XYV-1036", client: "N'Guessan Prisca", livreur: "Koffi Serge", commune: "Treichville", mode: "Relais", montant: "1 350 FCFA", statut: "en_cours", date: "2026-04-24" },
  { id: "XYV-1035", client: "Ouattara Seydou", livreur: "Touré Ismail", commune: "Koumassi", mode: "Domicile", montant: "11 200 FCFA", statut: "livree", date: "2026-04-24" },
]


export default function DashboardView() {
  const [data] = React.useState<Commande[]>(commandesData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<Commande>[] = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Tout sélectionner"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Sélectionner"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          N° <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => <span>{row.getValue("client")}</span>,
    },
    {
      accessorKey: "livreur",
      header: "Livreur",
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("livreur")}</span>,
    },
    {
      accessorKey: "commune",
      header: "Commune",
      cell: ({ row }) => <span>{row.getValue("commune")}</span>,
    },
    {
      accessorKey: "mode",
      header: "Mode",
      cell: ({ row }) => {
        const mode = row.getValue("mode") as string
        return (
          <Badge variant="outline" className={mode === "Domicile" ? "text-blue-600 border-blue-200" : "text-purple-600 border-purple-200"}>
            {mode}
          </Badge>
        )
      },
    },
    {
      accessorKey: "montant",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue("montant")}</span>,
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.getValue("statut") as string
        const cfg: Record<string, { label: string; cls: string }> = {
          livree:     { label: "Livrée",     cls: "bg-green-600/10 text-green-600" },
          en_cours:   { label: "En cours",   cls: "bg-blue-600/10 text-blue-600" },
          en_attente: { label: "En attente", cls: "bg-orange-600/10 text-orange-600" },
          annulee:    { label: "Annulée",    cls: "bg-red-600/10 text-red-600" },
        }
        const { label, cls } = cfg[statut] ?? { label: statut, cls: "" }
        return <Badge variant="outline" className={`border-none rounded-sm ${cls}`}>{label}</Badge>
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const d = new Date(row.getValue("date"))
        return <span>{new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d)}</span>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copier l'ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
            <DropdownMenuItem>Forcer le statut</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Annuler la commande</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 5 } },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  const now = new Date()
  const greeting = getGreeting(now)
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  }).format(now)

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">{greeting}, Superadmin!</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Voyons ce que nous avons pour vous aujourd&apos;hui {formattedDate}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Commandes du jour</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">87</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+12.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">74 livrées · 8 en cours</div>
          </CardFooter>
        </Card>

        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Livraisons en cours</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">42</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-sky-500 text-white">
                Actives
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">28 livreurs mobilisés</div>
          </CardFooter>
        </Card>

        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">CA du jour</CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums text-white">
              312 500
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+18%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">Frais de livraison collectés</div>
          </CardFooter>
        </Card>

        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Litiges ouverts</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">7</CardTitle>
            <CardAction>
              <AlertTriangle className="h-4 w-4 text-white/80" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">3 nouveaux aujourd&apos;hui</div>
          </CardFooter>
        </Card>
      </div>

      {/* Chart commandes — pleine largeur */}
      <WeeklySalesChart />

      {/* Table dernières commandes */}
      <div>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Rechercher une commande..."
              value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn("id")?.setFilterValue(e.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Colonnes <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => {
                  const labels: Record<string, string> = {
                    id: "N°", client: "Client", livreur: "Livreur", commune: "Commune",
                    mode: "Mode", montant: "Montant", statut: "Statut", date: "Date",
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(!!v)}
                    >
                      {labels[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-x-auto rounded-md border bg-white">
            <div className="min-w-[800px]">
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
              {table.getFilteredSelectedRowModel().rows.length} sur{" "}
              {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium whitespace-nowrap">Lignes par page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(v) => table.setPageSize(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 50].map((s) => (
                      <SelectItem key={s} value={`${s}`}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium whitespace-nowrap">
                  Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getGreeting(date: Date) {
  const h = date.getHours()
  if (h < 12) return "Bonjour"
  if (h < 18) return "Bon après-midi"
  return "Bonsoir"
}
