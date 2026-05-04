"use client"

import * as React from "react"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  FileCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ── Types ──────────────────────────────────────────────────────────────────

type DocumentStatut = "complet" | "incomplet"
type DemandeStatut = "en_attente" | "approuve" | "rejete"

type DemandelivreurRaw = {
  id: string
  nom: string
  telephone: string
  commune: string
  vehicule: string
  documents: DocumentStatut
  dateDemandeRaw: string
  statut: DemandeStatut
}

type DemandeRelaisRaw = {
  id: string
  nomBoutique: string
  responsable: string
  commune: string
  quartier: string
  horaires: string
  dateDemandeRaw: string
  statut: DemandeStatut
}

// ── Mock data ──────────────────────────────────────────────────────────────

const livreursData: DemandelivreurRaw[] = [
  {
    id: "DLV-001",
    nom: "Kouassi Arnaud",
    telephone: "+225 07 11 22 33",
    commune: "Yopougon",
    vehicule: "Moto",
    documents: "complet",
    dateDemandeRaw: "2026-04-22",
    statut: "en_attente",
  },
  {
    id: "DLV-002",
    nom: "Diomandé Lassana",
    telephone: "+225 05 44 55 66",
    commune: "Abobo",
    vehicule: "Moto",
    documents: "incomplet",
    dateDemandeRaw: "2026-04-21",
    statut: "en_attente",
  },
  {
    id: "DLV-003",
    nom: "Touré Ibrahim",
    telephone: "+225 01 77 88 99",
    commune: "Cocody",
    vehicule: "Voiture",
    documents: "complet",
    dateDemandeRaw: "2026-04-20",
    statut: "en_attente",
  },
  {
    id: "DLV-004",
    nom: "Koné Moussa",
    telephone: "+225 07 33 44 55",
    commune: "Adjamé",
    vehicule: "Moto",
    documents: "complet",
    dateDemandeRaw: "2026-04-19",
    statut: "en_attente",
  },
  {
    id: "DLV-005",
    nom: "Bah Mamadou",
    telephone: "+225 05 66 77 88",
    commune: "Marcory",
    vehicule: "Vélo",
    documents: "incomplet",
    dateDemandeRaw: "2026-04-18",
    statut: "en_attente",
  },
  {
    id: "DLV-006",
    nom: "Fofana Seydou",
    telephone: "+225 01 99 00 11",
    commune: "Plateau",
    vehicule: "Moto",
    documents: "complet",
    dateDemandeRaw: "2026-04-10",
    statut: "approuve",
  },
  {
    id: "DLV-007",
    nom: "Ouédraogo Adama",
    telephone: "+225 07 22 33 44",
    commune: "Treichville",
    vehicule: "Moto",
    documents: "incomplet",
    dateDemandeRaw: "2026-04-08",
    statut: "rejete",
  },
]

const relaisData: DemandeRelaisRaw[] = [
  {
    id: "DRL-001",
    nomBoutique: "Chez Mariama Express",
    responsable: "Mariama Bah",
    commune: "Yopougon",
    quartier: "Selmer",
    horaires: "Lun–Sam 08h–20h",
    dateDemandeRaw: "2026-04-23",
    statut: "en_attente",
  },
  {
    id: "DRL-002",
    nomBoutique: "Superette du Plateau",
    responsable: "N'Zi Kouakou",
    commune: "Plateau",
    quartier: "Avenue Noguès",
    horaires: "Lun–Ven 09h–18h",
    dateDemandeRaw: "2026-04-22",
    statut: "en_attente",
  },
  {
    id: "DRL-003",
    nomBoutique: "Kiosque Cocody Village",
    responsable: "Ahou Bléyou",
    commune: "Cocody",
    quartier: "Riviera 2",
    horaires: "Lun–Dim 07h–22h",
    dateDemandeRaw: "2026-04-21",
    statut: "en_attente",
  },
  {
    id: "DRL-004",
    nomBoutique: "Boutique Treichville Sud",
    responsable: "Coulibaly Sekou",
    commune: "Treichville",
    quartier: "Rue 12",
    horaires: "Lun–Sam 08h–19h",
    dateDemandeRaw: "2026-04-20",
    statut: "en_attente",
  },
  {
    id: "DRL-005",
    nomBoutique: "Dépôt Adjamé Market",
    responsable: "Sawadogo Rasmané",
    commune: "Adjamé",
    quartier: "220 Logements",
    horaires: "Lun–Sam 07h–21h",
    dateDemandeRaw: "2026-04-05",
    statut: "approuve",
  },
  {
    id: "DRL-006",
    nomBoutique: "Galerie Marcory",
    responsable: "Attié Marie-Claire",
    commune: "Marcory",
    quartier: "Zone 4",
    horaires: "Mar–Dim 10h–20h",
    dateDemandeRaw: "2026-04-03",
    statut: "rejete",
  },
]

