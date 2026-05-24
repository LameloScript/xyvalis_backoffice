"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  FileCheck,
  FileText,
  Calendar,
  MessageSquare,
  Crown,
  TrendingUp,
  Star,
  DollarSign,
  Eye,
  Award,
  ShieldCheck,
  Percent,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Instagram,
  Facebook,
  Globe,
} from "lucide-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { useBreadcrumb } from "@/contexts/breadcrumb-context"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ── Types alignés sur schema.prisma ───────────────────────────────────────

type PrestataireStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "REJECTED"
type BadgeLevel = "NONE" | "IDENTITY_VERIFIED" | "BUSINESS_REGISTERED" | "PREMIUM_VERIFIED"
type PlanPresta = "FREEMIUM" | "PREMIUM" | "PREMIUM_PLUS"
type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED"

// ── Mock data complète et harmonieuse ──────────────────────────────────────

const defaultPrestataire = {
  id: "PRE-001",
  nom: "Alpha Sound Production",
  slug: "alpha-sound-production",
  slogan: "Le son haute fidélité pour vos grands moments",
  description: "Leader de la sonorisation et de la mise en lumière à Abidjan depuis 2018. Nous couvrons les mariages, concerts privés, séminaires corporate et galas présidentiels.",
  responsable: "Kouamé Alpha",
  email: "contact@alphasound.ci",
  telephone: "+225 07 89 01 23",
  whatsappBusiness: "+225 07 89 01 23",
  whatsappLink: "https://wa.me/22507890123",
  website: "www.alphasound.ci",
  facebookUrl: "https://facebook.com/alphasound.ci",
  instagramUrl: "https://instagram.com/alphasound_official",
  commune: "Cocody",
  ville: "Abidjan",
  zoneIntervention: "Toute la Côte d'Ivoire & Sous-région",
  categorie: "DJ & Sonorisation",
  status: "ACTIVE" as PrestataireStatus,
  badgeLevel: "PREMIUM_VERIFIED" as BadgeLevel,
  planActif: "PREMIUM_PLUS" as PlanPresta,
  noteMoyenne: 4.9,
  nombreAvis: 42,
  nombreVuesMois: 1840,
  chiffreAffairesTotal: 3850000, // En FCFA perçu
  dateInscription: "2025-10-15",
  initiales: "AS",
  noteAdminInterne: "Excellent prestataire technique avec une équipe fiable. Matériel haut de gamme. Aucun retard signalé.",
  
  // Documents KYC téléversés
  documents: [
    { type: "PIECE_IDENTITE", nom: "CNI_Kouame_Alpha.pdf", statut: "APPROVED" as DocumentStatus, date: "2025-10-15", taille: "1.4 Mo" },
    { type: "REGISTRE_COMMERCE", nom: "RC_AlphaSoundProduction.pdf", statut: "APPROVED" as DocumentStatus, date: "2025-10-16", taille: "2.8 Mo" },
    { type: "RIB", nom: "RIB_AlphaSound_Ecobank.pdf", statut: "APPROVED" as DocumentStatus, date: "2025-10-16", taille: "850 Ko" },
  ],
  
  // Devis récents perçus
  devisRecus: [
    { id: "DEV-2605-012", reference: "DEV-2605-012", date: "2026-05-20", client: "Marie-Claire Bédié (Particulier)", typeEvent: "Mariage", montant: 1200000, commission: 24000, statut: "ACCEPTED" },
    { id: "DEV-2605-004", reference: "DEV-2605-004", date: "2026-05-18", client: "Aya Event Agency (Agence)", typeEvent: "Séminaire", montant: 850000, commission: 17000, statut: "COMMISSIONED" },
    { id: "DEV-2604-184", reference: "DEV-2604-184", date: "2026-04-28", client: "Jean-Paul Koffi (Particulier)", typeEvent: "Anniversaire", montant: 450000, commission: 9000, statut: "COMMISSIONED" },
    { id: "DEV-2604-098", reference: "DEV-2604-098", date: "2026-04-12", client: "Orange CI (Corporate)", typeEvent: "Cocktail", montant: 1350000, commission: 27000, statut: "COMMISSIONED" },
  ],

  // Avis clients récents
  avis: [
    { id: "AV-001", client: "Marie-Claire B.", note: 5, commentaire: "Son absolument divin, et un show lumière à couper le souffle ! Toute notre famille a adoré.", date: "2026-05-21", statut: "PUBLISHED" },
    { id: "AV-002", client: "Sébastien K.", note: 4, commentaire: "Très bon service technique. Un tout petit retard lors de l'installation mais vite rattrapé par le professionnalisme de l'équipe.", date: "2026-05-19", statut: "PUBLISHED" },
    { id: "AV-003", client: "Fanta D.", note: 5, commentaire: "Rien à dire, le meilleur son d'Abidjan ! Recommandé les yeux fermés.", date: "2026-04-15", statut: "PUBLISHED" },
  ]
}

