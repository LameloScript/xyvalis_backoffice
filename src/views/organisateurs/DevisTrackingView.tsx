"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  TrendingDown,
  Info,
  DollarSign,
  User,
  MapPin,
  Users,
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

// Mock version data matching OrganisateurDetailView
const MC_DECO_VERSIONS = [
  { 
    versionLabel: "V1",
    name: "Version Initiale",
    reference: "DEV-2605-001", 
    date: "2026-05-10", 
    montant: 600000, 
    statut: "Annulé",
    typeeventement: "Mariage",
    lieu: "Sofitel Abidjan, Cocody",
    nbInvites: "350",
    message: "Bonjour, je recherche une prestation de décoration florale et d'installation de scène haut de gamme pour mon mariage au Sofitel, tons pastel uniquement.",
    reponsePresta: "Proposition initiale complète avec arche florale d'extérieur prestige, décoration de table haute couture et bouquet de mariée premium.",
    lignes: [
      { designation: "Décoration florale de table haute couture (Centre de table XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
      { designation: "Arche florale d'extérieur prestige", quantite: 1, prixUnitaire: 170000, totalLigne: 170000 },
      { designation: "Bouquet de mariée premium tons pastel", quantite: 1, prixUnitaire: 80000, totalLigne: 80000 }
    ],
    notesChangements: "Devis initial complet."
  },
  { 
    versionLabel: "V2",
    name: "Version Négociée (V2)",
    reference: "DEV-2605-002", 
    date: "2026-05-15", 
    montant: 520000, 
    statut: "Négociation",
    typeeventement: "Mariage",
    lieu: "Sofitel Abidjan, Cocody",
    nbInvites: "350",
    message: "Nous souhaiterions baisser le prix de l'arche florale ou trouver une alternative moins onéreuse, notre budget max pour l'arche est de 120 000 F au lieu de 170 000 F. Nous avons également retiré l'option du bouquet de mariée premium.",
    reponsePresta: "Proposition intermédiaire révisée : nous avons retiré le bouquet de mariée premium. L'arche florale reste en version prestige à 170 000 F. Nous attendons votre retour pour la simplifier si nécessaire.",
    lignes: [
      { designation: "Décoration florale de table haute couture (Centre de table XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
      { designation: "Arche florale prestige d'extérieur (En attente de simplification)", quantite: 1, prixUnitaire: 170000, totalLigne: 170000 }
    ],
    notesChangements: "Retrait du bouquet de mariée (-80 000 F). Arche florale conservée à 170 000 F."
  },
  { 
    versionLabel: "V3",
    name: "Version Finale (V3)",
    reference: "DEV-2605-003", 
    date: "2026-05-20", 
    montant: 470000, 
    statut: "Commissionné",
    typeeventement: "Mariage",
    lieu: "Sofitel Abidjan, Cocody",
    nbInvites: "350",
    message: "Bonjour, je valide cette version finale (V3) suite à nos échanges sur la réduction de l'arche florale (version simplifiée). Merci de lancer la facturation.",
    reponsePresta: "Proposition finale acceptée après négociation. L'arche florale a été redimensionnée pour respecter votre budget de 120 000 F. Acompte de 50% reçu, prestation commissionnée.",
    lignes: [
      { designation: "Décoration florale de table haute couture (Centre de table XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
      { designation: "Arche florale géante simplifiée (Version Négociée)", quantite: 1, prixUnitaire: 120000, totalLigne: 120000 }
    ],
    notesChangements: "Simplification de l'arche florale (-50 000 F). Devis final validé."
  }
]

const statutStyles: Record<string, string> = {
  "Annulé": "bg-red-50 text-red-700 border-red-200",
  "Négociation": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Commissionné": "bg-emerald-50 text-emerald-700 border-emerald-250",
}

interface DevisTrackingViewProps {
  organisateurId: string
  devisId: string
}

export default function DevisTrackingView({ organisateurId, devisId }: DevisTrackingViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<"V1" | "V2" | "V3">("V3")

  // Calculation of saving stats
  const totalV1 = MC_DECO_VERSIONS[0].montant
  const totalV3 = MC_DECO_VERSIONS[2].montant
  const ecoTotale = totalV1 - totalV3
  const ecoPourcentage = Math.round((ecoTotale / totalV1) * 100)

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push(`/organisateurs/${organisateurId}`)}
          className="h-8 gap-1.5 pl-1.5 text-muted-foreground w-fit font-semibold cursor-pointer hover:bg-slate-100"
        >
          <ArrowLeft className="size-4" />
          Retour à l'organisateur
        </Button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2.5">
              <FileText className="size-6 text-[#023B8A]" />
              Suivi des versions & Négociation de Devis
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Audit de la négociation entre l'organisateur et le prestataire <span className="font-semibold text-slate-700">Marie-Claire Déco</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-[#023B8A]/10 text-[#023B8A] border-none text-xs rounded-md">
              Prestataire : Marie-Claire Déco
            </Badge>
            <Badge className="bg-emerald-600/10 text-emerald-600 border-none text-xs rounded-md">
              Statut Actuel : Commissionné
            </Badge>
          </div>
        </div>
      </div>

      {/* KPI Section - Negotiation stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-100 bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Devis Initial (V1)</CardDescription>
            <CardTitle className="text-xl font-bold text-slate-700 font-mono mt-0.5">
              {totalV1.toLocaleString("fr-FR")} F
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-xs border-slate-100 bg-white">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Devis Final (V3)</CardDescription>
            <CardTitle className="text-xl font-bold text-[#023B8A] font-mono mt-0.5">
              {totalV3.toLocaleString("fr-FR")} F
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-xs border-emerald-100 bg-emerald-50/20 col-span-2">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs text-emerald-700 font-semibold">Économie Négociée</CardDescription>
              <TrendingDown className="size-4 text-emerald-600 animate-bounce" />
            </div>
            <CardTitle className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5 flex items-baseline gap-2">
              -{ecoTotale.toLocaleString("fr-FR")} F
              <span className="text-xs font-semibold bg-emerald-600/10 px-1.5 py-0.5 rounded-full">
                {ecoPourcentage}% de réduction
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Comparative Timeline grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Quick Versions Overview side-by-side */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-sm border-slate-100 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800">Milestones & Versions</CardTitle>
              <CardDescription className="text-[11px]">Chronologie de la négociation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-4">
                {MC_DECO_VERSIONS.map((v) => {
                  const isActive = activeTab === v.versionLabel
                  return (
                    <div 
                      key={v.versionLabel}
                      onClick={() => setActiveTab(v.versionLabel as any)}
                      className={`relative cursor-pointer group p-3 border rounded-xl transition-all ${
                        isActive 
                          ? "border-[#023B8A] bg-blue-50/30 ring-2 ring-blue-50" 
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      {/* Timeline Bullet */}
                      <div className={`absolute -left-[22.5px] top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 bg-white flex items-center justify-center shrink-0 z-10 ${
                        isActive ? "border-[#023B8A]" : "border-slate-300 group-hover:border-slate-400"
                      }`}>
                        <div className={`size-1.5 rounded-full ${isActive ? "bg-[#023B8A]" : "bg-slate-300 group-hover:bg-slate-400"}`} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Version {v.versionLabel}</span>
                          <Badge variant="outline" className={`text-[9px] rounded-sm border-none uppercase ${statutStyles[v.statut]}`}>
                            {v.statut}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800">{v.name}</h4>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1.5 font-mono">
                          <span>{v.date}</span>
                          <span className="font-bold text-[#023B8A]">{v.montant.toLocaleString("fr-FR")} F</span>
                        </div>
                        <div className="text-[10px] bg-slate-50 p-1.5 rounded-md mt-2 text-slate-500 italic border border-slate-100/50">
                          {v.notesChangements}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Comparative details of selected version */}
        <div className="lg:col-span-2 space-y-6">
          {(() => {
            const activeDevis = MC_DECO_VERSIONS.find(v => v.versionLabel === activeTab)!
            return (
              <Card className="shadow-md border border-slate-100 bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#023B8A] text-white border-none font-bold text-[10px] px-2 py-0.5 rounded-md">
                          {activeDevis.versionLabel}
                        </Badge>
                        <CardTitle className="text-base font-bold text-slate-800">{activeDevis.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs mt-1">
                        Réf : <span className="font-mono font-bold text-slate-700">{activeDevis.reference}</span> — Émis le {activeDevis.date}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={`font-bold text-xs px-2.5 py-0.5 rounded-sm uppercase ${statutStyles[activeDevis.statut]}`}>
                      {activeDevis.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-sm">
                  {/* Event & Invites details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/20">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <User className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Événement</p>
                        <p className="text-xs font-bold text-slate-700">{activeDevis.typeeventement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Users className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Nombre d'invités</p>
                        <p className="text-xs font-bold text-slate-700">{activeDevis.nbInvites} convives</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <MapPin className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Lieu</p>
                        <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{activeDevis.lieu}</p>
                      </div>
                    </div>
                  </div>

                  {/* Conversation thread details */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Info className="size-3.5" /> Message de l'organisateur ({activeDevis.versionLabel})
                      </h4>
                      <div className="rounded-xl border border-slate-100 p-3.5 bg-slate-50/50 text-xs italic text-slate-700 leading-relaxed border-l-3 border-l-slate-300">
                        &ldquo;{activeDevis.message}&rdquo;
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#023B8A] flex items-center gap-1.5">
                        <Info className="size-3.5" /> Proposition du prestataire ({activeDevis.versionLabel})
                      </h4>
                      <div className="rounded-xl border border-[#023B8A]/10 p-3.5 bg-blue-50/10 text-xs text-slate-700 leading-relaxed border-l-3 border-l-[#023B8A]">
                        {activeDevis.reponsePresta}
                      </div>
                    </div>
                  </div>

                  {/* Prestations Table */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Prestations détaillées de la version</h4>
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
                      {activeDevis.lignes.map((line, idx) => (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center p-3 text-xs ${
                            idx < activeDevis.lignes.length - 1 ? 'border-b border-slate-50' : ''
                          }`}
                        >
                          <div className="max-w-[70%]">
                            <p className="font-bold text-slate-800">{line.designation}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {line.quantite} x {line.prixUnitaire.toLocaleString("fr-FR")} F
                            </p>
                          </div>
                          <span className="font-bold text-slate-700 font-mono shrink-0">
                            {line.totalLigne.toLocaleString("fr-FR")} F
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Total and actions */}
                  <div className="flex justify-between items-center pt-2 flex-wrap gap-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Montant Total Devis {activeDevis.versionLabel}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-[#023B8A] text-2xl font-mono">
                          {activeDevis.montant.toLocaleString("fr-FR")} FCFA
                        </span>
                        {activeDevis.versionLabel !== "V1" && (
                          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                            -{((MC_DECO_VERSIONS[0].montant - activeDevis.montant)).toLocaleString("fr-FR")} F vs V1
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {activeDevis.statut === "Commissionné" ? (
                        <Badge className="bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg border-none flex items-center gap-1.5 select-none shadow-xs text-xs">
                          <CheckCircle2 className="size-4" /> Devis Validé & Payé
                        </Badge>
                      ) : activeDevis.statut === "Négociation" ? (
                        <Badge className="bg-amber-500 text-white font-bold py-1.5 px-3 rounded-lg border-none flex items-center gap-1.5 select-none shadow-xs text-xs">
                          <Clock className="size-4 animate-spin [animation-duration:4s]" /> Négociation active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white font-bold py-1.5 px-3 rounded-lg border-none flex items-center gap-1.5 select-none shadow-xs text-xs">
                          <XCircle className="size-4" /> Devis Remplacé / Annulé
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
