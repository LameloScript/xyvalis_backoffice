"use client"

import * as React from "react"
import {
  Users,
  Briefcase,
  FileText,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Star,
  ShieldCheck
} from "lucide-react"
import { toast } from "sonner"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Types pour correspondre exactement à la structure du JSON de l'API
export interface DashboardData {
  prestataires: {
    total: number
    actives: number
    pending: number
    nouveauxDernier30j: number
  }
  organisations: {
    total: number
  }
  devis: {
    total: number
    commissionnes: number
  }
  revenus: {
    mrrEstime: number
    chiffreAffairesPlateforme: number
    commissionsBrutes: number
    commissionsNettes: number
    cashbackVerse: number
  }
  qualite: {
    noteMoyenne: number
  }
  modeoration: {
    documentsEnAttente: number
    avisEnAttente: number
  }
  topPrestataires: Array<{
    id: string
    nom: string
    plan: string
    categorie: string
    note: number
    chiffreAffaire: number
  }>
}

// Données du graphique historique de chiffre d'affaires
import dashboardMockData from "@/data/mock/dashboard.json"

const revenueChartData = dashboardMockData.revenueChartData

export default function DashboardView() {
  const now = new Date()
  const greeting = getGreeting(now)
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now)

  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 1. Initialisation de l'état réactif avec la structure exacte de votre JSON API
  const [dashboardData, setDashboardData] = React.useState<DashboardData>({
    prestataires: {
      total: 0,
      actives: 0,
      pending: 0,
      nouveauxDernier30j: 0,
    },
    organisations: {
      total: 0,
    },
    devis: {
      total: 0,
      commissionnes: 0,
    },
    revenus: {
      mrrEstime: 0,
      chiffreAffairesPlateforme: 0,
      commissionsBrutes: 0,
      commissionsNettes: 0,
      cashbackVerse: 0,
    },
    qualite: {
      noteMoyenne: 0,
    },
    modeoration: {
      documentsEnAttente: 0,
      avisEnAttente: 0,
    },
    topPrestataires: []
  })

  // Liste des inscriptions à valider réactive
  const [pendingRegistrations, setPendingRegistrations] = React.useState<any[]>([])

  // Charger les données de l'API
  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        setError(null)
        
        // 1. Charger les KPIs du dashboard
        const dashRes = await apiFetch("/admin/dashboard")
        if (!dashRes.ok) throw new Error(`Erreur dashboard: ${dashRes.status}`)
        const dashJson = await dashRes.json()
        
        // 2. Charger la file d'attente de validation
        const valRes = await apiFetch("/admin/validations")
        if (!valRes.ok) throw new Error(`Erreur validations: ${valRes.status}`)
        const valJson = await valRes.json()

        if (dashJson.success) {
          const rawData = dashJson.data
          
          // Mapper topPrestataires vers le format attendu par l'UI
          const mappedTop = (rawData.topPrestataires || []).map((tp: any, index: number) => {
            const defaults = dashboardMockData.defaults
            const def = defaults[index] ?? { nom: `Prestataire #${tp.prestataireId.slice(0, 6)}`, plan: "Premium", categorie: "Événementiel", note: 4.7 }
            return {
              id: tp.prestataireId,
              nom: def.nom,
              plan: def.plan,
              categorie: def.categorie,
              note: def.note,
              chiffreAffaire: (tp._count ?? 1) * 60000 // estimation basique
            }
          })

          setDashboardData({
            prestataires: rawData.prestataires ?? { total: 0, actives: 0, pending: 0, nouveauxDernier30j: 0 },
            organisations: rawData.organisations ?? { total: 0 },
            devis: rawData.devis ?? { total: 0, commissionnes: 0 },
            // Correction de la faute d'orthographe "reventus" dans l'API
            revenus: rawData.reventus ?? rawData.revenus ?? { mrrEstime: 0, chiffreAffairesPlateforme: 0, commissionsBrutes: 0, commissionsNettes: 0, cashbackVerse: 0 },
            qualite: rawData.qualite ?? { noteMoyenne: 0 },
            modeoration: rawData.modeoration ?? { documentsEnAttente: 0, avisEnAttente: 0 },
            topPrestataires: mappedTop
          })
        }

        if (valJson.success) {
          // Mapper la liste de validation
          const mappedPending = (valJson.data || []).map((v: any) => ({
            id: v.id,
            nom: v.name,
            responsable: v.organisation?.name ?? "Responsable",
            email: v.organisationPublicEmail ?? "contact@pro.ci",
            telephone: v.telephone ?? "Non renseigné",
            categorie: v.categoriePrincipale?.nom ?? "Événementiel",
            commune: v.commune ?? "Abidjan",
            plan: v.planActif ?? "FREEMIUM",
            date: new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(v.createdAt)),
            initiales: (v.name ?? "PR").slice(0, 2).toUpperCase()
          }))
          setPendingRegistrations(mappedPending)
        }
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la récupération des données.")
        toast.error("Impossible de charger les données du dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleApprove = async (id: string, name: string) => {
    try {
      const res = await apiFetch(`/admin/prestataires/${id}/validate`, {
        method: 'PATCH'
      })
      if (!res.ok) throw new Error("Erreur réseau lors de la validation")
      
      setPendingRegistrations(prev => prev.filter(p => p.id !== id))
      setDashboardData(prev => ({
        ...prev,
        prestataires: {
          ...prev.prestataires,
          actives: prev.prestataires.actives + 1,
          pending: Math.max(0, prev.prestataires.pending - 1)
        }
      }))
      toast.success(`Le prestataire ${name} a été approuvé avec succès !`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la validation")
    }
  }

  const handleReject = async (id: string, name: string) => {
    try {
      const res = await apiFetch(`/admin/prestataires/${id}/reject`, {
        method: 'PATCH'
      })
      if (!res.ok) throw new Error("Erreur réseau lors du rejet")
      
      setPendingRegistrations(prev => prev.filter(p => p.id !== id))
      setDashboardData(prev => ({
        ...prev,
        prestataires: {
          ...prev.prestataires,
          pending: Math.max(0, prev.prestataires.pending - 1)
        }
      }))
      toast.error(`Inscription de ${name} refusée.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du rejet")
    }
  }

  // Formatage monétaire
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR").format(value) + " F"
  }

  // Formatage des grands nombres compacts
  const formatCompactNumber = (value: number) => {
    return new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(value)
  }

  if (isLoading) {
    return (
      <div className="px-4 mt-6 lg:px-6 space-y-6 max-w-360 mx-auto pb-12 animate-pulse">
        {/* SECTION ACCUEIL & GREETING SKELETON */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
            <div className="h-4 w-48 bg-slate-100 rounded"></div>
          </div>
          <div className="h-10 w-44 bg-slate-200 rounded-lg"></div>
        </div>

        {/* DISPOSITION EN GRILLE - RANGÉE 1 SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* COLONNE GAUCHE : SQUELETTE GRAPHIQUE */}
          <div className="lg:col-span-3">
            <div className="border border-slate-100 bg-white rounded-2xl p-6 h-full space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <div className="space-y-2">
                  <div className="h-5 w-56 bg-slate-200 rounded"></div>
                  <div className="h-3 w-72 bg-slate-100 rounded"></div>
                </div>
                <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-[230px] w-full bg-slate-50 rounded-xl flex items-end justify-between p-4 gap-2">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className="w-full bg-slate-200/60 rounded-t" 
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
                <div className="h-4 w-32 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : 4 KPI CARDS SKELETON */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-slate-100 bg-white rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
                  <div className="size-8 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="h-8 w-28 bg-slate-200 rounded"></div>
                <div className="h-4 w-36 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* DISPOSITION EN GRILLE - RANGÉE 2 SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* SQUELETTE ACTIONS & COMMANDES */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-slate-100 bg-white rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-slate-200 rounded"></div>
                  <div className="h-3.5 w-64 bg-slate-100 rounded"></div>
                </div>
                <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="size-9 bg-slate-200 rounded-lg"></div>
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-slate-200 rounded"></div>
                        <div className="h-2.5 w-20 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-12 bg-slate-100 rounded"></div>
                      <div className="h-6 w-14 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SQUELETTE ACTIVITÉS RÉCENTES / TOP PRESTATAIRES */}
          <div className="lg:col-span-2">
            <div className="border border-slate-100 bg-white rounded-2xl p-6 space-y-4 h-full">
              <div className="pb-4 border-b border-slate-50 space-y-2">
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
                <div className="h-3.5 w-44 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, k) => (
                  <div key={k} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-100 rounded-full"></div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-24 bg-slate-200 rounded"></div>
                        <div className="h-2.5 w-16 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="h-3.5 w-12 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
    <div className="px-4 mt-6 lg:px-6 space-y-6 max-w-360 mx-auto pb-12">
      
      {/* SECTION ACCUEIL & GREETING - Premium font-size upgrade */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{greeting}, Superadmin !</h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Portail Event Reco Africa · <span className="capitalize">{formattedDate}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            size="default" 
            className="h-10 bg-[#023B8A] hover:bg-[#023B8A]/95 text-white gap-1.5 font-semibold transition-all shadow-sm px-4"
            onClick={() => toast.success("Ouverture du formulaire d'ajout prestataire...")}
          >
            <Plus className="size-4" /> Nouveau Prestataire
          </Button>
        </div>
      </div>

      {/* DISPOSITION EN GRILLE - RANGÉE 1 : GRAPHIQUE À GAUCHE (3/5) + 4 KPIs À DROITE (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* COLONNE GAUCHE : GRAPHIQUE CA MENSUEL */}
        <div className="lg:col-span-3">
          <Card className="border-slate-200 bg-white shadow-xs flex flex-col justify-between h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  CA mensuel via Event Reco (FCFA)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Répartition mensuelle des abonnements et des commissions perçues
                </CardDescription>
              </div>
              <Badge className="bg-[#023B8A]/10 hover:bg-[#023B8A]/15 text-[#023B8A] border-none font-semibold px-2.5 py-1 text-[10px]">
                12 derniers mois
              </Badge>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col justify-between">
              <div className="h-[250px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueChartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAbonnements" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#023B8A" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#023B8A" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#963B05" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#963B05" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#963B05" />
                    <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      tickFormatter={(val) => `${val / 1000000}M`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(Number(value)), ""]}
                      contentStyle={{ background: "#FFFFFF", border: "1px solid #963B05", borderRadius: "6px", fontSize: 11, color: "#1E293B" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10, color: "#475569" }} />
                    <Area 
                      type="monotone" 
                      dataKey="Abonnements" 
                      stroke="#023B8A" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorAbonnements)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Commissions" 
                      stroke="#963B05" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorCommissions)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-sm text-slate-500">
                  Total cumulé (1 an) : <strong className="text-slate-800 text-base font-semibold">44,9M FCFA</strong>
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="size-3.5" /> +18% vs période précédente (N-1)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLONNE DROITE : 4 KPI CARDS EN GRILLE 2X2 */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
          {/* Prestataires */}
          <Card className="bg-[#023B8A] border-[#023B8A] shadow-xs text-white transition-all hover:bg-[#023B8A]/95">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardDescription className="text-blue-200/90 font-bold uppercase tracking-wider text-[11px]">Prestataires Totaux</CardDescription>
                <div className="size-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <Briefcase className="size-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white tracking-tight mt-1">
                {dashboardData.prestataires.total}
              </CardTitle>
              <div className="mt-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px] font-bold px-2 py-0.5">
                  <TrendingUp className="size-3 mr-1 inline" /> +{dashboardData.prestataires.nouveauxDernier30j} ce mois
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3 text-xs text-blue-100/80 font-medium">
              <span className="text-emerald-300 font-semibold">{dashboardData.prestataires.actives}</span> actifs · <span className="text-amber-300 font-semibold">{dashboardData.prestataires.pending}</span> en vérif.
            </CardContent>
          </Card>

          {/* Visiteurs / Organisateurs */}
          <Card className="bg-[#023B8A] border-[#023B8A] shadow-xs text-white transition-all hover:bg-[#023B8A]/95">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardDescription className="text-blue-200/90 font-bold uppercase tracking-wider text-[11px]">Organisateurs Inscrits</CardDescription>
                <div className="size-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <Users className="size-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white tracking-tight mt-1">
                {new Intl.NumberFormat("fr-FR").format(dashboardData.organisations.total)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 text-xs text-blue-100/80 font-medium mt-6">
              Organisateurs uniques actifs sur la plateforme
            </CardContent>
          </Card>

          {/* Devis */}
          <Card className="bg-[#023B8A] border-[#023B8A] shadow-xs text-white transition-all hover:bg-[#023B8A]/95">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardDescription className="text-blue-200/90 font-bold uppercase tracking-wider text-[11px]">Devis Actifs</CardDescription>
                <div className="size-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <FileText className="size-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white tracking-tight mt-1">
                {dashboardData.devis.total}
              </CardTitle>
              <div className="mt-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px] font-bold px-2 py-0.5">
                  <TrendingUp className="size-3 mr-1 inline" /> +28 aujourd&apos;hui
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3 text-xs text-blue-100/80 font-medium">
              <span className="text-emerald-300 font-semibold">{dashboardData.devis.commissionnes}</span> convertis & commissionnés
            </CardContent>
          </Card>

          {/* CA & Commissions (Volume Transactionnel) */}
          <Card className="bg-[#023B8A] border-[#023B8A] shadow-xs text-white transition-all hover:bg-[#023B8A]/95">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardDescription className="text-blue-200/90 font-bold uppercase tracking-wider text-[11px]">Volume Transactionnel</CardDescription>
                <div className="size-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <Wallet className="size-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white tracking-tight mt-1">
                {formatCompactNumber(dashboardData.revenus.chiffreAffairesPlateforme)} <span className="text-xs font-semibold text-blue-200">FCFA</span>
              </CardTitle>
              <div className="mt-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px] font-bold px-2 py-0.5">
                  <TrendingUp className="size-3 mr-1 inline" /> +18% ce mois
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3 text-xs text-blue-100/80 font-medium">
              <span className="text-white font-semibold">{formatCompactNumber(dashboardData.revenus.commissionsBrutes)}</span> comm. · <span className="text-[#D4A827] font-semibold">{formatCompactNumber(dashboardData.revenus.mrrEstime)}</span> MRR
            </CardContent>
          </Card>
        </div>

      </div>

      {/* DISPOSITION EN GRILLE - RANGÉE 2 : CENTRE D'ACTIONS À GAUCHE (3/5) + TOP PRESTATAIRES À DROITE (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* CENTRE D'ACTIONS SUPERADMIN & ALERTES/MODÉRATION */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Card 1: Centre d'Actions Superadmin (Inscriptions) */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Centre d&apos;Actions Superadmin</span>
                </CardTitle>
                {pendingRegistrations.length > 0 && (
                  <Badge className="bg-amber-50 border border-amber-200 hover:bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                    {pendingRegistrations.length} inscriptions
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Dossiers d&apos;inscription en attente de validation par le superadmin
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between pb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inscriptions en attente de validation</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs font-bold text-[#023B8A] hover:bg-transparent flex items-center gap-0.5 cursor-pointer"
                  onClick={() => toast.info("Accès aux validations complètes...")}
                >
                  Tout voir <ArrowRight className="size-3" />
                </Button>
              </div>

              {pendingRegistrations.length > 0 ? (
                <div className="space-y-3">
                  {pendingRegistrations.map((p) => (
                    <div key={p.id} className="p-3.5 bg-white border border-slate-150 rounded-lg flex items-center justify-between hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{p.nom}</p>
                          <p className="text-xs text-slate-500 mt-1">{p.categorie} · {p.commune}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => handleReject(p.id, p.nom)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded border border-slate-200 hover:border-red-200 transition-all cursor-pointer"
                        >
                          Refuser
                        </button>
                        <button
                          onClick={() => handleApprove(p.id, p.nom)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-[#023B8A] hover:bg-[#023B8A]/90 rounded transition-all cursor-pointer shadow-2xs"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <p className="text-sm text-slate-400 font-medium">Aucune inscription en attente de modération</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Alertes & Modération de l'API */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900">
                  Alertes & Modération de l&apos;API
                </CardTitle>
                {(dashboardData.modeoration.documentsEnAttente > 0 || dashboardData.modeoration.avisEnAttente > 0) && (
                  <Badge className="bg-blue-50 border border-blue-200 hover:bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5">
                    {dashboardData.modeoration.documentsEnAttente + dashboardData.modeoration.avisEnAttente} tâches
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Suivi de conformité KYC et modération des commentaires clients
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Documents en attente KYC */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-md bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">Vérifications KYC</p>
                      <p className="text-xs text-slate-500 mt-1">
                        <strong>{dashboardData.modeoration.documentsEnAttente}</strong> docs en attente
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs font-bold text-[#023B8A] hover:bg-slate-100 px-3 cursor-pointer"
                    onClick={() => toast.info("Ouverture du panneau KYC complet...")}
                  >
                    Traiter
                  </Button>
                </div>

                {/* Avis en attente de modération */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-md bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Star className="size-4.5 fill-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">Modération Avis</p>
                      <p className="text-xs text-slate-500 mt-1">
                        <strong>{dashboardData.modeoration.avisEnAttente}</strong> avis à valider
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs font-bold text-[#023B8A] hover:bg-slate-100 px-3 cursor-pointer"
                    onClick={() => toast.info("Ouverture de la modération des commentaires...")}
                  >
                    Modérer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLONNE DROITE : CLASSEMENT TOP PRESTATAIRES & LITIGE CRITIQUE */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white shadow-xs flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Top Prestataires de la Plateforme</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Classement basé sur le volume d&apos;affaires généré et la satisfaction client
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <div className="divide-y divide-slate-100">
                {dashboardData.topPrestataires.map((tp, idx) => (
                  <div key={tp.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate flex items-center gap-1.5">
                          <span>{tp.nom}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded">
                            {tp.plan}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{tp.categorie}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCompactNumber(tp.chiffreAffaire)} Fcfa CA</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-bold text-amber-700">
                        <Star className="size-3 fill-amber-500 text-amber-500" />
                        <span>{tp.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card: Litiges Critiques sous forme de liste */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Litiges critiques</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Signalements nécessitant une modération immédiate
                </CardDescription>
              </div>
              <Badge className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 animate-pulse">
                Action requise
              </Badge>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="divide-y divide-slate-100">
                
                {/* Litige 1 */}
                <div className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate flex items-center gap-1.5">
                        <span>FastDeco CI</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-100 shrink-0">
                          3 signalements
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-[220px]">
                        Contenu suspect sur le catalogue
                      </p>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs font-bold text-[#023B8A] hover:bg-slate-100 px-2.5 cursor-pointer"
                      onClick={() => toast.info("Ouverture du litige FastDeco CI...")}
                    >
                      Examiner
                    </Button>
                  </div>
                </div>

                {/* Litige 2 */}
                <div className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate flex items-center gap-1.5">
                        <span>Lumière & Décors CI</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-100 shrink-0">
                          1 signalement
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-[220px]">
                        Défaut de service signalé (mariage)
                      </p>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs font-bold text-[#023B8A] hover:bg-slate-100 px-2.5 cursor-pointer"
                      onClick={() => toast.info("Ouverture du litige Lumière & Décors...")}
                    >
                      Examiner
                    </Button>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
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
