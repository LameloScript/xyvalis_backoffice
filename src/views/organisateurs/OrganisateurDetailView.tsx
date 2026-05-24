"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { useBreadcrumb } from "@/contexts/breadcrumb-context"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Wallet,
  ShoppingCart,
  MessageSquare,
  StickyNote,
  Plus,
  Edit,
  Key,
  Loader2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingUp } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MC_DECO_VERSIONS = [
  { 
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
      { id: "v1-1", designation: "Décoration florale de table haute couture (Centre de table XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
      { id: "v1-2", designation: "Arche florale d'extérieur prestige", quantite: 1, prixUnitaire: 170000, totalLigne: 170000 },
      { id: "v1-3", designation: "Bouquet de mariée premium tons pastel", quantite: 1, prixUnitaire: 80000, totalLigne: 80000 }
    ]
  },
  { 
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
      { id: "v2-1", designation: "Décoration florale de table haute couture (Centre de table XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
      { id: "v2-2", designation: "Arche florale prestige d'extérieur (En attente de simplification)", quantite: 1, prixUnitaire: 170000, totalLigne: 170000 }
    ]
  },
  { 
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
      { id: "v3-1", designation: "Décoration florale de table haute couture (Centre de table XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
      { id: "v3-2", designation: "Arche florale géante simplifiée (Version Négociée)", quantite: 1, prixUnitaire: 120000, totalLigne: 120000 }
    ]
  }
]

const fallbackClient = {
  id: "ORG-001",
  nom: "Konan Yao Stéphane",
  email: "konan.yao@gmail.com",
  telephone: "+225 07 01 23 45",
  commune: "Cocody",
  adresse: "Rue des Jardins, Angré 8ème Tranche",
  statut: "actif" as const,
  note: 4.6,
  soldeWallet: 3200,
  totalCommandes: 47,
  totalDepense: 1240000,
  dateInscription: "2025-08-22",
  derniereConnexion: "2026-04-26T08:32:00",
  notesInternes: [
    {
      id: 1,
      auteur: "Aminata Koné",
      date: "2026-03-15T11:32:00",
      contenu: "Client VIP — toujours noté 5 étoiles aux prestataires. Privilégier en cas de promo.",
    },
    {
      id: 2,
      auteur: "Diallo Fatoumata",
      date: "2026-02-08T14:18:00",
      contenu: "A appelé pour signaler un retard. Très compréhensif. Geste commercial : 1 prestation offerte.",
    },
  ],
  commandes: [
    { 
      id: "CMD-2605-003", 
      reference: "DEV-2605-003", 
      date: "2026-05-20", 
      prestataire: "Marie-Claire Déco", 
      montant: 470000, 
      statut: "Commissionné",
      typeeventement: "Mariage",
      lieu: "Sofitel Abidjan, Cocody",
      nbInvites: "350",
      message: "Bonjour, je valide cette version finale (V3) suite à nos échanges sur la réduction de l'arche florale (version simplifiée). Merci de lancer la facturation.",
      reponsePresta: "Proposition finale acceptée après négociation. L'arche florale a été redimensionnée pour respecter votre budget de 120 000 F. Acompte de 50% reçu, prestation commissionnée.",
      lignes: [
        { id: "l003-1", designation: "Décoration florale de table haute couture (Centre de table XXL)", quantite: 10, prixUnitaire: 35000, totalLigne: 350000 },
        { id: "l003-2", designation: "Arche florale géante simplifiée (Version Négociée)", quantite: 1, prixUnitaire: 120000, totalLigne: 120000 }
      ],
      historique: [
        { date: "2026-05-10T10:00:00", action: "Demande de Devis", description: "Demande initiale créée par l'organisateur." },
        { date: "2026-05-12T14:30:00", action: "Proposition Envoyée", description: "Devis V1 proposé par Marie-Claire Déco à 600 000 F (Réf. DEV-2605-001)." },
        { date: "2026-05-14T11:15:00", action: "Demande de Négociation", description: "L'organisateur demande une réduction sur l'arche et retire le bouquet de mariée." },
        { date: "2026-05-15T16:00:00", action: "Devis Renvoyé (V2)", description: "Nouveau devis V2 proposé à 520 000 F (Réf. DEV-2605-002)." },
        { date: "2026-05-18T09:45:00", action: "Négociation Finale", description: "L'organisateur demande une arche florale simplifiée à 120 000 F." },
        { date: "2026-05-20T15:20:00", action: "Devis Accepté & Commissionné", description: "Version finale V3 acceptée et commissionnée (Réf. DEV-2605-003)." }
      ],
      versions: MC_DECO_VERSIONS
    },
    { 
      id: "CMD-2604-002", 
      reference: "DEV-2604-002", 
      date: "2026-04-25", 
      prestataire: "Alpha Sound Production", 
      montant: 95000, 
      statut: "Accepté",
      typeeventement: "Mariage",
      lieu: "Cocody, Abidjan",
      nbInvites: "150",
      message: "Recherche sonorisation de pointe pour un mariage de 150 personnes.",
      lignes: [
        { id: "l1", designation: "Système de sonorisation 4000W avec micros HF", quantite: 1, prixUnitaire: 65000, totalLigne: 65000 },
        { id: "l2", designation: "Éclairage lyres LED et régie lumière", quantite: 1, prixUnitaire: 30000, totalLigne: 30000 }
      ]
    },
    { 
      id: "CMD-2603-187", 
      reference: "DEV-2603-187", 
      date: "2026-04-22", 
      prestataire: "Traoré Moussa", 
      montant: 72000, 
      statut: "Commissionné",
      typeeventement: "Anniversaire",
      lieu: "Plateau, Abidjan",
      nbInvites: "50",
      message: "Buffet traiteur chaud/froid pour 50 convives.",
      lignes: [
        { id: "l3", designation: "Menu Prestige (entrées, plats, desserts)", quantite: 50, prixUnitaire: 1200, totalLigne: 60000 },
        { id: "l4", designation: "Service et vaisselle complète", quantite: 1, prixUnitaire: 12000, totalLigne: 12000 }
      ]
    },
    { 
      id: "CMD-2603-152", 
      reference: "DEV-2603-152", 
      date: "2026-04-15", 
      prestataire: "Diallo Mamadou", 
      montant: 145000, 
      statut: "Commissionné",
      typeeventement: "Séminaire",
      lieu: "Marcory, Abidjan",
      nbInvites: "80",
      message: "Vidéoprojecteur HD et sonorisation de conférence.",
      lignes: [
        { id: "l5", designation: "Vidéoprojecteur Laser 5000 lumens avec écran", quantite: 1, prixUnitaire: 85000, totalLigne: 85000 },
        { id: "l6", designation: "Système de sonorisation de conférence + micros col de cygne", quantite: 1, prixUnitaire: 60000, totalLigne: 60000 }
      ]
    },
    { id: "CMD-2603-098", reference: "DEV-2603-098", date: "2026-04-08", prestataire: "Koffi Akissi", montant: 28000, statut: "Commissionné", typeeventement: "Anniversaire", lieu: "Adjamé, Abidjan", nbInvites: "20", message: "Gâteau d'anniversaire personnalisé." },
    { id: "CMD-2603-042", reference: "DEV-2603-042", date: "2026-04-02", prestataire: "Coulibaly Seydou", montant: 185000, statut: "Commissionné", typeeventement: "Concert", lieu: "Yopougon, Abidjan", nbInvites: "300", message: "Scène et structure alu." },
  ],
}

