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

type StatutRelais = "actif" | "suspendu" | "en_attente"

type PointRelais = {
  id: string
  nomBoutique: string
  responsable: string
  telephone: string
  commune: string
  quartier: string
  horaires: string
  capacite: number
  colisEnStock: number
  colisExpires: number
  fraisExpires: number
  revenus: number
  statut: StatutRelais
}

const pointsRelaisData: PointRelais[] = [
  {
    id: "PR-001",
    nomBoutique: "Boutique Chez Adjoua",
    responsable: "Adjoua Kouassi",
    telephone: "+225 07 12 34 56",
    commune: "Cocody",
    quartier: "Angré",
    horaires: "08h–20h",
    capacite: 50,
    colisEnStock: 12,
    colisExpires: 2,
    fraisExpires: 4000,
    revenus: 185000,
    statut: "actif",
  },
  {
    id: "PR-002",
    nomBoutique: "Service Express Yopougon",
    responsable: "Konan Yao",
    telephone: "+225 05 98 76 54",
    commune: "Yopougon",
    quartier: "Niangon Nord",
    horaires: "07h30–21h",
    capacite: 80,
    colisEnStock: 34,
    colisExpires: 5,
    fraisExpires: 10000,
    revenus: 312000,
    statut: "actif",
  },
  {
    id: "PR-003",
    nomBoutique: "Livraison Pro Abobo",
    responsable: "Traoré Mamadou",
    telephone: "+225 01 23 45 67",
    commune: "Abobo",
    quartier: "PK 18",
    horaires: "08h–19h",
    capacite: 60,
    colisEnStock: 7,
    colisExpires: 0,
    fraisExpires: 0,
    revenus: 98000,
    statut: "actif",
  },
  {
    id: "PR-004",
    nomBoutique: "Point Colis Marcory",
    responsable: "N'Goran Prisca",
    telephone: "+225 07 65 43 21",
    commune: "Marcory",
    quartier: "Résidentiel",
    horaires: "09h–18h",
    capacite: 40,
    colisEnStock: 0,
    colisExpires: 8,
    fraisExpires: 16000,
    revenus: 45000,
    statut: "suspendu",
  },
  {
    id: "PR-005",
    nomBoutique: "Transit Koumassi",
    responsable: "Bamba Issouf",
    telephone: "+225 05 11 22 33",
    commune: "Koumassi",
    quartier: "Zone 4",
    horaires: "08h–20h30",
    capacite: 70,
    colisEnStock: 21,
    colisExpires: 1,
    fraisExpires: 2000,
    revenus: 214000,
    statut: "actif",
  },
  {
    id: "PR-006",
    nomBoutique: "Dépôt Central Plateau",
    responsable: "Diallo Fatoumata",
    telephone: "+225 07 44 55 66",
    commune: "Plateau",
    quartier: "Centre",
    horaires: "07h–22h",
    capacite: 100,
    colisEnStock: 58,
    colisExpires: 3,
    fraisExpires: 6000,
    revenus: 520000,
    statut: "actif",
  },
  {
    id: "PR-007",
    nomBoutique: "Point Livraison Adjamé",
    responsable: "Ouattara Seydou",
    telephone: "+225 01 77 88 99",
    commune: "Adjamé",
    quartier: "Liberty",
    horaires: "08h–20h",
    capacite: 55,
    colisEnStock: 0,
    colisExpires: 0,
    fraisExpires: 0,
    revenus: 0,
    statut: "en_attente",
  },
  {
    id: "PR-008",
    nomBoutique: "Relais Attecoubé",
    responsable: "Coulibaly Mariam",
    telephone: "+225 05 33 44 55",
    commune: "Attecoubé",
    quartier: "Washington",
    horaires: "08h–19h30",
    capacite: 45,
    colisEnStock: 9,
    colisExpires: 4,
    fraisExpires: 8000,
    revenus: 76000,
    statut: "actif",
  },
]

const statutConfig = {
  actif: { label: "Actif", className: "bg-green-600/10 text-green-600" },
  suspendu: { label: "Suspendu", className: "bg-red-600/10 text-red-600" },
  en_attente: { label: "En attente", className: "bg-orange-600/10 text-orange-600" },
}

export default function PointsRelaisView() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const totalActifs = pointsRelaisData.filter((p) => p.statut === "actif").length
  const totalColisEnStock = pointsRelaisData.reduce((s, p) => s + p.colisEnStock, 0)
  const totalColisExpires = pointsRelaisData.reduce((s, p) => s + p.colisExpires, 0)
  const totalRevenus = pointsRelaisData.reduce((s, p) => s + p.revenus, 0)

  const columns: ColumnDef<PointRelais>[] = React.useMemo(
    () => [
      {
        accessorKey: "nomBoutique",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom boutique
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("nomBoutique")}</div>
            <div className="text-xs text-muted-foreground">{row.original.id}</div>
          </div>
        ),
      },
      {
        accessorKey: "responsable",
        header: "Responsable",
        cell: ({ row }) => (
          <div>
            <div>{row.getValue("responsable")}</div>
            <div className="text-xs text-muted-foreground">{row.original.telephone}</div>
          </div>
        ),
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
        accessorKey: "quartier",
        header: "Quartier",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.getValue("quartier")}</span>
        ),
      },
      {
        accessorKey: "horaires",
        header: "Horaires",
        cell: ({ row }) => (
          <span className="text-sm">{row.getValue("horaires")}</span>
        ),
      },
      {
        accessorKey: "colisEnStock",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Colis en stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const stock = row.getValue("colisEnStock") as number
          const expires = row.original.colisExpires
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{stock}</span>
              {expires > 0 && (
                <span className="text-xs text-red-600">
                  {expires} expiré(s) — {row.original.fraisExpires.toLocaleString("fr-FR")} FCFA
                </span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "revenus",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Revenus (FCFA)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {(row.getValue("revenus") as number).toLocaleString("fr-FR")}
          </span>
        ),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
          const statut = row.getValue("statut") as StatutRelais
          const cfg = statutConfig[statut]
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
        enableHiding: false,
        cell: ({ row }) => {
          const point = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" type="button">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/points-relais/${point.id}`)}>
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem>Voir les colis</DropdownMenuItem>
                <DropdownMenuItem>Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                {point.statut === "actif" ? (
                  <DropdownMenuItem className="text-destructive">Suspendre</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-green-600">Activer</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [router]
  )

  const table = useReactTable({
    data: pointsRelaisData,
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
      <div>
        <div className="text-2xl font-semibold tracking-tight">Points relais</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Gestion et suivi de tous les points relais du réseau
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Points relais actifs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {totalActifs}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+4%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Réseau en expansion <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">sur {pointsRelaisData.length} au total</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Colis en stock total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {totalColisEnStock}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+11%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Volume soutenu <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">dans tous les points relais</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Colis expirés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {totalColisExpires}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-rose-500 text-white">
                <IconTrendingUp className="text-white" />+3
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-rose-300">
              À traiter rapidement <IconTrendingDown className="size-4" />
            </div>
            <div className="text-white/60">nécessitent une action</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Revenus relais ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {totalRevenus.toLocaleString("fr-FR")}
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+9%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Croissance mensuelle <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Avril 2026</div>
          </CardFooter>
        </Card>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder="Rechercher un point relais..."
            value={(table.getColumn("nomBoutique")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("nomBoutique")?.setFilterValue(e.target.value)}
            className="max-w-sm"
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
                .map((col) => (
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
          <div className="min-w-[900px]">
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
            {table.getFilteredRowModel().rows.length} point(s) relais
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