// ── KPI counts ─────────────────────────────────────────────────────────────

const kpis = {
  livreursEnAttente: livreursData.filter((l) => l.statut === "en_attente").length,
  relaisEnAttente: relaisData.filter((r) => r.statut === "en_attente").length,
  approuvesCeMois:
    [...livreursData, ...relaisData].filter((d) => d.statut === "approuve").length,
  rejetesCeMois:
    [...livreursData, ...relaisData].filter((d) => d.statut === "rejete").length,
}

// ── Shared pagination component ────────────────────────────────────────────

function TablePagination({ table }: { table: ReturnType<typeof useReactTable<any>> }) {
  return (
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
              {[5, 10, 20].map((s) => (
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
  )
}

// ── Livreurs sub-table ─────────────────────────────────────────────────────

function LivreursTable() {
  const [data, setData] = React.useState<DemandelivreurRaw[]>(livreursData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<DemandelivreurRaw>[] = React.useMemo(() => [
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
      header: () => <div>Téléphone</div>,
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
      cell: ({ row }) => <span>{row.getValue("vehicule")}</span>,
    },
    {
      accessorKey: "documents",
      header: () => <div>Documents</div>,
      cell: ({ row }) => {
        const val = row.getValue("documents") as DocumentStatut
        return (
          <Badge
            variant="outline"
            className={`border-none rounded-sm ${
              val === "complet"
                ? "bg-green-600/10 text-green-600"
                : "bg-red-600/10 text-red-600"
            }`}
          >
            {val === "complet" ? "Complet" : "Incomplet"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "dateDemandeRaw",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date demande <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const formatted = new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(row.getValue("dateDemandeRaw")))
        return <span className="text-sm text-muted-foreground">{formatted}</span>
      },
    },
    {
      accessorKey: "statut",
      header: () => <div>Statut</div>,
      cell: ({ row }) => {
        const val = row.getValue("statut") as DemandeStatut
        const cfg = {
          en_attente: { label: "En attente", className: "bg-amber-600/10 text-amber-600" },
          approuve: { label: "Approuvé", className: "bg-green-600/10 text-green-600" },
          rejete: { label: "Rejeté", className: "bg-red-600/10 text-red-600" },
        }[val]
        return (
          <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
            {cfg.label}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const demande = row.original
        return (
          <div className="flex items-center gap-2">
            {demande.statut === "en_attente" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                  onClick={() =>
                    setData((prev) =>
                      prev.map((d) =>
                        d.id === demande.id ? { ...d, statut: "approuve" } : d
                      )
                    )
                  }
                >
                  Approuver
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 px-3 text-xs"
                  onClick={() =>
                    setData((prev) =>
                      prev.map((d) =>
                        d.id === demande.id ? { ...d, statut: "rejete" } : d
                      )
                    )
                  }
                >
                  Rejeter
                </Button>
              </>
            )}
            {demande.statut !== "en_attente" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="Actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Voir le dossier</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      setData((prev) =>
                        prev.map((d) =>
                          d.id === demande.id ? { ...d, statut: "en_attente" } : d
                        )
                      )
                    }
                  >
                    Remettre en attente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      },
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

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 py-4">
        <Input
          placeholder="Rechercher un livreur..."
          value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("nom")?.setFilterValue(e.target.value)}
          className="max-w-xs"
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
                  nom: "Nom",
                  telephone: "Téléphone",
                  commune: "Commune",
                  vehicule: "Véhicule",
                  documents: "Documents",
                  dateDemandeRaw: "Date demande",
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
      <TablePagination table={table} />
    </div>
  )
}

// ── Relais sub-table ───────────────────────────────────────────────────────

function RelaisTable() {
  const [data, setData] = React.useState<DemandeRelaisRaw[]>(relaisData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<DemandeRelaisRaw>[] = React.useMemo(() => [
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
      accessorKey: "nomBoutique",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom boutique <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("nomBoutique")}</span>,
    },
    {
      accessorKey: "responsable",
      header: () => <div>Responsable</div>,
      cell: ({ row }) => <span>{row.getValue("responsable")}</span>,
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
      accessorKey: "quartier",
      header: () => <div>Quartier</div>,
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("quartier")}</span>,
    },
    {
      accessorKey: "horaires",
      header: () => <div>Horaires</div>,
      cell: ({ row }) => <span className="text-sm">{row.getValue("horaires")}</span>,
    },
    {
      accessorKey: "dateDemandeRaw",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date demande <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const formatted = new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(row.getValue("dateDemandeRaw")))
        return <span className="text-sm text-muted-foreground">{formatted}</span>
      },
    },
    {
      accessorKey: "statut",
      header: () => <div>Statut</div>,
      cell: ({ row }) => {
        const val = row.getValue("statut") as DemandeStatut
        const cfg = {
          en_attente: { label: "En attente", className: "bg-amber-600/10 text-amber-600" },
          approuve: { label: "Approuvé", className: "bg-green-600/10 text-green-600" },
          rejete: { label: "Rejeté", className: "bg-red-600/10 text-red-600" },
        }[val]
        return (
          <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
            {cfg.label}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const demande = row.original
        return (
          <div className="flex items-center gap-2">
            {demande.statut === "en_attente" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                  onClick={() =>
                    setData((prev) =>
                      prev.map((d) =>
                        d.id === demande.id ? { ...d, statut: "approuve" } : d
                      )
                    )
                  }
                >
                  Approuver
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 px-3 text-xs"
                  onClick={() =>
                    setData((prev) =>
                      prev.map((d) =>
                        d.id === demande.id ? { ...d, statut: "rejete" } : d
                      )
                    )
                  }
                >
                  Rejeter
                </Button>
              </>
            )}
            {demande.statut !== "en_attente" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="Actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Voir le dossier</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      setData((prev) =>
                        prev.map((d) =>
                          d.id === demande.id ? { ...d, statut: "en_attente" } : d
                        )
                      )
                    }
                  >
                    Remettre en attente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      },
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

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 py-4">
        <Input
          placeholder="Rechercher un point relais..."
          value={(table.getColumn("nomBoutique")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("nomBoutique")?.setFilterValue(e.target.value)}
          className="max-w-xs"
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
                  nomBoutique: "Nom boutique",
                  responsable: "Responsable",
                  commune: "Commune",
                  quartier: "Quartier",
                  horaires: "Horaires",
                  dateDemandeRaw: "Date demande",
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
      <TablePagination table={table} />
    </div>
  )
}

// ── Main view ──────────────────────────────────────────────────────────────

export default function ValidationsView() {
  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div>
        <div className="text-2xl font-semibold tracking-tight">Validations</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Approuvez ou rejetez les demandes d&apos;inscription en attente
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">En attente (livreurs)</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.livreursEnAttente}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-amber-500 text-white">
                <IconTrendingUp className="text-white" />+2
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-amber-300">
              File à traiter <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Dossiers à traiter</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">En attente (relais)</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.relaisEnAttente}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-amber-500 text-white">
                <IconTrendingUp className="text-white" />+1
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-amber-300">
              Demandes en hausse <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Dossiers à traiter</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Approuvées ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.approuvesCeMois}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+15%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Bon traitement <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Livreurs + relais</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Rejetées ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.rejetesCeMois}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-rose-500 text-white">
                <IconTrendingDown className="text-white" />-1
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-rose-300">
              En baisse <IconTrendingDown className="size-4" />
            </div>
            <div className="text-white/60">Dossiers refusés</div>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="livreurs" className="w-full">
        <TabsList>
          <TabsTrigger value="livreurs" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Livreurs
            <Badge variant="outline" className="ml-1 bg-amber-600/10 text-amber-600 border-none rounded-sm text-xs">
              {kpis.livreursEnAttente}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="relais" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Points relais
            <Badge variant="outline" className="ml-1 bg-amber-600/10 text-amber-600 border-none rounded-sm text-xs">
              {kpis.relaisEnAttente}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="livreurs">
          <LivreursTable />
        </TabsContent>
        <TabsContent value="relais">
          <RelaisTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