const statutCommandeConfig: Record<string, string> = {
  "Nouveau": "bg-amber-50 text-amber-700 border-amber-200",
  "Répondu": "bg-blue-50 text-blue-700 border-blue-200",
  "Négociation": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Accepté": "bg-emerald-50 text-emerald-700 border-emerald-250",
  "Refusé": "bg-rose-50 text-rose-700 border-rose-250",
  "Expiré": "bg-slate-50 text-slate-700 border-slate-200",
  "Annulé": "bg-red-50 text-red-700 border-red-200",
  "Exécuté": "bg-green-50 text-green-700 border-green-200",
  "Confirmé": "bg-emerald-50 text-emerald-750 border-emerald-200",
  "En litige": "bg-red-50 text-red-800 border-red-300 font-bold",
  "Commissionné": "bg-emerald-50 text-emerald-800 border-emerald-300",
  
  // Rétrocompatibilité
  "En cours": "bg-blue-50 text-blue-600 border-blue-200",
  "Livrée": "bg-green-50 text-green-600 border-green-250",
  "Annulée": "bg-red-50 text-red-600 border-red-200",
}

const getStepState = (currentStatus: string, stepIndex: number) => {
  const statusLower = currentStatus.toLowerCase()
  
  if (statusLower === "annulé" || statusLower === "annulée" || statusLower === "refusé") {
    if (stepIndex === 1) return "completed"
    if (stepIndex === 2) return "completed"
    if (stepIndex === 3) return "failed"
    return "disabled"
  }
  
  if (statusLower === "nouveau") {
    if (stepIndex === 1) return "active"
    return "disabled"
  }
  
  if (statusLower === "répondu" || statusLower === "négociation") {
    if (stepIndex < 2) return "completed"
    if (stepIndex === 2) return "active"
    return "disabled"
  }
  
  if (statusLower === "accepté" || statusLower === "confirmé" || statusLower === "livrée" || statusLower === "en cours") {
    if (stepIndex < 3) return "completed"
    if (stepIndex === 3) return "active"
    return "disabled"
  }
  
  if (statusLower === "exécuté" || statusLower === "commissionné") {
    return "completed"
  }
  
  return "disabled"
}

