"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Star,
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
import { Checkbox } from "@/components/ui/checkbox"
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

// ── Types ──────────────────────────────────────────────────────────────────

type LivreurStatut = "actif" | "suspendu"
type Vehicule = "Moto" | "Voiture" | "Vélo"

type Livreur = {
  id: string
  nom: string
  telephone: string
  commune: string
  vehicule: Vehicule
  courses: number
  note: number
  revenus: number
  tauxAcceptation: number
  statut: LivreurStatut
}

// ── Mock data ──────────────────────────────────────────────────────────────

const livreursData: Livreur[] = [
  {
    id: "LIV-001",
    nom: "Bamba Issouf",
    telephone: "+225 01 45 67 89",
    commune: "Yopougon",
    vehicule: "Moto",
    courses: 312,
    note: 4.8,
    revenus: 1_240_000,
    tauxAcceptation: 94,
    statut: "actif",
  },
  {
    id: "LIV-002",
    nom: "Fatou Diallo",
    telephone: "+225 07 23 45 67",
    commune: "Marcory",
    vehicule: "Moto",
    courses: 287,
    note: 4.6,
    revenus: 1_050_000,
    tauxAcceptation: 91,
    statut: "actif",
  },
  {
    id: "LIV-003",
    nom: "Kouadio Marc-André",
    telephone: "+225 05 12 34 56",
    commune: "Plateau",
    vehicule: "Voiture",
    courses: 198,
    note: 4.7,
    revenus: 980_000,
    tauxAcceptation: 88,
    statut: "actif",
  },
  {
    id: "LIV-004",
    nom: "Fofana Seydou",
    telephone: "+225 01 99 00 11",
    commune: "Plateau",
    vehicule: "Moto",
    courses: 156,
    note: 4.5,
    revenus: 620_000,
    tauxAcceptation: 85,
    statut: "actif",
  },
  {
    id: "LIV-005",
    nom: "Touré Ibrahim",
    telephone: "+225 01 77 88 99",
    commune: "Cocody",
    vehicule: "Voiture",
    courses: 143,
    note: 4.9,
    revenus: 870_000,
    tauxAcceptation: 97,
    statut: "actif",
  },
  {
    id: "LIV-006",
    nom: "Diomandé Lassana",
    telephone: "+225 05 44 55 66",
    commune: "Abobo",
    vehicule: "Moto",
    courses: 89,
    note: 3.9,
    revenus: 340_000,
    tauxAcceptation: 72,
    statut: "actif",
  },
  {
    id: "LIV-007",
    nom: "N'Guessan Kouamé",
    telephone: "+225 05 34 56 78",
    commune: "Adjamé",
    vehicule: "Moto",
    courses: 201,
    note: 3.5,
    revenus: 450_000,
    tauxAcceptation: 58,
    statut: "suspendu",
  },
  {
    id: "LIV-008",
    nom: "Koné Moussa",
    telephone: "+225 07 33 44 55",
    commune: "Adjamé",
    vehicule: "Moto",
    courses: 67,
    note: 4.2,
    revenus: 270_000,
    tauxAcceptation: 79,
    statut: "actif",
  },
  {
    id: "LIV-009",
    nom: "Ouédraogo Adama",
    telephone: "+225 07 22 33 44",
    commune: "Treichville",
    vehicule: "Vélo",
    courses: 44,
    note: 4.0,
    revenus: 110_000,
    tauxAcceptation: 68,
    statut: "suspendu",
  },
  {
    id: "LIV-010",
    nom: "Bah Mamadou",
    telephone: "+225 05 66 77 88",
    commune: "Marcory",
    vehicule: "Vélo",
    courses: 78,
    note: 4.3,
    revenus: 195_000,
    tauxAcceptation: 83,
    statut: "actif",
  },
]

// ── Star rating helper ─────────────────────────────────────────────────────

function StarRating({ note }: { note: number }) {
  const full = Math.floor(note)
  const half = note - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      ))}
      {half && (
        <Star key="h" className="h-3.5 w-3.5 fill-yellow-200 text-yellow-400" />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className="h-3.5 w-3.5 text-gray-300" />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{note.toFixed(1)}</span>
    </div>
  )
}

// ── Main view ──────────────────────────────────────────────────────────────

