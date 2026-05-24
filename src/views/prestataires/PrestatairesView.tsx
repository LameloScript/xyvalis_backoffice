"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Star,
  Search,
  Briefcase,
  Crown,
  AlertTriangle,
  Heart,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  FileCheck,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
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

type PrestataireStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "REJECTED"
type BadgeLevel = "NONE" | "IDENTITY_VERIFIED" | "BUSINESS_REGISTERED" | "PREMIUM_VERIFIED"
type PlanPresta = "FREEMIUM" | "PREMIUM" | "PREMIUM_PLUS"

type Prestataire = {
  id: string
  nom: string
  slug: string
  responsable: string
  email: string
  telephone: string
  commune: string
  categorie: string
  status: PrestataireStatus
  badgeLevel: BadgeLevel
  planActif: PlanPresta
  noteMoyenne: number
  nombreAvis: number
  nombreVuesMois: number
  noteAdminInterne?: string
  dateInscription: string
  initiales: string
}

// ── Mock data alignée avec la BD ───────────────────────────────────────────

import prestatairesMockData from "@/data/mock/prestataires.json"

const initialPrestataires: Prestataire[] = prestatairesMockData as Prestataire[]

// ── Star rating helper ─────────────────────────────────────────────────────

function StarRating({ note, count }: { note: number; count: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-bold text-slate-800">{note > 0 ? note.toFixed(1) : "—"}</span>
      {count > 0 && <span className="text-[10px] text-muted-foreground font-medium">({count})</span>}
    </div>
  )
}

// ── Badge level helper ─────────────────────────────────────────────────────

function BadgeBadge({ level }: { level: BadgeLevel }) {
  switch (level) {
    case "PREMIUM_VERIFIED":
      return (
        <Badge variant="outline" className="border-none bg-rose-50 text-rose-700 hover:bg-rose-50 flex items-center gap-1 text-[10px] font-bold py-0.5 px-2">
          <Sparkles className="size-3 text-rose-500 fill-rose-500" /> Vérifié Premium
        </Badge>
      )
    case "BUSINESS_REGISTERED":
      return (
        <Badge variant="outline" className="border-none bg-blue-50 text-blue-700 hover:bg-blue-50 flex items-center gap-1 text-[10px] font-bold py-0.5 px-2">
          <Award className="size-3 text-blue-500 fill-blue-500" /> R.Commerce
        </Badge>
      )
    case "IDENTITY_VERIFIED":
      return (
        <Badge variant="outline" className="border-none bg-emerald-50 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 text-[10px] font-bold py-0.5 px-2">
          <ShieldCheck className="size-3 text-emerald-500" /> ID Vérifiée
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="border-none bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px] font-semibold py-0.5 px-2">
          Standard
        </Badge>
      )
  }
}

// ── Status helper ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PrestataireStatus }) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          ● Actif
        </span>
      )
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
          ● À valider
        </span>
      )
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
          ● Suspendu
        </span>
      )
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          ● Expiré
        </span>
      )
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
          ● Refusé
        </span>
      )
  }
}

// ── View component ──────────────────────────────────────────────────────────

