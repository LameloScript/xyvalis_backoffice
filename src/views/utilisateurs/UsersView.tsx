"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  UserPlus,
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

type UserRole = "client" | "livreur" | "point_relais"
type UserStatus = "actif" | "suspendu"

type User = {
  id: string
  nom: string
  email: string
  telephone: string
  role: UserRole
  commune: string
  statut: UserStatus
  derniereConnexion: string
}

const usersData: User[] = [
  {
    id: "USR-001",
    nom: "Konan Yao Stéphane",
    email: "konan.yao@gmail.com",
    telephone: "+225 07 01 23 45",
    role: "client",
    commune: "Cocody",
    statut: "actif",
    derniereConnexion: "2026-04-24T10:32:00",
  },
  {
    id: "USR-002",
    nom: "Adjoua Kouassi Bénédicte",
    email: "adjoua.k@yahoo.fr",
    telephone: "+225 05 78 90 12",
    role: "client",
    commune: "Plateau",
    statut: "actif",
    derniereConnexion: "2026-04-24T08:15:00",
  },
  {
    id: "USR-003",
    nom: "Bamba Issouf",
    email: "bamba.issouf@gmail.com",
    telephone: "+225 01 45 67 89",
    role: "livreur",
    commune: "Yopougon",
    statut: "actif",
    derniereConnexion: "2026-04-24T11:05:00",
  },
  {
    id: "USR-004",
    nom: "Fatou Diallo",
    email: "fatou.diallo@gmail.com",
    telephone: "+225 07 23 45 67",
    role: "livreur",
    commune: "Marcory",
    statut: "actif",
    derniereConnexion: "2026-04-23T19:48:00",
  },
  {
    id: "USR-005",
    nom: "N'Guessan Kouamé",
    email: "nguessan.k@gmail.com",
    telephone: "+225 05 34 56 78",
    role: "livreur",
    commune: "Adjamé",
    statut: "suspendu",
    derniereConnexion: "2026-04-20T14:22:00",
  },
  {
    id: "USR-006",
    nom: "Aya Traoré",
    email: "aya.traore@hotmail.com",
    telephone: "+225 01 89 01 23",
    role: "client",
    commune: "Abobo",
    statut: "actif",
    derniereConnexion: "2026-04-24T07:30:00",
  },
  {
    id: "USR-007",
    nom: "Relais Treichville Centre",
    email: "relais.treich@gmail.com",
    telephone: "+225 27 21 34 56",
    role: "point_relais",
    commune: "Treichville",
    statut: "actif",
    derniereConnexion: "2026-04-24T09:00:00",
  },
  {
    id: "USR-008",
    nom: "Boutique Cocody Relais",
    email: "cocody.relais@gmail.com",
    telephone: "+225 27 22 11 22",
    role: "point_relais",
    commune: "Cocody",
    statut: "actif",
    derniereConnexion: "2026-04-23T16:45:00",
  },
  {
    id: "USR-009",
    nom: "Ouattara Seydou",
    email: "ouattara.s@gmail.com",
    telephone: "+225 07 56 78 90",
    role: "client",
    commune: "Yopougon",
    statut: "suspendu",
    derniereConnexion: "2026-04-18T11:10:00",
  },
  {
    id: "USR-010",
    nom: "Kouadio Marc-André",
    email: "kouadio.marc@gmail.com",
    telephone: "+225 05 12 34 56",
    role: "livreur",
    commune: "Plateau",
    statut: "actif",
    derniereConnexion: "2026-04-24T12:50:00",
  },
  {
    id: "USR-011",
    nom: "Prisca N'Goran",
    email: "prisca.ngoran@gmail.com",
    telephone: "+225 07 90 12 34",
    role: "client",
    commune: "Marcory",
    statut: "actif",
    derniereConnexion: "2026-04-24T06:20:00",
  },
  {
    id: "USR-012",
    nom: "Relais Adjamé Marché",
    email: "adjame.relais@gmail.com",
    telephone: "+225 27 20 98 76",
    role: "point_relais",
    commune: "Adjamé",
    statut: "suspendu",
    derniereConnexion: "2026-04-10T08:30:00",
  },
]

const roleConfig = {
  client: { label: "Client", className: "bg-blue-600/10 text-blue-600" },
  livreur: { label: "Livreur", className: "bg-violet-600/10 text-violet-600" },
  point_relais: { label: "Point relais", className: "bg-amber-600/10 text-amber-600" },
}