export default function LivreursView() {
  const router = useRouter()
  const [data, setData] = React.useState<Livreur[]>(livreursData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statutFilter, setStatutFilter] = React.useState<string>("tous")
  const [communeFilter, setCommuneFilter] = React.useState<string>("toutes")
  const [vehiculeFilter, setVehiculeFilter] = React.useState<string>("tous")

  const filteredData = React.useMemo(() => {
    return data.filter((l) => {
      if (statutFilter !== "tous" && l.statut !== statutFilter) return false
      if (communeFilter !== "toutes" && l.commune !== communeFilter) return false
      if (vehiculeFilter !== "tous" && l.vehicule !== vehiculeFilter) return false
      return true
    })
  }, [data, statutFilter, communeFilter, vehiculeFilter])

  const kpis = React.useMemo(() => {
    const actifs = data.filter((l) => l.statut === "actif")
    const suspendus = data.filter((l) => l.statut === "suspendu")
    const coursesJour = actifs.reduce((sum, l) => sum + Math.floor(l.courses / 30), 0)
    const revenusMois = actifs.reduce((sum, l) => sum + l.revenus, 0)
    return {
      actifs: actifs.length,
      suspendus: suspendus.length,
      coursesJour,
      revenusMois,
    }
  }, [data])

  const communes = ["toutes", ...Array.from(new Set(data.map((l) => l.commune))).sort()]
  const vehicules: ("tous" | Vehicule)[] = ["tous", "Moto", "Voiture", "Vélo"]

  const columns: ColumnDef<Livreur>[] = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Tout sélectionner"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Sélectionner la ligne"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nom",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("nom")}</span>,
    },
    {
      accessorKey: "telephone",
      header: () => <div>Tél</div>,
      cell: ({ row }) => <span className="text-sm">{row.getValue("telephone")}</span>,
    },
    {
      accessorKey: "commune",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Commune <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue("commune")}</span>,
    },
    {
      accessorKey: "vehicule",
      header: () => <div>Véhicule</div>,
      cell: ({ row }) => <span className="text-sm">{row.getValue("vehicule")}</span>,
    },
    {
      accessorKey: "courses",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Courses <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">{(row.getValue("courses") as number).toLocaleString("fr-FR")}</span>
      ),
    },
    {
      accessorKey: "note",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Note <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <StarRating note={row.getValue("note")} />,
    },
    {
      accessorKey: "revenus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Revenus (FCFA) <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {(row.getValue("revenus") as number).toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      accessorKey: "tauxAcceptation",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Taux accept. <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const taux = row.getValue("tauxAcceptation") as number
        const color =
          taux >= 90
            ? "text-green-600"
            : taux >= 75
            ? "text-amber-600"
            : "text-red-600"
        return <span className={`font-medium tabular-nums ${color}`}>{taux}%</span>
      },
    },
    {
      accessorKey: "statut",
      header: () => <div>Statut</div>,
      cell: ({ row }) => {
        const statut = row.getValue("statut") as LivreurStatut
        return (
          <Badge
            variant="outline"
            className={`border-none rounded-sm ${
              statut === "actif"
                ? "bg-green-600/10 text-green-600"
                : "bg-red-600/10 text-red-600"
            }`}
          >
            {statut === "actif" ? "Actif" : "Suspendu"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const livreur = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                type="button"
                aria-label="Actions"
              >
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/livreurs/${livreur.id}`)}>
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem>Modifier les zones</DropdownMenuItem>
              <DropdownMenuItem>Voir les courses</DropdownMenuItem>
              <DropdownMenuSeparator />
              {livreur.statut === "actif" ? (
                <DropdownMenuItem
                  onClick={() =>
                    setData((prev) =>
                      prev.map((l) =>
                        l.id === livreur.id ? { ...l, statut: "suspendu" } : l
                      )
                    )
                  }
                  className="text-amber-600"
                >
                  Suspendre
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    setData((prev) =>
                      prev.map((l) =>
                        l.id === livreur.id ? { ...l, statut: "actif" } : l
                      )
                    )
                  }
                  className="text-green-600"
                >
                  Réactiver
                </DropdownMenuItem>
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
    initialState: { pagination: { pageSize: 8 } },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div>
        <div className="text-2xl font-semibold tracking-tight">Livreurs</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Gérez les livreurs actifs et leurs performances
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Livreurs actifs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.actifs}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+6%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              En hausse <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">En service actuellement</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Livreurs suspendus</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.suspendus}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-rose-500 text-white">
                <IconTrendingDown className="text-white" />-3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-rose-300">
              En baisse <IconTrendingDown className="size-4" />
            </div>
            <div className="text-white/60">Comptes désactivés</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Courses du jour</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.coursesJour}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+9.4%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Activité soutenue <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Estimé (moy. mensuelle / 30)</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Revenus ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.revenusMois.toLocaleString("fr-FR")}
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+14%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Croissance solide <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Total livreurs actifs</div>
          </CardFooter>
        </Card>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 py-4">
          <Input
            placeholder="Rechercher un livreur..."
            value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("nom")?.setFilterValue(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="suspendu">Suspendu</SelectItem>
            </SelectContent>
          </Select>
          <Select value={communeFilter} onValueChange={setCommuneFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Commune" />
            </SelectTrigger>
            <SelectContent>
              {communes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "toutes" ? "Toutes les communes" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={vehiculeFilter} onValueChange={setVehiculeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Véhicule" />
            </SelectTrigger>
            <SelectContent>
              {vehicules.map((v) => (
                <SelectItem key={v} value={v}>
                  {v === "tous" ? "Tous les véhicules" : v}
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
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => {
                  const labels: Record<string, string> = {
                    nom: "Nom",
                    telephone: "Tél",
                    commune: "Commune",
                    vehicule: "Véhicule",
                    courses: "Courses",
                    note: "Note",
                    revenus: "Revenus",
                    tauxAcceptation: "Taux accept.",
                    statut: "Statut",
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={col.getIsVisible()}
                      onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    >
                      {labels[col.id] ?? col.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto rounded-md border bg-white">
          <div className="min-w-[1000px]">
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

        {/* Pagination */}
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
                  {[5, 8, 10, 20].map((s) => (
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
    </div>
  )
}
