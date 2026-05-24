"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Search,
  Users,
  Building2,
  Wallet,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Plus,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
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
  CardContent,
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

// ── Types conformes au schéma Prisma ───────────────────────────────────────

type OrganisationType = "PARTICULIER" | "AGENCE"
type UserStatus = "actif" | "suspendu"

type Organisateur = {
  id: string
  nom: string
  email: string
  telephone: string
  type: OrganisationType
  commune: string
  devisDemandes: number
  soldeCashback: number
  statut: UserStatus
  derniereConnexion: string
  initiales: string
}

// ── Mock data alignée avec la BD ───────────────────────────────────────────

import organisateursMockData from "@/data/mock/organisateurs.json"

const initialOrganisateurs: Organisateur[] = organisateursMockData as Organisateur[]

// ── View component ──────────────────────────────────────────────────────────

export default function OrganisateursView() {
  const router = useRouter()
  const [data, setData] = React.useState<Organisateur[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [typeFilter, setTypeFilter] = React.useState<string>("tous")
  const [statutFilter, setStatutFilter] = React.useState<string>("tous")
  const [communeFilter, setCommuneFilter] = React.useState<string>("toutes")

  React.useEffect(() => {
    async function loadOrganisateurs() {
      try {
        setIsLoading(true)
        setError(null)
        const res = await apiFetch("/admin/organisateurs?limit=100")
        if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((item: any) => {
            const member = item.members?.[0]
            const user = member?.user
            const firstName = user?.firstName ?? ""
            const lastName = user?.lastName ?? ""
            const fullName = `${firstName} ${lastName}`.trim() || item.name || "Organisateur sans nom"
            const phone = user?.phone ?? item.telephone ?? member?.phone ?? "Non renseigné"
            
            return {
              id: item.id,
              nom: item.name || fullName,
              email: user?.email ?? item.email ?? "Non renseigné",
              telephone: phone,
              type: item.type ?? "PARTICULIER",
              commune: item.commune ?? user?.commune ?? "Abidjan",
              devisDemandes: item._count?.devisDemandes ?? (Array.isArray(item.devisDemandes) ? item.devisDemandes.length : 0),
              soldeCashback: item.cashbackWallet?.soldeFCFA ?? 0,
              statut: item.deletedAt ? "suspendu" : "actif",
              derniereConnexion: user?.lastLoginAt ?? item.updatedAt ?? new Date().toISOString(),
              initiales: (item.name || fullName || "OR").slice(0, 2).toUpperCase()
            }
          })
          setData(mapped)
        } else {
          setData(initialOrganisateurs)
        }
      } catch (err) {
        console.error("Erreur de chargement des organisateurs:", err)
        setError(err instanceof Error ? err.message : "Erreur de chargement")
        setData(initialOrganisateurs)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrganisateurs()
  }, [])

  const filteredData = React.useMemo(() => {
    return data.filter((u) => {
      if (typeFilter !== "tous" && u.type !== typeFilter) return false
      if (statutFilter !== "tous" && u.statut !== statutFilter) return false
      if (communeFilter !== "toutes" && u.commune !== communeFilter) return false
      return true
    })
  }, [data, typeFilter, statutFilter, communeFilter])

  // KPIs
  const kpis = React.useMemo(() => {
    const total = data.length
    const particuliers = data.filter((u) => u.type === "PARTICULIER").length
    const agences = data.filter((u) => u.type === "AGENCE").length
    const totalCashback = data.reduce((sum, u) => sum + u.soldeCashback, 0)
    return {
      total,
      particuliers,
      agences,
      totalCashback,
    }
  }, [data])

  const communes = ["toutes", ...Array.from(new Set(data.map((u) => u.commune))).sort()]

  const columns: ColumnDef<Organisateur>[] = React.useMemo(() => [
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
          className="text-xs font-bold p-0 hover:bg-transparent text-muted-foreground uppercase"
        >
          Organisateur & Contacts <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original
        return (
          <span 
            onClick={() => router.push(`/organisateurs/${u.id}`)}
            className="font-bold text-slate-800 text-sm hover:text-[#023B8A] cursor-pointer transition-colors"
          >
            {u.nom}
          </span>
        )
      },
    },
    {
      accessorKey: "type",
      header: () => <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profil Type</div>,
      cell: ({ row }) => {
        const type = row.getValue("type") as OrganisationType
        return (
          <Badge variant="outline" className={`border-none rounded-md text-xs font-bold py-0.5 px-2.5 ${
            type === "AGENCE" 
              ? "bg-amber-50 text-amber-700 hover:bg-amber-50" 
              : "bg-blue-50 text-blue-700 hover:bg-blue-50"
          }`}>
            {type === "AGENCE" ? "Agence Pro" : "Particulier"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "commune",
      header: () => <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Commune</div>,
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <MapPin className="size-4 text-slate-400" />
          {row.getValue("commune")}
        </span>
      ),
    },
    {
      accessorKey: "devisDemandes",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-bold p-0 hover:bg-transparent text-muted-foreground uppercase"
        >
          Devis Envoyés <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-bold text-slate-800 font-mono text-sm text-center block max-w-[80px]">
          {row.getValue("devisDemandes")} fiches
        </span>
      ),
    },
    {
      accessorKey: "soldeCashback",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-bold p-0 hover:bg-transparent text-muted-foreground uppercase"
        >
          Cashback 1% <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const val = row.getValue("soldeCashback") as number
        return (
          <span className="font-bold text-emerald-600 font-mono text-sm">
            {new Intl.NumberFormat("fr-FR").format(val)} F
          </span>
        )
      },
    },
    {
      accessorKey: "statut",
      header: () => <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Statut</div>,
      cell: ({ row }) => {
        const statut = row.getValue("statut") as UserStatus
        return (
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
            statut === "actif" 
              ? "text-emerald-600 bg-emerald-50" 
              : "text-red-600 bg-red-50"
          }`}>
            ● {statut === "actif" ? "Actif" : "Suspendu"}
          </span>
        )
      },
    },
    {
      accessorKey: "derniereConnexion",
      header: () => <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Activité</div>,
      cell: ({ row }) => {
        const dateStr = row.getValue("derniereConnexion") as string
        return (
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr))}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex gap-1.5 justify-end shrink-0">
            <button
              onClick={() => router.push(`/organisateurs/${u.id}`)}
              className="px-2.5 py-1 text-xs font-bold text-[#023B8A] bg-blue-50 hover:bg-blue-100 rounded-md transition-all cursor-pointer"
            >
              Voir
            </button>
            {u.statut === "actif" ? (
              <button
                onClick={() => {
                  setData((prev) =>
                    prev.map((item) =>
                      item.id === u.id ? { ...item, statut: "suspendu" } : item
                    )
                  )
                  toast.warning(`Compte de ${u.nom} suspendu.`)
                }}
                className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-all cursor-pointer"
              >
                Suspendre
              </button>
            ) : (
              <button
                onClick={() => {
                  setData((prev) =>
                    prev.map((item) =>
                      item.id === u.id ? { ...item, statut: "actif" } : item
                    )
                  )
                  toast.success(`Compte de ${u.nom} réactivé !`)
                }}
                className="px-2.5 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-all cursor-pointer"
              >
                Activer
              </button>
            )}
          </div>
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

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-6 max-w-360 mx-auto pb-10">
      
      {/* SECTION EN-TÊTE DE PAGE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Gestion des Organisateurs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gérez les comptes des particuliers et des agences événementielles demandant des devis sur Event Reco
          </p>
        </div>
        <div>
          <Button 
            className="bg-[#023B8A] hover:bg-[#023B8A]/90 gap-1.5 font-semibold text-xs py-2 h-9 rounded-lg"
            onClick={() => toast.success("Ouverture du panneau de création d'organisateur...")}
          >
            <UserPlus className="size-4" /> Nouvel Organisateur
          </Button>
        </div>
      </div>

      {/* RANGÉE DE BLOCS DE KPI LUXUEUX */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        
        {/* Total organisers */}
        <Card className="@container/card border-slate-100 shadow-xs hover:border-amber-200 transition-all">
          <CardHeader>
            <CardDescription>Organisateurs Inscrits</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {kpis.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50/20 text-xs font-bold rounded-full">
                <TrendingUp className="size-3 mr-1 text-emerald-600" /> +87 sem.
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
            <div className="line-clamp-1 flex gap-1 font-medium text-emerald-600 items-center">
              +87 inscrits <TrendingUp className="size-3.5" />
            </div>
            <div className="text-muted-foreground font-medium">Comptes actifs sur l&apos;annuaire</div>
          </CardFooter>
        </Card>

        {/* Particuliers */}
        <Card className="@container/card border-slate-100 shadow-xs hover:border-blue-200 transition-all">
          <CardHeader>
            <CardDescription>Clients Particuliers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {kpis.particuliers}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50/20 text-xs font-bold rounded-full">
                90%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
            <div className="line-clamp-1 flex gap-1 font-medium text-blue-600 items-center">
              Majorité des membres
            </div>
            <div className="text-muted-foreground font-medium">Particuliers (mariages, fêtes)</div>
          </CardFooter>
        </Card>

        {/* Agencies */}
        <Card className="@container/card border-slate-100 shadow-xs hover:border-amber-200 transition-all">
          <CardHeader>
            <CardDescription>Agences Événementielles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {kpis.agences}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50/20 text-xs font-bold rounded-full">
                Pro
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
            <div className="line-clamp-1 flex gap-1 font-medium text-amber-600 items-center">
              Volume régulier
            </div>
            <div className="text-muted-foreground font-medium">Volume de commandes régulier</div>
          </CardFooter>
        </Card>

        {/* Cashback global */}
        <Card className="@container/card border-slate-100 shadow-xs hover:border-emerald-200 transition-all">
          <CardHeader>
            <CardDescription>Cashback Distribué</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {new Intl.NumberFormat("fr-FR").format(kpis.totalCashback)} <span className="text-xs text-slate-500 font-semibold ml-0.5">F</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50/20 text-xs font-bold rounded-full">
                Wallet 1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
            <div className="line-clamp-1 flex gap-1 font-medium text-emerald-600 items-center">
              Crédits générés
            </div>
            <div className="text-muted-foreground font-medium">Solde cumulé des portefeuilles cashback</div>
          </CardFooter>
        </Card>

      </div>

      {/* SECTION TABLEAU ET FILTRES */}
      <Card className="border-slate-100 bg-white overflow-hidden shadow-xs">
        
        {/* Filtres table */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, e-mail, téléphone..."
              value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn("nom")?.setFilterValue(e.target.value)}
              className="pl-9 h-8.5 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#023B8A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filtre Type */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8.5 text-xs w-[140px] bg-white border-slate-200">
                <SelectValue placeholder="Profil Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="PARTICULIER">Particuliers</SelectItem>
                <SelectItem value="AGENCE">Agences Pro</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre Statut */}
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="h-8.5 text-xs w-[130px] bg-white border-slate-200">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actifs</SelectItem>
                <SelectItem value="suspendu">Suspendus</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre Commune */}
            <Select value={communeFilter} onValueChange={setCommuneFilter}>
              <SelectTrigger className="h-8.5 text-xs w-[140px] bg-white border-slate-200">
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
                <Button variant="outline" className="h-8.5 text-xs border-slate-200 gap-1.5">
                  Colonnes <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => {
                    const labels: Record<string, string> = {
                      nom: "Organisateur",
                      type: "Profil Type",
                      commune: "Commune",
                      devisDemandes: "Devis Envoyés",
                      soldeCashback: "Cashback 1%",
                      statut: "Statut",
                      derniereConnexion: "Activité",
                    }
                    return (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        checked={col.getIsVisible()}
                        onCheckedChange={(v) => col.toggleVisibility(!!v)}
                        className="text-xs"
                      >
                        {labels[col.id] ?? col.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/40">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="hover:bg-transparent">
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="h-11 px-6">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    {Array.from({ length: columns.length }).map((_, j) => (
                      <TableCell key={j} className="py-3 px-6 h-[64px]">
                        {j === 1 ? (
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-slate-100 animate-pulse shrink-0"></div>
                            <div className="space-y-1.5 flex-1">
                              <div className="h-3.5 w-32 bg-slate-200 animate-pulse rounded"></div>
                              <div className="h-2.5 w-24 bg-slate-100 animate-pulse rounded"></div>
                            </div>
                          </div>
                        ) : j === columns.length - 1 ? (
                          <div className="flex gap-1.5 justify-end shrink-0">
                            <div className="h-6.5 w-10 bg-slate-100 animate-pulse rounded-md"></div>
                            <div className="h-6.5 w-16 bg-slate-100 animate-pulse rounded-md"></div>
                          </div>
                        ) : j > 0 ? (
                          <div className="h-3 bg-slate-200 animate-pulse rounded w-[70%] max-w-[100px]"></div>
                        ) : (
                          <div className="h-4 w-4 bg-slate-100 animate-pulse rounded"></div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-slate-50/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-6 h-[64px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-28 text-center text-xs text-muted-foreground font-medium">
                    Aucun organisateur trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">
            {table.getFilteredSelectedRowModel().rows.length} sur{" "}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
          </span>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Par page</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="h-7 w-[65px] text-xs">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[5, 8, 10, 20].map((s) => (
                    <SelectItem key={s} value={`${s}`} className="text-xs">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount() || 1}
              </span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-7.5 px-2.5 text-xs font-bold"
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-7.5 px-2.5 text-xs font-bold"
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>

      </Card>

    </div>
  )
}