export default function PrestatairesView() {
  const router = useRouter()
  const [data, setData] = React.useState<Prestataire[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [statusFilter, setStatusFilter] = React.useState<string>("tous")
  const [planFilter, setPlanFilter] = React.useState<string>("tous")
  const [communeFilter, setCommuneFilter] = React.useState<string>("toutes")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("toutes")

  // Charger les prestataires de l'API
  React.useEffect(() => {
    async function loadPrestataires() {
      try {
        setIsLoading(true)
        setError(null)
        const res = await apiFetch("/admin/prestataires?limit=100")
        if (!res.ok) throw new Error(`Erreur prestataires: ${res.status}`)
        const json = await res.json()
        if (json.success) {
          const mapped = (json.data || []).map((item: any): Prestataire => ({
            id: item.id,
            nom: item.name ?? "Sans nom",
            slug: item.slug ?? "",
            responsable: item.organisation?.name ?? "Non renseigné",
            email: item.emailPublic ?? "contact@pro.ci",
            telephone: item.telephoneFixe ?? "Non renseigné",
            commune: item.commune ?? "Abidjan",
            categorie: item.categoriePrincipale?.nom ?? "Événementiel",
            status: item.status as PrestataireStatus,
            badgeLevel: item.badgeLevel as BadgeLevel,
            planActif: item.planActif as PlanPresta,
            noteMoyenne: item.noteMoyenne ?? 0.0,
            nombreAvis: item.nombreAvis ?? 0,
            nombreVuesMois: item.nombreVuesMois ?? 0,
            noteAdminInterne: item.noteAdminInterne ?? "",
            dateInscription: item.createdAt ? item.createdAt.split('T')[0] : "2026-01-01",
            initiales: (item.name ?? "PR").slice(0, 2).toUpperCase()
          }))
          setData(mapped)
        }
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Erreur lors de la récupération des prestataires")
        toast.error("Impossible de charger les prestataires")
      } finally {
        setIsLoading(false)
      }
    }
    loadPrestataires()
  }, [])

  const filteredData = React.useMemo(() => {
    return data.filter((p) => {
      if (statusFilter !== "tous" && p.status !== statusFilter) return false
      if (planFilter !== "tous" && p.planActif !== planFilter) return false
      if (communeFilter !== "toutes" && p.commune !== communeFilter) return false
      if (categoryFilter !== "toutes" && p.categorie !== categoryFilter) return false
      return true
    })
  }, [data, statusFilter, planFilter, communeFilter, categoryFilter])

  // KPIs
  const kpis = React.useMemo(() => {
    const total = data.length
    const abonnants = data.filter((p) => p.planActif !== "FREEMIUM").length
    const aValider = data.filter((p) => p.status === "PENDING").length
    const noteMoyenne = data.filter((p) => p.noteMoyenne > 0).reduce((sum, p) => sum + p.noteMoyenne, 0) / data.filter((p) => p.noteMoyenne > 0).length

    return {
      total,
      abonnants,
      aValider,
      noteMoyenne: noteMoyenne || 4.8,
    }
  }, [data])

  const communes = ["toutes", ...Array.from(new Set(data.map((p) => p.commune))).sort()]
  const categories = ["toutes", ...Array.from(new Set(data.map((p) => p.categorie))).sort()]
  const plans = ["tous", "FREEMIUM", "PREMIUM", "PREMIUM_PLUS"]

  const columns: ColumnDef<Prestataire>[] = React.useMemo(() => [
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
          Entreprise & Manager <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex items-center gap-3">
            <div className={`size-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
              p.planActif === "PREMIUM_PLUS" 
                ? "bg-blue-100 text-blue-800" 
                : p.planActif === "PREMIUM" 
                  ? "bg-amber-100 text-amber-800" 
                  : "bg-slate-100 text-slate-700"
            }`}>
              {p.initiales}
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm hover:text-[#023B8A] cursor-pointer"
                    onClick={() => router.push(`/prestataires/${p.id}`)}>
                {p.nom}
              </span>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                {p.commune} · {p.responsable}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "categorie",
      header: () => <div className="text-[10px] font-bold text-muted-foreground uppercase">Catégorie</div>,
      cell: ({ row }) => (
        <Badge variant="outline" className="border-none bg-sky-50 text-sky-800 hover:bg-sky-50 text-[10px] font-bold py-0.5 px-2">
          {row.getValue("categorie")}
        </Badge>
      ),
    },
    {
      accessorKey: "planActif",
      header: () => <div className="text-[10px] font-bold text-muted-foreground uppercase">Abonnement</div>,
      cell: ({ row }) => {
        const plan = row.getValue("planActif") as PlanPresta
        return (
          <span className={`text-xs font-bold flex items-center gap-1 ${
            plan === "PREMIUM_PLUS" 
              ? "text-blue-600" 
              : plan === "PREMIUM" 
                ? "text-amber-600" 
                : "text-slate-500"
          }`}>
            {plan === "PREMIUM_PLUS" && <Crown className="size-3 text-blue-600 fill-blue-100" />}
            {plan === "PREMIUM" && <Crown className="size-3 text-amber-600" />}
            {plan === "FREEMIUM" && <span className="size-1.5 rounded-full bg-slate-400"></span>}
            {plan}
          </span>
        )
      },
    },
    {
      accessorKey: "badgeLevel",
      header: () => <div className="text-[10px] font-bold text-muted-foreground uppercase">Badge KYC</div>,
      cell: ({ row }) => <BadgeBadge level={row.getValue("badgeLevel") as BadgeLevel} />,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-[10px] font-bold text-muted-foreground uppercase">Statut</div>,
      cell: ({ row }) => <StatusBadge status={row.getValue("status") as PrestataireStatus} />,
    },
    {
      accessorKey: "noteMoyenne",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-bold p-0 hover:bg-transparent text-muted-foreground uppercase"
        >
          Note platform <ArrowUpDown className="ml-1 size-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const p = row.original
        return <StarRating note={p.noteMoyenne} count={p.nombreAvis} />
      },
    },
    {
      accessorKey: "dateInscription",
      header: () => <div className="text-[10px] font-bold text-muted-foreground uppercase">Inscription</div>,
      cell: ({ row }) => {
        const dateStr = row.getValue("dateInscription") as string
        return (
          <span className="text-[11px] font-semibold text-muted-foreground font-mono">
            {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr))}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-[10px] font-bold text-muted-foreground uppercase text-right">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex gap-1.5 justify-end shrink-0">
            {p.status === "PENDING" ? (
              <>
                <button
                  onClick={async () => {
                    try {
                      const res = await apiFetch(`/admin/prestataires/${p.id}/validate`, {
                        method: 'PATCH'
                      })
                      if (!res.ok) throw new Error("Erreur lors de la validation")
                      
                      setData((prev) =>
                        prev.map((item) =>
                          item.id === p.id ? { ...item, status: "ACTIVE", badgeLevel: "IDENTITY_VERIFIED" } : item
                        )
                      )
                      toast.success(`Le prestataire ${p.nom} a été approuvé avec succès !`)
                    } catch (err) {
                      toast.error("Échec de la validation")
                    }
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                >
                  Approuver
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await apiFetch(`/admin/prestataires/${p.id}/reject`, {
                        method: 'PATCH',
                        body: JSON.stringify({ reason: "Rejet administratif" })
                      })
                      if (!res.ok) throw new Error("Erreur lors du rejet")
                      
                      setData((prev) =>
                        prev.map((item) =>
                          item.id === p.id ? { ...item, status: "REJECTED" } : item
                        )
                      )
                      toast.error(`Inscription de ${p.nom} rejetée.`)
                    } catch (err) {
                      toast.error("Échec du rejet")
                    }
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  Refuser
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push(`/prestataires/${p.id}`)}
                  className="px-2.5 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-all cursor-pointer"
                >
                  Gérer
                </button>
                {p.status === "ACTIVE" ? (
                  <button
                    onClick={async () => {
                      try {
                        const res = await apiFetch(`/admin/prestataires/${p.id}/suspend`, {
                          method: 'PATCH',
                          body: JSON.stringify({ reason: "Suspension administrative" })
                        })
                        if (!res.ok) throw new Error("Erreur lors de la suspension")
                        
                        setData((prev) =>
                          prev.map((item) =>
                            item.id === p.id ? { ...item, status: "SUSPENDED" } : item
                          )
                        )
                        toast.warning(`Compte de ${p.nom} suspendu.`)
                      } catch (err) {
                        toast.error("Échec de la suspension")
                      }
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-all cursor-pointer"
                  >
                    Suspendre
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        const res = await apiFetch(`/admin/prestataires/${p.id}/validate`, {
                          method: 'PATCH'
                        })
                        if (!res.ok) throw new Error("Erreur lors de la réactivation")
                        
                        setData((prev) =>
                          prev.map((item) =>
                            item.id === p.id ? { ...item, status: "ACTIVE" } : item
                          )
                        )
                        toast.success(`Compte de ${p.nom} réactivé !`)
                      } catch (err) {
                        toast.error("Échec de la réactivation")
                      }
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-all cursor-pointer"
                  >
                    Activer
                  </button>
                )}
              </>
            )}
          </div>
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



  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-red-50 border border-red-200 p-6 rounded-2xl">
          <AlertTriangle className="size-12 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Échec du chargement</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#023B8A] hover:bg-[#023B8A]/90 text-white">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-6 max-w-360 mx-auto pb-10">
      
      {/* SECTION EN-TÊTE DE PAGE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Gestion des Prestataires</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Modérez les professionnels événementiels de la Côte d&apos;Ivoire (DJs, Traiteurs, Décorateurs, etc.)
          </p>
        </div>
        <div>
          <Button 
            className="bg-[#023B8A] hover:bg-[#023B8A]/90 gap-1.5 font-semibold text-xs py-2 h-9 rounded-lg"
            onClick={() => toast.success("Ouverture du panneau de création...")}
          >
            <Plus className="size-4" /> Nouveau Prestataire
          </Button>
        </div>
      </div>

      {/* BLOCS DE STATISTIQUES LUXUEUX (Tailwind v4 / HSL tailored colors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total vendors */}
        <Card className="border-slate-100 shadow-xs relative overflow-hidden bg-white hover:border-amber-200 hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardDescription className="text-amber-800 font-bold uppercase tracking-wider text-[10px]">Prestataires Inscrits</CardDescription>
              <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Briefcase className="size-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">{kpis.total}</CardTitle>
            <CardAction>
              <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold px-2 py-0.5">
                <TrendingUp className="size-3 mr-1" /> +14 ce mois
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium">
            Taux de croissance global soutenu
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card className="border-slate-100 shadow-xs relative overflow-hidden bg-white hover:border-blue-200 hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardDescription className="text-blue-800 font-bold uppercase tracking-wider text-[10px]">Abonnements Pro</CardDescription>
              <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Crown className="size-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">{kpis.abonnants}</CardTitle>
            <CardAction>
              <Badge className="bg-blue-600 text-white border-none text-[10px] font-bold px-2 py-0.5">
                Premium actif
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium">
            33% des prestataires sont Premium
          </CardContent>
        </Card>

        {/* KYC to validate */}
        <Card className="border-slate-100 shadow-xs relative overflow-hidden bg-white hover:border-red-200 hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardDescription className="text-red-800 font-bold uppercase tracking-wider text-[10px]">Fiches en Vérification</CardDescription>
              <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse">
                <AlertTriangle className="size-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 tracking-tight">{kpis.aValider}</CardTitle>
            <CardAction>
              <Badge className="bg-red-500 text-white border-none text-[10px] font-bold px-2 py-0.5">
                Urgent &lt;48h
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium">
            Documents KYC en attente de validation
          </CardContent>
        </Card>

        {/* Average note */}
        <Card className="border-slate-100 shadow-xs relative overflow-hidden bg-white hover:border-emerald-200 hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardDescription className="text-emerald-800 font-bold uppercase tracking-wider text-[10px]">Satisfaction Globale</CardDescription>
              <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Heart className="size-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">{kpis.noteMoyenne.toFixed(1)} / 5</CardTitle>
            <CardAction>
              <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold px-2 py-0.5">
                Excellent
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium">
            Basé sur les avis clients modérés
          </CardContent>
        </Card>

      </div>

      {/* SECTION TABLEAU ET FILTRES */}
      <Card className="border-slate-100 bg-white overflow-hidden shadow-xs">
        
        {/* Barre de filtrage simplifiée et responsive */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, responsable, e-mail..."
              value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn("nom")?.setFilterValue(e.target.value)}
              className="pl-9 h-8.5 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#023B8A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filtre Statut */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8.5 text-xs w-[130px] bg-white border-slate-200">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actifs</SelectItem>
                <SelectItem value="PENDING">À valider</SelectItem>
                <SelectItem value="SUSPENDED">Suspendus</SelectItem>
                <SelectItem value="EXPIRED">Expirés</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre Plan */}
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="h-8.5 text-xs w-[130px] bg-white border-slate-200">
                <SelectValue placeholder="Abonnement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les plans</SelectItem>
                <SelectItem value="FREEMIUM">FREEMIUM</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                <SelectItem value="PREMIUM_PLUS">PREMIUM PLUS</SelectItem>
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

            {/* Filtre Catégorie */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8.5 text-xs w-[150px] bg-white border-slate-200 font-medium">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "toutes" ? "Toutes les catégories" : cat}
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
                      nom: "Entreprise",
                      categorie: "Catégorie",
                      planActif: "Abonnement",
                      badgeLevel: "Badge KYC",
                      status: "Statut",
                      noteMoyenne: "Note Platform",
                      dateInscription: "Inscription",
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
                    Aucun prestataire trouvé.
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
              <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">Par page</span>
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