interface OrganisateurDetailViewProps {
  id: string
}

export default function OrganisateurDetailView({ id }: OrganisateurDetailViewProps) {
  const router = useRouter()
  const [nouvelleNote, setNouvelleNote] = React.useState("")
  const [statut, setStatut] = React.useState<"actif" | "suspendu">("actif")
  const [org, setOrg] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { setCustomLabel } = useBreadcrumb()

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editNom, setEditNom] = React.useState("")
  const [editEmail, setEditEmail] = React.useState("")
  const [editTelephone, setEditTelephone] = React.useState("")
  const [editCommune, setEditCommune] = React.useState("")
  const [editAdresse, setEditAdresse] = React.useState("")

  // Reset Password State
  const [isResetting, setIsResetting] = React.useState(false)

  // Order Details Modal State
  const [selectedCommande, setSelectedCommande] = React.useState<any>(null)
  const [activeVersionRef, setActiveVersionRef] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (selectedCommande) {
      setActiveVersionRef(selectedCommande.reference)
    } else {
      setActiveVersionRef(null)
    }
  }, [selectedCommande])

  React.useEffect(() => {
    if (org) {
      setEditNom(org.nom)
      setEditEmail(org.email)
      setEditTelephone(org.telephone)
      setEditCommune(org.commune)
      setEditAdresse(org.adresse)
    }
  }, [org])

  const handleSaveProfile = async () => {
    if (!editNom.trim()) {
      toast.error("Le nom ne peut pas être vide.")
      return
    }
    try {
      const res = await apiFetch(`/admin/organisateurs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editNom,
          commune: editCommune,
          ville: editCommune,
        }),
      })
      if (!res.ok) throw new Error("Erreur de mise à jour")
      setOrg((prev: any) => {
        if (!prev) return prev
        return {
          ...prev,
          nom: editNom,
          commune: editCommune,
          adresse: editAdresse,
        }
      })
      setIsEditModalOpen(false)
      toast.success("Profil de l'organisateur mis à jour avec succès !")
    } catch (err) {
      console.warn("API hors-ligne. Mode Démo actif.")
      setOrg((prev: any) => {
        if (!prev) return prev
        return {
          ...prev,
          nom: editNom,
          commune: editCommune,
          adresse: editAdresse,
        }
      })
      setIsEditModalOpen(false)
      toast.success("Profil de l'organisateur mis à jour avec succès (Mode Démo) !")
    }
  }

  const handleToggleStatus = async (newStatut: "actif" | "suspendu") => {
    try {
      const res = await apiFetch(`/admin/organisateurs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isSuspended: newStatut === "suspendu",
        }),
      })
      if (!res.ok) throw new Error("Erreur de changement de statut")
      setStatut(newStatut)
      toast.success(
        newStatut === "suspendu"
          ? "Organisateur suspendu avec succès !"
          : "Organisateur réactivé avec succès !",
      )
    } catch (err) {
      console.warn("API hors-ligne. Mode Démo actif.")
      setStatut(newStatut)
      toast.success(
        newStatut === "suspendu"
          ? "Organisateur suspendu avec succès (Mode Démo) !"
          : "Organisateur réactivé avec succès (Mode Démo) !",
      )
    }
  }

  const handleResetPassword = async () => {
    try {
      setIsResetting(true)
      const res = await apiFetch(`/admin/organisateurs/${id}/reset-password`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Erreur de réinitialisation")
      toast.success(`Un lien de réinitialisation de mot de passe a été envoyé avec succès à ${org.email} !`)
    } catch (err) {
      console.warn("API hors-ligne. Mode Démo actif.")
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success(`Un lien de réinitialisation de mot de passe a été envoyé avec succès à ${org.email} (Mode Démo) !`)
    } finally {
      setIsResetting(false)
    }
  }

  React.useEffect(() => {
    if (org?.nom) {
      setCustomLabel(id, org.nom)
    }
  }, [org?.nom, id, setCustomLabel])

  React.useEffect(() => {
    async function loadDetails() {
      try {
        setIsLoading(true)
        setError(null)
        const res = await apiFetch(`/admin/organisateurs/${id}`)
        if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
        const json = await res.json()
        if (json.success && json.data) {
          const item = json.data
          const member = item.members?.[0]
          const user = member?.user
          const firstName = user?.firstName ?? ""
          const lastName = user?.lastName ?? ""
          const fullName = `${firstName} ${lastName}`.trim() || item.name || "Organisateur sans nom"
          const phone = user?.phone ?? item.telephone ?? member?.phone ?? "Non renseigné"
          
          const rawDevis = Array.isArray(item.devisDemandes) ? item.devisDemandes : []
          const mappedCommandes = rawDevis.map((dev: any) => {
            const statusLabels: Record<string, string> = {
              NEW: "Nouveau",
              REPLIED: "Répondu",
              NEGOTIATING: "Négociation",
              ACCEPTED: "Accepté",
              DECLINED: "Refusé",
              EXPIRED: "Expiré",
              CANCELLED: "Annulé",
              EXECUTED: "Exécuté",
              CONFIRMED: "Confirmé",
              DISPUTED: "En litige",
              COMMISSIONED: "Commissionné"
            }
            const statusLabel = statusLabels[dev.status] ?? dev.status ?? "Nouveau"
            const totalAmount = dev.montantFinal ?? dev.montantPropose ?? dev.budgetEstime ?? 0

            return {
              id: dev.id,
              reference: dev.reference ?? `DEV-${dev.id.slice(0, 8).toUpperCase()}`,
              date: dev.createdAt ? dev.createdAt.split('T')[0] : "2026-01-01",
              prestataire: dev.prestataire?.name ?? "Non assigné",
              montant: totalAmount,
              statut: statusLabel,
              typeeventement: dev.typeeventement ?? dev.eventt?.typeeventement ?? "Non spécifié",
              dateeventement: dev.dateeventement ? dev.dateeventement.split('T')[0] : null,
              lieu: dev.lieu ?? "Non précisé",
              nbInvites: dev.nbInvites ?? "Non renseigné",
              message: dev.message ?? "Aucun message",
              reponsePresta: dev.reponsePresta ?? null,
              lignes: Array.isArray(dev.lignes) ? dev.lignes : [],
              prestations: Array.isArray(dev.prestations) ? dev.prestations : [],
              eventtTitre: dev.eventt?.titre ?? null,
              historique: dev.historique ?? [
                { date: dev.createdAt ? dev.createdAt : "2026-05-10T10:00:00", action: "Demande de Devis", description: "Demande initiale créée par l'organisateur." }
              ]
            }
          })

          const totalSpend = mappedCommandes.reduce((sum: number, c: any) => sum + c.montant, 0)
          
          const mappedOrg = {
            id: item.id,
            nom: item.name || fullName,
            email: user?.email ?? item.email ?? "Non renseigné",
            telephone: phone,
            commune: item.commune ?? user?.commune ?? "Abidjan",
            adresse: item.adresse || user?.adresse || "Abidjan, Côte d'Ivoire",
            statut: item.deletedAt ? "suspendu" : "actif",
            note: item.noteMoyenne ?? 4.8,
            soldeWallet: item.cashbackWallet?.soldeFCFA ?? 0,
            totalCommandes: mappedCommandes.length,
            totalDepense: totalSpend,
            dateInscription: item.createdAt ? item.createdAt.split('T')[0] : "2026-01-01",
            derniereConnexion: user?.lastLoginAt ?? item.updatedAt ?? new Date().toISOString(),
            notesInternes: [
              {
                id: 1,
                auteur: "Système",
                date: item.createdAt || new Date().toISOString(),
                contenu: "Compte créé sur Event Reco Africa. Éligible au programme de cashback 1% sur tous les devis exécutés."
              },
              ...(item.noteAdminInterne ? [{
                id: 2,
                auteur: "Note Admin",
                date: item.updatedAt || new Date().toISOString(),
                contenu: item.noteAdminInterne
              }] : [])
            ],
            commandes: mappedCommandes
          }
          setOrg(mappedOrg)
          setStatut(item.deletedAt ? "suspendu" : "actif")
        } else {
          throw new Error("Format de réponse API invalide")
        }
      } catch (err) {
        console.error("Erreur de chargement de l'organisateur:", err)
        // Fallback démo
        const mockOrg = {
          ...fallbackClient,
          id: id
        }
        setOrg(mockOrg)
        setStatut(mockOrg.statut)
      } finally {
        setIsLoading(false)
      }
    }
    loadDetails()
  }, [id])

  const handleAddNote = async () => {
    if (!nouvelleNote.trim() || !org) return
    const noteText = nouvelleNote.trim()
    try {
      const res = await apiFetch(`/admin/organisateurs/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: noteText,
        }),
      })
      if (!res.ok) throw new Error("Erreur de sauvegarde de la note")
      setOrg((prev: any) => {
        if (!prev) return prev
        const filteredNotes = prev.notesInternes.filter((n: any) => n.auteur !== "Note Admin")
        return {
          ...prev,
          notesInternes: [
            ...filteredNotes,
            {
              id: prev.notesInternes.length + 1,
              auteur: "Note Admin",
              date: new Date().toISOString(),
              contenu: noteText
            }
          ]
        }
      })
      setNouvelleNote("")
      toast.success("Note administrative enregistrée avec succès !")
    } catch (err) {
      console.warn("API hors-ligne. Mode Démo actif.")
      setOrg((prev: any) => {
        if (!prev) return prev
        const filteredNotes = prev.notesInternes.filter((n: any) => n.auteur !== "Note Admin")
        return {
          ...prev,
          notesInternes: [
            ...filteredNotes,
            {
              id: prev.notesInternes.length + 1,
              auteur: "Note Admin",
              date: new Date().toISOString(),
              contenu: noteText
            }
          ]
        }
      })
      setNouvelleNote("")
      toast.success("Note administrative enregistrée avec succès (Mode Démo) !")
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

  if (error && !org) {
    return (
      <div className="px-4 mt-4 lg:px-6 space-y-4 max-w-360 mx-auto pb-12">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/organisateurs")} 
          className="h-8 gap-1.5 pl-1.5 text-muted-foreground hover:bg-slate-100 transition-all font-semibold"
        >
          <ArrowLeft className="size-4" />
          Retour aux organisateurs
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
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/organisateurs")}
            className="h-8 gap-1 pl-1 text-muted-foreground mb-1 font-semibold cursor-pointer hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Organisateurs
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">{org.nom}</h1>
            <Badge
              variant="outline"
              className={`border-none rounded-sm ${
                statut === "actif" ? "bg-green-600/10 text-green-600" : "bg-red-600/10 text-red-600"
              }`}
            >
              {statut === "actif" ? "Actif" : "Suspendu"}
            </Badge>
            <Badge variant="outline" className="border-none rounded-sm bg-blue-600/10 text-blue-600">
              Organisateur
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Inscrit le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit", month: "long", year: "numeric",
            }).format(new Date(org.dateInscription))}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button variant="outline" className="cursor-pointer" onClick={handleResetPassword} disabled={isResetting}>
            {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
            Réinitialiser MDP
          </Button>
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" /> Contacter
          </Button>
          {statut === "actif" ? (
            <Button variant="destructive" onClick={() => handleToggleStatus("suspendu")}>
              Suspendre
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleToggleStatus("actif")}
            >
              Réactiver
            </Button>
          )}
        </div>
      </div>

      {/* KPI */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card mt-4 dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total commandes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {org.totalCommandes}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+5
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              5 nouvelles ce mois <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Depuis l&apos;inscription</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Solde cashback</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {org.soldeWallet.toLocaleString("fr-FR")} F
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-blue-600 text-blue-700">
                Disponible
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Crédit utilisable</div>
            <div className="text-muted-foreground">Bonus cashback 1%</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Note reçue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {org.note} / 5
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+0.2
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              En hausse ce mois <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Basée sur les avis prestataires</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total dépensé</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {org.totalDepense.toLocaleString("fr-FR")} F
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+15%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              Vs. mois dernier <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Cumul total des prestations</div>
          </CardFooter>
        </Card>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Historique commandes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Historique des prestations commandées</h2>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Prestataire</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {org.commandes.map((c: any) => (
                    <TableRow 
                      key={c.id} 
                      className="cursor-pointer hover:bg-slate-50/50 transition-all"
                      onClick={() => router.push(`/organisateurs/${id}/devis/${c.reference}`)}
                    >
                      <TableCell className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                        }).format(new Date(c.date))}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">{c.prestataire}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums font-mono text-xs">
                        {c.montant.toLocaleString("fr-FR")} F
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-none rounded-sm ${statutCommandeConfig[c.statut] || "bg-slate-50 text-slate-600"}`}
                        >
                          {c.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {org.commandes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">
                        Aucune commande passée pour le moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes internes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                Notes internes admin
              </CardTitle>
              <CardDescription>Visibles uniquement par les administrateurs de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {org.notesInternes.map((n: any) => (
                <div key={n.id} className="rounded-md border bg-amber-50/40 border-amber-100 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{n.auteur}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      }).format(new Date(n.date))}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{n.contenu}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Ajouter une note administrative</p>
                <Textarea
                  value={nouvelleNote}
                  onChange={(e) => setNouvelleNote(e.target.value)}
                  placeholder="Saisissez une note interne concernant cet organisateur..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button size="sm" disabled={!nouvelleNote.trim()} onClick={handleAddNote}>
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Enregistrer la note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          {/* Profil */}
          <Card className="shadow-md border border-slate-100/80 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-800">Coordonnées</CardTitle>
                <Badge variant="outline" className="text-[10px] font-bold tracking-wider text-indigo-600 border-indigo-200 bg-indigo-50/30 uppercase">
                  Fiche Profil
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              {/* En-tête profil */}
              <div className="flex items-center gap-3 px-4 py-4 border-b">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shrink-0">
                  {org.nom.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{org.nom}</p>
                  <p className="text-xs text-muted-foreground">Compte Organisateur</p>
                </div>
              </div>

              {/* Lignes d'infos */}
              <div className="divide-y divide-border">
                {/* Email */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">E-mail</p>
                      <p className="text-sm font-medium truncate">{org.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(org.email);
                      toast.success("Adresse e-mail copiée !");
                    }}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>

                {/* Téléphone */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Phone className="size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Téléphone</p>
                    {org.telephone && org.telephone !== "Non renseigné" ? (
                      <p className="text-sm font-medium">{org.telephone}</p>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Non renseigné</span>
                    )}
                  </div>
                </div>

                {/* Localisation */}
                <div className="flex items-start gap-3 px-4 py-3">
                  <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Adresse</p>
                    <p className="text-sm font-medium leading-snug">{org.adresse}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{org.commune}</p>
                  </div>
                </div>

                {/* Dernière activité */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <Calendar className="size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Dernière activité</p>
                    <p className="text-sm font-medium">
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                      }).format(new Date(org.derniereConnexion))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cashback Wallet */}
          {false && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" /> Portefeuille Cashback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Solde cashback cumulé</span>
                  <span className="font-bold text-emerald-600 text-lg tabular-nums font-mono">
                    {org.soldeWallet.toLocaleString("fr-FR")} F
                  </span>
                </div>
                <Separator />
                <Button variant="outline" size="sm" className="w-full font-semibold cursor-pointer">
                  Ajuster le solde
                </Button>
                <Button variant="outline" size="sm" className="w-full font-semibold cursor-pointer">
                  Voir l'historique cashback
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL MODIFICATION PROFIL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Modifier l'organisateur</DialogTitle>
            <DialogDescription>
              Mettez à jour les coordonnées et informations de profil de cet organisateur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <div className="space-y-1">
              <Label htmlFor="nom">Nom de l'organisation / Responsable</Label>
              <Input
                id="nom"
                value={editNom}
                onChange={(e) => setEditNom(e.target.value)}
                placeholder="Ex: Ivoire Event Agency"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Adresse E-mail</Label>
              <Input
                id="email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Ex: agency@eventtreco.africa"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Numéro de Téléphone</Label>
              <Input
                id="phone"
                value={editTelephone}
                onChange={(e) => setEditTelephone(e.target.value)}
                placeholder="Ex: +225 07 08 09 10 11"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="commune">Commune</Label>
                <Input
                  id="commune"
                  value={editCommune}
                  onChange={(e) => setEditCommune(e.target.value)}
                  placeholder="Ex: Cocody"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="adresse">Adresse physique</Label>
                <Input
                  id="adresse"
                  value={editAdresse}
                  onChange={(e) => setEditAdresse(e.target.value)}
                  placeholder="Ex: Rue des Jardins"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveProfile} className="bg-[#023B8A] hover:bg-[#023B8A]/90 text-white font-semibold">
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DÉTAILS D'UNE PRESTATION COMMANDEE / DEVIS */}
      <Dialog open={!!selectedCommande} onOpenChange={(open) => !open && setSelectedCommande(null)}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800 font-bold">
              <ShoppingCart className="size-5 text-[#023B8A]" />
              Fiche Détails du Devis
            </DialogTitle>
            <DialogDescription className="text-xs">
              Récapitulatif complet de la demande et de la proposition de devis
            </DialogDescription>
          </DialogHeader>
          {selectedCommande && (() => {
            const displayedCommande = selectedCommande.versions
              ? selectedCommande.versions.find((v: any) => v.reference === activeVersionRef) || selectedCommande
              : selectedCommande;

            return (
              <div className="space-y-4 py-2 text-sm animate-in fade-in duration-200">
                {/* Version Switcher Pills */}
                {selectedCommande.versions && (
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1 shrink-0">
                      Versions négociées :
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                      {selectedCommande.versions.map((v: any, index: number) => {
                        const isActive = v.reference === activeVersionRef;
                        return (
                          <Button
                            key={v.reference}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveVersionRef(v.reference)}
                            className={`h-7 px-3 text-[10px] font-bold transition-all rounded-lg shrink-0 cursor-pointer ${
                              isActive
                                ? "bg-[#023B8A] text-white border-[#023B8A] hover:bg-[#023B8A]/90 hover:text-white shadow-xs"
                                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                            }`}
                          >
                            V{index + 1} {v.reference === "DEV-2605-001" ? "(Initiale)" : v.reference === "DEV-2605-002" ? "(Négociée)" : "(Finale)"}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Reference, Prestataire, Date & Statut */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold uppercase">Réf. Devis</span>
                    <span className="font-bold text-slate-800 font-mono">{displayedCommande.reference}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold uppercase">Prestataire</span>
                    <span className="font-bold text-slate-800">{displayedCommande.prestataire ?? selectedCommande.prestataire}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold uppercase">Date de Demande</span>
                    <span className="font-semibold text-slate-600">
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit", month: "long", year: "numeric"
                      }).format(new Date(displayedCommande.date))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold uppercase">Statut</span>
                    <Badge variant="outline" className={`font-semibold text-xs px-2 py-0.5 rounded-sm ${statutCommandeConfig[displayedCommande.statut] || "bg-slate-50 text-slate-600"}`}>
                      {displayedCommande.statut}
                    </Badge>
                  </div>
                </div>

                {/* Suivi et Progression du Devis */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Suivi et Progression</h4>
                  <div className="rounded-xl border border-slate-100 p-4 bg-white space-y-4 shadow-sm">
                    {/* Stepper horizontal */}
                    <div className="relative flex items-center justify-between w-full pb-2">
                      <div className="absolute left-0 right-0 top-4 -translate-y-1/2 h-0.5 bg-slate-100 z-0"></div>
                      
                      {[
                        { index: 1, label: "Demande" },
                        { index: 2, label: "Proposition" },
                        { index: 3, label: "Validation" },
                        { index: 4, label: "Finalisation" }
                      ].map((step) => {
                        const state = getStepState(displayedCommande.statut, step.index)
                        
                        let circleClass = ""
                        let icon = null
                        let labelClass = "text-slate-400 font-medium"
                        
                        if (state === "completed") {
                          circleClass = "bg-emerald-500 text-white ring-4 ring-emerald-50"
                          icon = <CheckCircle2 className="size-4 shrink-0" />
                          labelClass = "text-emerald-700 font-semibold"
                        } else if (state === "active") {
                          circleClass = "bg-[#023B8A] text-white ring-4 ring-blue-100"
                          icon = <Clock className="size-4 animate-spin [animation-duration:3s] shrink-0" />
                          labelClass = "text-[#023B8A] font-bold"
                        } else if (state === "failed") {
                          circleClass = "bg-red-500 text-white ring-4 ring-red-50"
                          icon = <XCircle className="size-4 shrink-0" />
                          labelClass = "text-red-700 font-semibold"
                        } else {
                          circleClass = "bg-slate-100 text-slate-400 border border-slate-200"
                          icon = <span className="text-[10px] font-bold shrink-0">{step.index}</span>
                          labelClass = "text-slate-400 font-medium"
                        }
                        
                        return (
                          <div key={step.index} className="flex flex-col items-center relative z-10 shrink-0 select-none">
                            <div className={`size-8 rounded-full flex items-center justify-center transition-all duration-300 ${circleClass}`}>
                              {icon}
                            </div>
                            <span className={`text-[10px] mt-1.5 transition-colors duration-300 ${labelClass}`}>
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Vertical History Log */}
                    {selectedCommande.historique && selectedCommande.historique.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Journal des échanges & Négociations
                          </p>
                          <Badge variant="secondary" className="text-[9px] font-bold py-0.5 px-2 bg-slate-100 text-slate-600 rounded-full border-none">
                            {selectedCommande.historique.length} étapes
                          </Badge>
                        </div>
                        <div className="space-y-3.5 pl-1 max-h-[160px] overflow-y-auto pr-1">
                          {selectedCommande.historique.map((h: any, idx: number) => {
                            const isLast = idx === selectedCommande.historique.length - 1;
                            const isCancelled = selectedCommande.statut.toLowerCase() === "annulé";
                            
                            let bulletColor = "border-slate-300 bg-white";
                            if (isLast) {
                              bulletColor = isCancelled ? "border-red-500 bg-red-50" : "border-emerald-500 bg-emerald-50";
                            }

                            return (
                              <div key={idx} className="flex gap-3 text-xs relative">
                                {/* Connector Line */}
                                {idx < selectedCommande.historique.length - 1 && (
                                  <div className="absolute left-[5.5px] top-[14px] bottom-[-16px] w-[1px] bg-slate-200"></div>
                                )}
                                
                                {/* Bullet */}
                                <div className={`size-3 rounded-full border-2 mt-1 shrink-0 z-10 transition-colors ${bulletColor}`}></div>

                                {/* Details */}
                                <div className="flex-1 space-y-0.5 min-w-0">
                                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                                    <span className="font-bold text-slate-700">{h.action}</span>
                                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                      {new Intl.DateTimeFormat("fr-FR", {
                                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                                      }).format(new Date(h.date))}
                                    </span>
                                  </div>
                                  <p className="text-slate-500 text-[11px] leading-relaxed break-words">{h.description}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Infos Événement */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Détails de l&apos;Événement</h4>
                  <div className="rounded-xl border border-slate-100 p-4 bg-white space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-muted-foreground block font-medium">Type d&apos;événement</span>
                        <span className="font-bold text-slate-800">{displayedCommande.typeeventement ?? selectedCommande.typeeventement}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium">Lieu de l&apos;événement</span>
                        <span className="font-bold text-slate-800">{displayedCommande.lieu ?? selectedCommande.lieu}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-muted-foreground block font-medium">Nombre d&apos;invités</span>
                        <span className="font-bold text-slate-800">{displayedCommande.nbInvites ?? selectedCommande.nbInvites}</span>
                      </div>
                      {(displayedCommande.dateeventement ?? selectedCommande.dateeventement) && (
                        <div>
                          <span className="text-muted-foreground block font-medium">Date prévue</span>
                          <span className="font-bold text-slate-800">
                            {new Intl.DateTimeFormat("fr-FR", {
                              day: "2-digit", month: "long", year: "numeric"
                            }).format(new Date(displayedCommande.dateeventement ?? selectedCommande.dateeventement))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message de la demande */}
                {(displayedCommande.message ?? selectedCommande.message) && (displayedCommande.message ?? selectedCommande.message) !== "Aucun message" && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Description du projet (Organisateur)</h4>
                    <div className="rounded-xl border border-slate-100 p-3.5 bg-slate-50/50 text-xs italic text-slate-700 leading-relaxed">
                      &ldquo;{displayedCommande.message ?? selectedCommande.message}&rdquo;
                    </div>
                  </div>
                )}

                {/* Réponse prestataire */}
                {(displayedCommande.reponsePresta ?? selectedCommande.reponsePresta) && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#023B8A]">Note explicative du prestataire</h4>
                    <div className="rounded-xl border border-[#023B8A]/10 p-3.5 bg-blue-50/20 text-xs text-slate-700 leading-relaxed">
                      {displayedCommande.reponsePresta ?? selectedCommande.reponsePresta}
                    </div>
                  </div>
                )}

                {/* Lignes du devis */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Prestations détaillées</h4>
                  <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                    {(displayedCommande.lignes ?? selectedCommande.lignes) && (displayedCommande.lignes ?? selectedCommande.lignes).length > 0 ? (
                      (displayedCommande.lignes ?? selectedCommande.lignes).map((line: any, idx: number) => (
                        <div key={line.id || idx} className={`flex justify-between items-center p-3 text-xs ${idx < (displayedCommande.lignes ?? selectedCommande.lignes).length - 1 ? 'border-b border-slate-50' : ''}`}>
                          <div className="max-w-[70%]">
                            <p className="font-bold text-slate-800">{line.designation}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {line.quantite} x {new Intl.NumberFormat("fr-FR").format(line.prixUnitaire)} F
                            </p>
                          </div>
                          <span className="font-bold text-slate-700 font-mono shrink-0">
                            {new Intl.NumberFormat("fr-FR").format(line.totalLigne)} F
                          </span>
                        </div>
                      ))
                    ) : (
                      /* Fallback Mock lines if no DB lines present */
                      <>
                        <div className="flex justify-between items-center p-3 border-b border-slate-50 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">Prestation principale</p>
                            <p className="text-[10px] text-muted-foreground">DJ, Sonorisation complète et éclairage dynamique de l'événement</p>
                          </div>
                          <span className="font-bold text-slate-750 font-mono text-xs shrink-0">1x</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b border-slate-50 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">Frais de déplacement & Installation</p>
                            <p className="text-[10px] text-muted-foreground">Zone d'Abidjan et communes limitrophes</p>
                          </div>
                          <span className="font-bold text-slate-750 font-mono text-xs shrink-0">Inclus</span>
                        </div>
                        <div className="flex justify-between items-center p-3 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">Assistance technique sur site</p>
                            <p className="text-[10px] text-muted-foreground">Présence d'un ingénieur son dédié durant 6h</p>
                          </div>
                          <span className="font-bold text-slate-750 font-mono text-xs shrink-0">Inclus</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Total Card */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-900 text-sm">Montant Total</span>
                  <span className="font-extrabold text-[#023B8A] text-lg font-mono">
                    {new Intl.NumberFormat("fr-FR").format(displayedCommande.montant)} FCFA
                  </span>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button onClick={() => setSelectedCommande(null)} className="w-full bg-[#023B8A] hover:bg-[#023B8A]/90 text-white font-semibold cursor-pointer">
              Fermer la fiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