const statutConfig = {
  actif: { label: "Actif", className: "bg-green-600/10 text-green-600" },
  suspendu: { label: "Suspendu", className: "bg-red-600/10 text-red-600" },
}

export default function UsersView() {
  const router = useRouter()
  const [data, setData] = React.useState<User[]>(usersData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [roleFilter, setRoleFilter] = React.useState<string>("tous")
  const [statutFilter, setStatutFilter] = React.useState<string>("tous")
  const [communeFilter, setCommuneFilter] = React.useState<string>("toutes")

  const filteredData = React.useMemo(() => {
    return data.filter((u) => {
      if (roleFilter !== "tous" && u.role !== roleFilter) return false
      if (statutFilter !== "tous" && u.statut !== statutFilter) return false
      if (communeFilter !== "toutes" && u.commune !== communeFilter) return false
      return true
    })
  }, [data, roleFilter, statutFilter, communeFilter])

  const kpis = React.useMemo(() => ({
    total: data.length,
    clients: data.filter((u) => u.role === "client").length,
    livreurs: data.filter((u) => u.role === "livreur").length,
    pointsRelais: data.filter((u) => u.role === "point_relais").length,
  }), [data])

  const columns: ColumnDef<User>[] = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Tout sélectionner"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nom")}</div>
      ),
    },
    {
      id: "contact",
      header: () => <div>Email / Tél</div>,
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm">{row.original.email}</span>
          <span className="text-xs text-muted-foreground">{row.original.telephone}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: () => <div>Rôle</div>,
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole
        const cfg = roleConfig[role]
        return (
          <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
            {cfg.label}
          </Badge>
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
      accessorKey: "statut",
      header: () => <div>Statut</div>,
      cell: ({ row }) => {
        const statut = row.getValue("statut") as UserStatus
        const cfg = statutConfig[statut]
        return (
          <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
            {cfg.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "derniereConnexion",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dernière connexion
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const raw = row.getValue("derniereConnexion") as string
        const formatted = new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(raw))
        return <span className="text-sm text-muted-foreground">{formatted}</span>
      },
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/utilisateurs/${user.id}`)}>
                Voir le profil complet
              </DropdownMenuItem>
              <DropdownMenuItem>Historique des connexions</DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.statut === "actif" ? (
                <DropdownMenuItem
                  onClick={() =>
                    setData((prev) =>
                      prev.map((u) =>
                        u.id === user.id ? { ...u, statut: "suspendu" } : u
                      )
                    )
                  }
                  className="text-amber-600"
                >
                  Suspendre le compte
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    setData((prev) =>
                      prev.map((u) =>
                        u.id === user.id ? { ...u, statut: "actif" } : u
                      )
                    )
                  }
                  className="text-green-600"
                >
                  Réactiver le compte
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  setData((prev) => prev.filter((u) => u.id !== user.id))
                }
                className="text-destructive"
              >
                Supprimer le compte
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
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 8 } },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  const communes = ["toutes", ...Array.from(new Set(data.map((u) => u.commune))).sort()]

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Utilisateurs</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Gérez tous les comptes de la plateforme
          </div>
        </div>
        <Button onClick={() => router.push("/utilisateurs/nouveau")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Créer un compte
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Total comptes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+8.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Croissance ce mois <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Tous rôles confondus</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Clients</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.clients}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+12%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Nouveaux inscrits <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Comptes clients actifs</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Livreurs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.livreurs}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Recrutement stable <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Livreurs enregistrés</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Points relais</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.pointsRelais}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-rose-500 text-white">
                <IconTrendingDown className="text-white" />-2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-rose-300">
              Léger repli <IconTrendingDown className="size-4" />
            </div>
            <div className="text-white/60">Relais partenaires</div>
          </CardFooter>
        </Card>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 py-4">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("nom")?.setFilterValue(e.target.value)}
            className="max-w-xs"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les rôles</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="livreur">Livreur</SelectItem>
              <SelectItem value="point_relais">Point relais</SelectItem>
            </SelectContent>
          </Select>
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
                    contact: "Email / Tél",
                    role: "Rôle",
                    commune: "Commune",
                    statut: "Statut",
                    derniereConnexion: "Dernière connexion",
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
                  {[5, 8, 10, 20, 30].map((size) => (
                    <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
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