interface PrestataireDetailViewProps {
  id: string
}

export default function PrestataireDetailView({ id }: PrestataireDetailViewProps) {
  const router = useRouter()
  const [presta, setPresta] = React.useState<any>(defaultPrestataire)
  const [internalNote, setInternalNote] = React.useState("")
  const [status, setStatus] = React.useState<PrestataireStatus>("PENDING")
  const [documents, setDocuments] = React.useState<any[]>([])

  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { setCustomLabel } = useBreadcrumb()

  React.useEffect(() => {
    if (presta?.nom) {
      setCustomLabel(id, presta.nom)
    }
  }, [presta?.nom, id, setCustomLabel])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " F"
  }

  React.useEffect(() => {
    async function loadDetails() {
      try {
        setIsLoading(true)
        setError(null)
        
        // 1. Charger les détails du prestataire
        const prestaRes = await apiFetch(`/admin/prestataires/${id}`)
        if (!prestaRes.ok) throw new Error(`Erreur prestataire: ${prestaRes.status}`)
        const prestaJson = await prestaRes.json()
        
        // 2. Charger les documents associés
        const docsRes = await apiFetch(`/admin/documents?prestataireId=${id}`)
        if (!docsRes.ok) throw new Error(`Erreur documents: ${docsRes.status}`)
        const docsJson = await docsRes.json()

        if (prestaJson.success) {
          const item = prestaJson.data
          const mappedPresta = {
            id: item.id,
            nom: item.name ?? "Sans nom",
            slug: item.slug ?? "",
            slogan: item.slogan ?? "Le son haute fidélité pour vos grands moments",
            description: item.description ?? "Aucune description fournie.",
            responsable: item.organisation?.name ?? "Non renseigné",
            email: item.emailPublic ?? "contact@pro.ci",
            telephone: item.telephoneFixe ?? "Non renseigné",
            whatsappBusiness: item.whatsappBusiness ?? "",
            whatsappLink: item.whatsappLink ?? "",
            website: item.website ?? "",
            facebookUrl: item.facebookUrl ?? "",
            instagramUrl: item.instagramUrl ?? "",
            commune: item.commune ?? "Abidjan",
            ville: item.ville ?? "Abidjan",
            zoneIntervention: item.zoneIntervention ?? "Abidjan",
            categorie: item.categoriePrincipale?.nom ?? "Événementiel",
            status: item.status as PrestataireStatus,
            badgeLevel: item.badgeLevel as BadgeLevel,
            planActif: item.planActif as PlanPresta,
            noteMoyenne: item.noteMoyenne ?? 0.0,
            nombreAvis: item.nombreAvis ?? 0,
            nombreVuesMois: item.nombreVuesMois ?? 0,
            chiffreAffairesTotal: item.chiffreAffairesTotal ?? 120000, // fallback sur CA calculé
            dateInscription: item.createdAt ? item.createdAt.split('T')[0] : "2026-01-01",
            initiales: (item.name ?? "PR").slice(0, 2).toUpperCase(),
            noteAdminInterne: item.noteAdminInterne ?? "",
            devisRecus: item.devisRecus ?? defaultPrestataire.devisRecus,
            avis: item.avis ?? defaultPrestataire.avis
          }

          setPresta(mappedPresta)
          setInternalNote(item.noteAdminInterne ?? "")
          setStatus(item.status as PrestataireStatus)
        }

        if (docsJson.success && docsJson.data.length > 0) {
          const mappedDocs = docsJson.data.map((doc: any) => ({
            id: doc.id,
            type: doc.type,
            nom: doc.fileName ?? "Fichier.pdf",
            statut: doc.status as DocumentStatus,
            date: doc.createdAt ? doc.createdAt.split('T')[0] : "2026-01-01",
            taille: doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} Mo` : "1.2 Mo"
          }))
          setDocuments(mappedDocs)
        } else {
          // Utiliser les documents factices par défaut
          setDocuments(defaultPrestataire.documents)
        }
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Impossible de charger les détails du prestataire")
        toast.error("Erreur de chargement de la fiche")
      } finally {
        setIsLoading(false)
      }
    }

    loadDetails()
  }, [id])

  // Toggle status account (Suspendre / Réactiver)
  const handleToggleStatus = async () => {
    try {
      if (status === "ACTIVE") {
        const res = await apiFetch(`/admin/prestataires/${id}/suspend`, {
          method: 'PATCH',
          body: JSON.stringify({ reason: internalNote || "Suspension administrative" })
        })
        if (!res.ok) throw new Error("Erreur de suspension")
        setStatus("SUSPENDED")
        toast.warning("Le compte prestataire a été suspendu.")
      } else {
        const res = await apiFetch(`/admin/prestataires/${id}/validate`, {
          method: 'PATCH',
          body: JSON.stringify({ note: internalNote })
        })
        if (!res.ok) throw new Error("Erreur de réactivation")
        setStatus("ACTIVE")
        toast.success("Le compte prestataire est désormais actif.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du changement de statut")
    }
  }

  // Update a single document status
  const handleDocAction = async (type: string, action: DocumentStatus) => {
    try {
      const doc = documents.find(d => d.type === type)
      if (!doc || !doc.id) {
        // En l'absence d'ID réel (documents simulés du seed), on met à jour l'état local pour fluidifier la démo
        setDocuments((prev) =>
          prev.map((d) => (d.type === type ? { ...d, statut: action } : d))
        )
        toast.success(`[Simulé] Le document ${type} a été mis à jour en ${action}.`)
        return
      }

      const res = await apiFetch(`/admin/documents/${doc.id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: action,
          rejectionReason: action === 'REJECTED' ? 'Fichier non lisible ou non conforme' : undefined
        })
      })
      if (!res.ok) throw new Error("Erreur lors de la modération du document")

      setDocuments((prev) =>
        prev.map((d) => (d.type === type ? { ...d, statut: action } : d))
      )
      if (action === "APPROVED") {
        toast.success(`Le document ${type} a été approuvé.`)
      } else {
        toast.error(`Le document ${type} a été rejeté.`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible de modifier le statut du document")
    }
  }

  const handleSaveNote = async () => {
    try {
      const res = await apiFetch(`/admin/prestataires/${id}/validate`, {
        method: 'PATCH',
        body: JSON.stringify({ note: internalNote })
      })
      if (!res.ok) throw new Error("Erreur de mise à jour")
      toast.success("La note administrative interne a été mise à jour.")
    } catch (err) {
      toast.error("Erreur de mise à jour")
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 mt-4 lg:px-6 space-y-6 max-w-360 mx-auto pb-12 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
            <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-4 w-48 bg-slate-100 rounded"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 border border-slate-100 rounded-xl bg-white p-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
                <div className="size-8 bg-slate-100 rounded-lg"></div>
              </div>
              <div className="h-6 w-20 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Columns Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (Main content) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-slate-100 bg-white rounded-xl p-6 space-y-4">
              <div className="h-5 w-36 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-16 bg-slate-50 border border-slate-100 rounded-lg p-4 flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      <div className="h-3 w-16 bg-slate-100 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            <div className="border border-slate-100 bg-white rounded-xl p-6 space-y-4">
              <div className="h-5 w-24 bg-slate-200 rounded"></div>
              <div className="flex items-center gap-3">
                <div className="size-12 bg-slate-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-slate-200 rounded"></div>
                  <div className="h-3 w-16 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                {Array.from({ length: 3 }).map((_, k) => (
                  <div key={k} className="h-4 bg-slate-100 rounded w-full"></div>
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
      <div className="px-4 mt-4 lg:px-6 space-y-4 max-w-360 mx-auto pb-12">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/prestataires")} 
          className="h-8 gap-1.5 pl-1.5 text-muted-foreground hover:bg-slate-100 transition-all font-semibold"
        >
          <ArrowLeft className="size-4" />
          Retour aux prestataires
        </Button>
        <Card className="border-red-100 bg-red-50/30">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="text-red-500 font-semibold text-lg">Erreur de chargement</div>
            <p className="text-slate-600 text-sm max-w-md mx-auto">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50/50">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-6 max-w-360 mx-auto pb-12">
      
      {/* SECTION BREADCRUMB & HEADER */}
      <div className="flex flex-col gap-3">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1.5 pl-1.5 text-muted-foreground hover:bg-slate-100 transition-all font-semibold cursor-pointer mb-2"
            onClick={() => router.push("/prestataires")}
          >
            <ArrowLeft className="size-4" />
            Retour aux prestataires
          </Button>
          
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">{presta.nom}</h1>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className={`border-none rounded-full py-0.5 px-2.5 text-[10px] font-bold ${
                status === "ACTIVE" 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "bg-red-50 text-red-700"
              }`}>
                {status === "ACTIVE" ? "Actif" : "Suspendu"}
              </Badge>
              {presta.planActif === "PREMIUM_PLUS" && (
                <Badge variant="outline" className="border-none bg-blue-50 text-blue-700 rounded-full py-0.5 px-2.5 text-[10px] font-bold flex items-center gap-1">
                  <Crown className="size-3 text-blue-500 fill-blue-500" /> Premium+
                </Badge>
              )}
              {presta.planActif === "PREMIUM" && (
                <Badge variant="outline" className="border-none bg-amber-50 text-amber-700 rounded-full py-0.5 px-2.5 text-[10px] font-bold flex items-center gap-1">
                  <Crown className="size-3 text-amber-500 fill-amber-500" /> Premium
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Fiche unique : <span className="font-mono font-bold text-slate-700">{presta.id}</span> · Inscrit le{" "}
            {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(presta.dateInscription))}
          </p>
        </div>

        {/* Quick controls bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8.5 font-semibold text-xs gap-1.5 hover:border-amber-300 hover:bg-amber-50 transition-all"
            onClick={() => window.open(presta.whatsappLink, "_blank")}
          >
            <MessageSquare className="size-4 text-emerald-600 fill-emerald-100" /> Contacter Pro (WhatsApp)
          </Button>
          <Button 
            variant={status === "ACTIVE" ? "destructive" : "outline"} 
            size="sm" 
            className="h-8.5 font-semibold text-xs transition-all"
            onClick={handleToggleStatus}
          >
            {status === "ACTIVE" ? "Suspendre l'abonné" : "Réactiver le compte"}
          </Button>
        </div>
      </div>

      {/* BLOCS DE MÉTRIQUES SPÉCIFIQUES PRESTATAIRE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Note platform */}
        <Card className="border-slate-100 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Note Platform</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              {presta.noteMoyenne} / 5
              <div className="flex text-amber-400">
                <Star className="size-5 fill-current" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium">
            Basé sur <strong className="text-slate-800">{presta.nombreAvis}</strong> avis clients publiés
          </CardContent>
        </Card>

        {/* Metric 2: Revenue generated */}
        <Card className="border-slate-100 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Chiffre d&apos;Affaires</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">
              {formatCurrency(presta.chiffreAffairesTotal)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium flex items-center justify-between">
            <span>Commission 2% :</span>
            <strong className="text-indigo-600 font-bold">{formatCurrency(presta.chiffreAffairesTotal * 0.02)}</strong>
          </CardContent>
        </Card>

        {/* Metric 3: Quotes count */}
        <Card className="border-slate-100 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Devis Convertis</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">
              {presta.devisRecus.filter((d: any) => d.statut === "COMMISSIONED" || d.statut === "ACCEPTED").length} / {presta.devisRecus.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium">
            Taux de conversion : <strong className="text-emerald-600 font-bold">75%</strong>
          </CardContent>
        </Card>

        {/* Metric 4: Views */}
        <Card className="border-slate-100 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Visibilité Profil</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              {presta.nombreVuesMois.toLocaleString("fr-FR")}
              <span className="text-[11px] font-semibold text-muted-foreground font-medium">vues / mois</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-[11px] text-muted-foreground font-medium flex items-center gap-1 text-emerald-600 font-semibold">
            <TrendingUp className="size-3.5" /> +18% de trafic ce mois
          </CardContent>
        </Card>

      </div>

      {/* DISPOSITION DOUBLE COLONNE : CONTENU PRINCIPAL À GAUCHE, DETAILS À DROITE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLONNE GAUCHE (ColSpan 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Documents KYC Checklist */}
          <Card className="border-slate-100 bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b pb-4 bg-slate-50/20">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                <FileCheck className="size-5 text-indigo-600" />
                <span>Documents Administratifs & KYC</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Modérez et certifiez les fichiers de l&apos;entreprise pour lui délivrer des badges de confiance
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-6">Document requis</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-4">Nom de fichier</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-4">Statut</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-4 text-right">Actions de modération</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <TableRow key={doc.type} className="hover:bg-slate-50/20">
                      <TableCell className="font-bold text-slate-700 text-xs px-6 py-4">
                        {doc.type === "PIECE_IDENTITE" && "Pièce d'Identité (CNI / Passeport)"}
                        {doc.type === "REGISTRE_COMMERCE" && "Registre de Commerce (DFE)"}
                        {doc.type === "RIB" && "Relevé d'Identité Bancaire (RIB)"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground px-4 py-4 shrink-0">
                        <div className="flex items-center gap-1.5 font-medium">
                          <FileText className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px] text-slate-600">{doc.nom}</span>
                          <span className="text-[10px] text-slate-400">({doc.taille})</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        {doc.statut === "APPROVED" && (
                          <Badge variant="outline" className="border-none bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                            Certifié
                          </Badge>
                        )}
                        {doc.statut === "PENDING" && (
                          <Badge variant="outline" className="border-none bg-amber-50 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                            En examen
                          </Badge>
                        )}
                        {doc.statut === "REJECTED" && (
                          <Badge variant="outline" className="border-none bg-red-50 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                            Rejeté
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <div className="flex gap-1.5 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-[10px] border-slate-200 hover:bg-slate-50"
                            onClick={() => toast.success(`Visualisation en ligne du fichier ${doc.nom}`)}
                          >
                            <Eye className="size-3 mr-1" /> Ouvrir
                          </Button>
                          {doc.statut !== "APPROVED" && (
                            <Button 
                              size="sm" 
                              className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                              onClick={() => handleDocAction(doc.type, "APPROVED")}
                            >
                              Approuver
                            </Button>
                          )}
                          {doc.statut !== "REJECTED" && (
                            <Button 
                              size="sm" 
                              className="h-7 text-[10px] text-red-600 bg-red-50 hover:bg-red-100 font-bold"
                              onClick={() => handleDocAction(doc.type, "REJECTED")}
                            >
                              Rejeter
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* 2. Devis Reçus History (Workflow commissionné) */}
          <Card className="border-slate-100 bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b pb-4 bg-slate-50/20">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                <Percent className="size-5 text-emerald-600" />
                <span>Registre des Devis & Volume D&apos;Affaires</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Historique des transactions conclues via la plateforme. Taux de prélèvement fixé à 2% commission plateforme.
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-6">Réf. Devis</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-4">Client</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-4">Événement</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-4 text-right">Montant Brut</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-4 text-right">Commission (2%)</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-3.5 px-6">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {presta.devisRecus.map((d: any) => (
                    <TableRow key={d.id} className="hover:bg-slate-50/20">
                      <TableCell className="font-mono text-xs px-6 py-4 font-bold text-indigo-600">{d.reference}</TableCell>
                      <TableCell className="text-xs text-slate-700 font-semibold px-4 py-4">{d.client}</TableCell>
                      <TableCell className="text-xs text-slate-600 font-medium px-4 py-4">{d.typeEvent}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-800 text-right tabular-nums px-4 py-4">
                        {formatCurrency(d.montant)}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-indigo-600 text-right tabular-nums px-4 py-4">
                        {formatCurrency(d.commission)}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {d.statut === "COMMISSIONED" && (
                          <Badge variant="outline" className="border-none bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2 py-0.5 rounded-full">
                            ● Payée
                          </Badge>
                        )}
                        {d.statut === "ACCEPTED" && (
                          <Badge variant="outline" className="border-none bg-blue-50 text-blue-700 font-bold text-[9px] px-2 py-0.5 rounded-full">
                            ● Signée (séquestre)
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* 3. Avis clients récents */}
          <Card className="border-slate-100 bg-white shadow-xs">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Star className="size-5 text-amber-500 fill-amber-400" />
                <span>Modération des Avis Clients</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Contrôlez les commentaires publiés sur le profil public pour assurer la conformité de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {presta.avis.map((av: any) => (
                <div key={av.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl flex items-start gap-4 justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-xs">{av.client}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: av.note }).map((_, i) => (
                          <Star key={i} className="size-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold font-mono">{av.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                      &ldquo;{av.commentaire}&rdquo;
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-[10px] border-slate-200 hover:bg-slate-100 text-slate-600"
                      onClick={() => toast.success("L'avis a été archivé/masqué.")}
                    >
                      Masquer
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-7 text-[10px] font-semibold"
                      onClick={() => toast.error("Avis supprimé pour non-conformité.")}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* COLONNE DROITE (ColSpan 1) */}
        <div className="space-y-6">
          
          {/* 1. Profil / Identité */}
          <Card className="border-slate-100 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                <Briefcase className="size-4 text-slate-500" />
                <span>Fiche d&apos;Identité Pro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg bg-[#023B8A]/10 text-[#023B8A] flex items-center justify-center font-bold text-lg">
                  {presta.initiales}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{presta.nom}</h3>
                  <p className="text-[10px] text-[#D4A827] font-bold mt-0.5">{presta.categorie}</p>
                </div>
              </div>
              
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Slogan</p>
                <p className="text-slate-600 font-semibold italic">{presta.slogan}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Description</p>
                <p className="text-slate-600 leading-relaxed font-medium">{presta.description}</p>
              </div>

              <Separator />

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Phone className="size-3.5 text-slate-400 shrink-0" />
                  <span>{presta.telephone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{presta.email}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 font-medium">
                  <MapPin className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{presta.commune} · Intervention: {presta.zoneIntervention}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Calendar className="size-3.5 text-slate-400 shrink-0" />
                  <span>Inscrit en Octobre 2025</span>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                {presta.website && (
                  <a href={`https://${presta.website}`} target="_blank" rel="noreferrer" className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                    <Globe className="size-3.5" />
                  </a>
                )}
                {presta.instagramUrl && (
                  <a href={presta.instagramUrl} target="_blank" rel="noreferrer" className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                    <Instagram className="size-3.5" />
                  </a>
                )}
                {presta.facebookUrl && (
                  <a href={presta.facebookUrl} target="_blank" rel="noreferrer" className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                    <Facebook className="size-3.5" />
                  </a>
                )}
              </div>

            </CardContent>
          </Card>

          {/* 2. Abonnement details */}
          <Card className="border-slate-100 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                <Crown className="size-4 text-indigo-600 fill-indigo-50" />
                <span>Facturation & Abonnement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Formule active</span>
                <span className="font-bold text-blue-600">{presta.planActif}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Tarif mensuel</span>
                <span className="font-bold text-slate-800 tabular-nums">60 000 F FCFA</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Date d&apos;échéance</span>
                <span className="font-semibold text-slate-600 font-mono">15 Juin 2026</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Méthode habituelle</span>
                <Badge variant="outline" className="border-none bg-indigo-50 text-indigo-700 font-bold text-[9px] py-0.5">
                  WAVE MOBILE
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 3. Internal Admin Note */}
          <Card className="border-slate-100 bg-white shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                <FileText className="size-4 text-slate-500" />
                <span>Note Interne Superadmin</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <textarea 
                className="w-full h-24 p-2.5 text-xs font-semibold text-slate-700 bg-slate-50/50 border border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#023B8A] focus:outline-none"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Renseignez ici des commentaires sur la fiabilité, les retards, ou des arrangements tarifaires particuliers avec ce prestataire..."
              />
              <Button 
                size="sm" 
                className="w-full bg-[#023B8A] hover:bg-[#023B8A]/90 text-xs font-bold h-8.5 rounded-lg cursor-pointer"
                onClick={handleSaveNote}
              >
                Enregistrer la note
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  )
}
