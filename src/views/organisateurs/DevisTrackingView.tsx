"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingDown,
  Info,
  FileText,
  MapPin,
  Users,
  CalendarDays,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// ─────────────────────────────────────────────────────────────────────────────
// Base de données mock centralisée — reflète OrganisateurDetailView.fallbackClient
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_DEVIS_DB: Record<string, {
  reference: string
  prestataire: string
  date: string
  montant: number
  statut: string
  typeeventement: string
  lieu: string
  nbInvites: string
  message: string
  reponsePresta?: string
  lignes?: { designation: string; quantite: number; prixUnitaire: number; totalLigne: number }[]
  versions?: {
    versionLabel: string
    name: string
    reference: string
    date: string
    montant: number
    statut: string
    message: string
    reponsePresta: string
    lignes: { designation: string; quantite: number; prixUnitaire: number; totalLigne: number }[]
    notesChangements: string
  }[]
}> = {
  "DEV-2605-003": {
    reference: "DEV-2605-003",
    prestataire: "Marie-Claire Déco",
    date: "2026-05-20",
    montant: 470000,
    statut: "Commissionné",
    typeeventement: "Mariage",
    lieu: "Sofitel Abidjan, Cocody",
    nbInvites: "350",
    message: "Je valide cette version finale (V3) suite à nos échanges. Merci de lancer la facturation.",
    reponsePresta: "Proposition finale acceptée. Acompte 50% reçu, prestation commissionnée.",
    lignes: [
      { designation: "Décoration florale de table haute couture (Centre XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
      { designation: "Arche florale géante simplifiée (Version Négociée)", quantite: 1, prixUnitaire: 120000, totalLigne: 120000 },
    ],
    versions: [
      {
        versionLabel: "V1",
        name: "Version Initiale",
        reference: "DEV-2605-001",
        date: "2026-05-10",
        montant: 600000,
        statut: "Annulé",
        message: "Bonjour, je recherche une prestation de décoration florale haut de gamme pour mon mariage au Sofitel, tons pastel uniquement.",
        reponsePresta: "Proposition initiale : arche florale prestige, décoration de table haute couture et bouquet de mariée premium.",
        lignes: [
          { designation: "Décoration florale de table haute couture (Centre XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
          { designation: "Arche florale d'extérieur prestige", quantite: 1, prixUnitaire: 170000, totalLigne: 170000 },
          { designation: "Bouquet de mariée premium tons pastel", quantite: 1, prixUnitaire: 80000, totalLigne: 80000 },
        ],
        notesChangements: "Devis initial complet.",
      },
      {
        versionLabel: "V2",
        name: "Version Négociée (V2)",
        reference: "DEV-2605-002",
        date: "2026-05-15",
        montant: 520000,
        statut: "Négociation",
        message: "Budget max pour l'arche : 120 000 F au lieu de 170 000 F. Nous avons retiré le bouquet de mariée premium.",
        reponsePresta: "Proposition révisée : bouquet retiré. Arche conservée à 170 000 F en attente de simplification.",
        lignes: [
          { designation: "Décoration florale de table haute couture (Centre XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
          { designation: "Arche florale prestige (En attente de simplification)", quantite: 1, prixUnitaire: 170000, totalLigne: 170000 },
        ],
        notesChangements: "Retrait bouquet de mariée (-80 000 F). Arche conservée à 170 000 F.",
      },
      {
        versionLabel: "V3",
        name: "Version Finale (V3)",
        reference: "DEV-2605-003",
        date: "2026-05-20",
        montant: 470000,
        statut: "Commissionné",
        message: "Je valide cette version finale (V3) suite à nos échanges. Merci de lancer la facturation.",
        reponsePresta: "Proposition finale acceptée. Arche redimensionnée à 120 000 F. Acompte 50% reçu.",
        lignes: [
          { designation: "Décoration florale de table haute couture (Centre XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
          { designation: "Arche florale géante simplifiée (Version Négociée)", quantite: 1, prixUnitaire: 120000, totalLigne: 120000 },
        ],
        notesChangements: "Simplification de l'arche (-50 000 F). Devis final validé.",
      },
    ],
  },
  "DEV-2604-002": {
    reference: "DEV-2604-002",
    prestataire: "Alpha Sound Production",
    date: "2026-04-25",
    montant: 95000,
    statut: "Accepté",
    typeeventement: "Mariage",
    lieu: "Cocody, Abidjan",
    nbInvites: "150",
    message: "Recherche sonorisation de pointe pour un mariage de 150 personnes.",
    reponsePresta: "Proposition acceptée. Installation le jour J incluse, régie lumière et micros HF fournis.",
    lignes: [
      { designation: "Système de sonorisation 4000W avec micros HF", quantite: 1, prixUnitaire: 65000, totalLigne: 65000 },
      { designation: "Éclairage lyres LED et régie lumière", quantite: 1, prixUnitaire: 30000, totalLigne: 30000 },
    ],
  },
  "DEV-2603-187": {
    reference: "DEV-2603-187",
    prestataire: "Traoré Moussa",
    date: "2026-04-22",
    montant: 72000,
    statut: "Commissionné",
    typeeventement: "Anniversaire",
    lieu: "Plateau, Abidjan",
    nbInvites: "50",
    message: "Buffet traiteur chaud/froid pour 50 convives.",
    reponsePresta: "Prestation commissionnée. Menu prestige validé, service et vaisselle inclus.",
    lignes: [
      { designation: "Menu Prestige (entrées, plats, desserts)", quantite: 50, prixUnitaire: 1200, totalLigne: 60000 },
      { designation: "Service et vaisselle complète", quantite: 1, prixUnitaire: 12000, totalLigne: 12000 },
    ],
  },
  "DEV-2603-152": {
    reference: "DEV-2603-152",
    prestataire: "Diallo Mamadou",
    date: "2026-04-15",
    montant: 145000,
    statut: "Commissionné",
    typeeventement: "Séminaire",
    lieu: "Marcory, Abidjan",
    nbInvites: "80",
    message: "Vidéoprojecteur HD et sonorisation de conférence.",
    reponsePresta: "Matériel installé et testé. Technicien présent toute la journée.",
    lignes: [
      { designation: "Vidéoprojecteur Laser 5000 lumens avec écran", quantite: 1, prixUnitaire: 85000, totalLigne: 85000 },
      { designation: "Sonorisation conférence + micros col de cygne", quantite: 1, prixUnitaire: 60000, totalLigne: 60000 },
    ],
  },
  "DEV-2603-098": {
    reference: "DEV-2603-098",
    prestataire: "Koffi Akissi",
    date: "2026-04-08",
    montant: 28000,
    statut: "Commissionné",
    typeeventement: "Anniversaire",
    lieu: "Adjamé, Abidjan",
    nbInvites: "20",
    message: "Gâteau d'anniversaire personnalisé pour 20 personnes.",
    reponsePresta: "Gâteau livré et monté sur place. Décoration personnalisée incluse.",
    lignes: [
      { designation: "Gâteau d'anniversaire personnalisé 3 étages", quantite: 1, prixUnitaire: 22000, totalLigne: 22000 },
      { designation: "Décoration florale de table anniversaire", quantite: 1, prixUnitaire: 6000, totalLigne: 6000 },
    ],
  },
  "DEV-2603-042": {
    reference: "DEV-2603-042",
    prestataire: "Coulibaly Seydou",
    date: "2026-04-02",
    montant: 185000,
    statut: "Commissionné",
    typeeventement: "Concert",
    lieu: "Yopougon, Abidjan",
    nbInvites: "300",
    message: "Scène et structure alu pour un concert de 300 personnes.",
    reponsePresta: "Montage de scène effectué. Structure alu 6x8m avec couverture. Démontage inclus.",
    lignes: [
      { designation: "Scène modulaire 6x8m avec couverture alu", quantite: 1, prixUnitaire: 130000, totalLigne: 130000 },
      { designation: "Montage, démontage et transport", quantite: 1, prixUnitaire: 55000, totalLigne: 55000 },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const statutStyles: Record<string, string> = {
  "Annulé": "bg-rose-600/10 text-rose-600 border-none",
  "Négociation": "bg-indigo-600/10 text-indigo-600 border-none",
  "Commissionné": "bg-green-600/10 text-green-600 border-none",
  "Accepté": "bg-emerald-600/10 text-emerald-600 border-none",
  "Nouveau": "bg-amber-600/10 text-amber-600 border-none",
  "Refusé": "bg-red-600/10 text-red-600 border-none",
  "Expiré": "bg-slate-600/10 text-slate-600 border-none",
}

function getStatutStyle(statut: string) {
  return statutStyles[statut] ?? "bg-slate-100 text-slate-600 border-none"
}

interface DevisTrackingViewProps {
  organisateurId: string
  devisId: string
}

export default function DevisTrackingView({ organisateurId, devisId }: DevisTrackingViewProps) {
  const router = useRouter()
  const devis = MOCK_DEVIS_DB[devisId]

  // ─── Devis introuvable ───────────────────────────────────────────────────
  if (!devis) {
    return (
      <div className="px-4 mt-4 lg:px-6 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/organisateurs/${organisateurId}`)}
          className="h-8 gap-1 pl-1 text-muted-foreground font-semibold cursor-pointer hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;organisateur
        </Button>
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <FileText className="size-12 text-muted-foreground/30" />
          <h2 className="text-lg font-semibold">Devis introuvable</h2>
          <p className="text-sm text-muted-foreground">La référence <span className="font-mono font-bold">{devisId}</span> n&apos;existe pas dans la base de données.</p>
        </div>
      </div>
    )
  }

  // Toujours construire un tableau de versions :
  // - si le devis a déjà des versions → on les utilise
  // - sinon → on wrappe le devis lui-même comme version unique "V1"
  const versions = devis.versions && devis.versions.length > 0
    ? devis.versions
    : [{
        versionLabel: "V1",
        name: "Version Initiale",
        reference: devis.reference,
        date: devis.date,
        montant: devis.montant,
        statut: devis.statut,
        message: devis.message,
        reponsePresta: devis.reponsePresta ?? "",
        lignes: devis.lignes ?? [],
        notesChangements: "Devis unique — pas de négociation.",
      }]

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/organisateurs/${organisateurId}`)}
          className="h-8 gap-1 pl-1 text-muted-foreground mb-1 font-semibold cursor-pointer hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;organisateur
        </Button>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {versions.length > 1 ? "Suivi & Négociation de Devis" : "Détail du Devis"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Devis <span className="font-mono font-semibold text-foreground">{devis.reference}</span> — {devis.prestataire}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-none rounded-sm bg-primary/10 text-primary">
              {devis.prestataire}
            </Badge>
            <Badge variant="outline" className={`rounded-sm font-semibold ${getStatutStyle(devis.statut)}`}>
              {devis.statut}
            </Badge>
          </div>
        </div>
      </div>

      {/* Toujours la vue versions */}
      <NegociationView devis={devis} versions={versions} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Vue négociation (plusieurs versions)
// ─────────────────────────────────────────────────────────────────────────────
type VersionItem = {
  versionLabel: string
  name: string
  reference: string
  date: string
  montant: number
  statut: string
  message: string
  reponsePresta: string
  lignes: { designation: string; quantite: number; prixUnitaire: number; totalLigne: number }[]
  notesChangements: string
}

function NegociationView({ devis, versions }: { devis: typeof MOCK_DEVIS_DB[string]; versions: VersionItem[] }) {
  const [activeTab, setActiveTab] = React.useState(versions[versions.length - 1].versionLabel)

  const isNegociation = versions.length > 1
  const totalV1 = versions[0].montant
  const totalFinal = versions[versions.length - 1].montant
  const ecoTotale = totalV1 - totalFinal
  const ecoPourcentage = Math.round((ecoTotale / totalV1) * 100)

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isNegociation ? (
          <>
            <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
              <CardHeader>
                <CardDescription className="text-primary-foreground/70">Devis Initial (V1)</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums text-primary-foreground">
                  {totalV1.toLocaleString("fr-FR")} F
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
              <CardHeader>
                <CardDescription className="text-primary-foreground/70">Devis Final (V{versions.length})</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums text-primary-foreground">
                  {totalFinal.toLocaleString("fr-FR")} F
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardDescription className="text-primary-foreground/70">Économie Négociée</CardDescription>
                  <Badge className="bg-white/20 text-white border-none hover:bg-white/20">
                    <TrendingDown className="size-3 mr-1" /> {ecoPourcentage}%
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-semibold tabular-nums text-green-300">
                  -{ecoTotale.toLocaleString("fr-FR")} F
                </CardTitle>
              </CardHeader>
            </Card>
          </>
        ) : (
          <>
            <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
              <CardHeader>
                <CardDescription className="text-primary-foreground/70">Montant du Devis</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums text-primary-foreground">
                  {totalV1.toLocaleString("fr-FR")} F
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
              <CardHeader>
                <CardDescription className="text-primary-foreground/70">Statut</CardDescription>
                <CardTitle className="text-xl font-semibold text-primary-foreground">
                  {devis.statut}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
              <CardHeader>
                <CardDescription className="text-primary-foreground/70">Date du devis</CardDescription>
                <CardTitle className="text-xl font-semibold text-primary-foreground">
                  {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(devis.date))}
                </CardTitle>
              </CardHeader>
            </Card>
          </>
        )}
      </div>

      {/* Timeline + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Versions list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold">Versions du Devis</CardTitle>
              <CardDescription className="text-[11px]">Historique de négociation</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="relative border-l border-border pl-4 ml-2.5 space-y-3 py-1">
                {versions.map((v) => {
                  const isActive = activeTab === v.versionLabel
                  return (
                    <div
                      key={v.versionLabel}
                      onClick={() => setActiveTab(v.versionLabel)}
                      className={`relative cursor-pointer group p-3 border transition-all rounded-lg select-none ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border hover:bg-accent/40 bg-card"
                      }`}
                    >
                      <div className={`absolute -left-[23.5px] top-1/2 -translate-y-1/2 size-3 rounded-full border-2 bg-card flex items-center justify-center z-10 ${
                        isActive ? "border-primary" : "border-muted-foreground/30"
                      }`}>
                        <div className={`size-1 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                            Version {v.versionLabel}
                          </span>
                          <Badge variant="outline" className={`text-[9px] rounded-sm font-semibold border-none ${getStatutStyle(v.statut)}`}>
                            {v.statut}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-xs leading-snug">{v.name}</h4>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 font-mono">
                          <span>{v.date}</span>
                          <span className={`font-semibold ${isActive ? "text-primary" : ""}`}>
                            {v.montant.toLocaleString("fr-FR")} F
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version detail */}
        <div className="lg:col-span-2">
          {(() => {
            const activeDevis = versions.find((v) => v.versionLabel === activeTab)!
            return (
              <Card>
                <CardHeader className="border-b pb-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground border-none font-bold text-[10px] px-2 py-0.5 rounded-sm">
                          {activeTab}
                        </Badge>
                        <CardTitle className="text-base font-bold">{activeDevis.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs mt-0.5">
                        Réf : <span className="font-mono font-bold text-foreground">{activeDevis.reference}</span> — Émis le {activeDevis.date}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={`font-semibold text-xs px-2 rounded-sm border-none ${getStatutStyle(activeDevis.statut)}`}>
                      {activeDevis.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-xs">
                  <DevisBody devis={{ ...devis, ...activeDevis }} lignes={activeDevis.lignes} showVsV1={activeDevis.versionLabel !== "V1" ? totalV1 : undefined} />
                </CardContent>
              </Card>
            )
          })()}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Vue simple (1 seul devis, pas de négociation)
// ─────────────────────────────────────────────────────────────────────────────
function SimpleDevisView({ devis, lignes }: { devis: typeof MOCK_DEVIS_DB[string]; lignes: NonNullable<typeof devis.lignes> }) {
  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
          <CardHeader>
            <CardDescription className="text-primary-foreground/70">Montant du Devis</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-primary-foreground">
              {devis.montant.toLocaleString("fr-FR")} F
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
          <CardHeader>
            <CardDescription className="text-primary-foreground/70">Nombre d&apos;invités</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-primary-foreground">
              {devis.nbInvites} <span className="text-base font-normal text-primary-foreground/70">convives</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card bg-primary text-primary-foreground border-none shadow-xs">
          <CardHeader>
            <CardDescription className="text-primary-foreground/70">Type d&apos;événement</CardDescription>
            <CardTitle className="text-xl font-semibold text-primary-foreground">
              {devis.typeeventement}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Detail Card */}
      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <CardTitle className="text-base font-bold">{devis.prestataire}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Réf : <span className="font-mono font-bold text-foreground">{devis.reference}</span> — Émis le {devis.date}
              </CardDescription>
            </div>
            <Badge variant="outline" className={`font-semibold text-xs px-2 rounded-sm border-none ${getStatutStyle(devis.statut)}`}>
              {devis.statut}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4 text-xs">
          <DevisBody devis={devis} lignes={lignes} />
        </CardContent>
      </Card>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Composant partagé : corps du devis (infos event, messages, lignes, total)
// ─────────────────────────────────────────────────────────────────────────────
function DevisBody({
  devis,
  lignes,
  showVsV1,
}: {
  devis: { typeeventement: string; nbInvites: string; lieu: string; date: string; message: string; reponsePresta?: string; montant: number; statut: string }
  lignes: { designation: string; quantite: number; prixUnitaire: number; totalLigne: number }[]
  showVsV1?: number
}) {
  return (
    <>
      {/* Event context */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border bg-accent/30">
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><CalendarDays className="size-3" /> Événement</p>
          <p className="font-semibold mt-0.5">{devis.typeeventement}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Users className="size-3" /> Invités</p>
          <p className="font-semibold mt-0.5">{devis.nbInvites} convives</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><MapPin className="size-3" /> Lieu</p>
          <p className="font-semibold mt-0.5 truncate">{devis.lieu}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3.5">
        <div className="space-y-1">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Info className="size-3" /> Description du projet (Organisateur)
          </h4>
          <div className="rounded-xl border p-3.5 bg-accent/30 text-xs italic text-foreground leading-relaxed">
            &ldquo;{devis.message}&rdquo;
          </div>
        </div>

        {devis.reponsePresta && (
          <div className="space-y-1">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-primary flex items-center gap-1">
              <Info className="size-3" /> Réponse du prestataire
            </h4>
            <div className="rounded-xl border border-primary/10 p-3.5 bg-primary/5 text-xs text-foreground leading-relaxed">
              {devis.reponsePresta}
            </div>
          </div>
        )}
      </div>

      {/* Prestations table */}
      {lignes.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
            Prestations détaillées
          </h4>
          <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
            {lignes.map((line, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center p-3 text-xs ${
                  idx < lignes.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="max-w-[70%]">
                  <p className="font-bold leading-tight">{line.designation}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {line.quantite} x {line.prixUnitaire.toLocaleString("fr-FR")} F
                  </p>
                </div>
                <span className="font-bold font-mono shrink-0">
                  {line.totalLigne.toLocaleString("fr-FR")} F
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-center pt-1 flex-wrap gap-4">
        <div className="space-y-0.5">
          <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">
            Montant Total
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-primary text-xl font-mono leading-none">
              {devis.montant.toLocaleString("fr-FR")} F
            </span>
            {showVsV1 !== undefined && showVsV1 > devis.montant && (
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                -{(showVsV1 - devis.montant).toLocaleString("fr-FR")} F vs V1
              </span>
            )}
          </div>
        </div>
        <div>
          {devis.statut === "Commissionné" ? (
            <Badge className="bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg border-none flex items-center gap-1.5 select-none shadow-xs text-[10px] cursor-default">
              <CheckCircle2 className="size-3.5" /> Devis Validé &amp; Payé
            </Badge>
          ) : devis.statut === "Négociation" ? (
            <Badge className="bg-amber-500 text-white font-bold py-1.5 px-3 rounded-lg border-none flex items-center gap-1.5 select-none shadow-xs text-[10px] cursor-default">
              <Clock className="size-3.5 animate-spin [animation-duration:4s]" /> Négociation active
            </Badge>
          ) : devis.statut === "Accepté" ? (
            <Badge className="bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg border-none flex items-center gap-1.5 select-none shadow-xs text-[10px] cursor-default">
              <CheckCircle2 className="size-3.5" /> Devis Accepté
            </Badge>
          ) : (
            <Badge className="bg-destructive text-destructive-foreground font-bold py-1.5 px-3 rounded-lg border-none flex items-center gap-1.5 select-none shadow-xs text-[10px] cursor-default">
              <XCircle className="size-3.5" /> {devis.statut}
            </Badge>
          )}
        </div>
      </div>
    </>
  )
}
