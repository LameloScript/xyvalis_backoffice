"use client"

import * as React from "react"
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  ShieldCheck,
  XCircle,
  Search,
  Clock,
  User,
  Truck,
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
import { Textarea } from "@/components/ui/textarea"

type StatutLitige = "ouvert" | "en_enquete" | "resolu" | "rejete"

const statutConfig: Record<StatutLitige, { label: string; className: string }> = {
  ouvert: { label: "Ouvert", className: "bg-orange-600/10 text-orange-600" },
  en_enquete: { label: "En enquête", className: "bg-blue-600/10 text-blue-600" },
  resolu: { label: "Résolu", className: "bg-green-600/10 text-green-600" },
  rejete: { label: "Rejeté", className: "bg-red-600/10 text-red-600" },
}

const litige = {
  id: "LTG-001",
  commandeId: "CMD-2604-002",
  client: {
    nom: "Konan Yao",
    telephone: "+225 01 23 45 67",
    email: "konan.yao@gmail.com",
  },
  livreur: {
    nom: "Traoré Moussa",
    telephone: "+225 07 44 55 66",
    id: "LIV-014",
  },
  motif: "Colis abîmé",
  description:
    "Le colis est arrivé fortement endommagé. L'écran du téléphone est fissuré et l'emballage présente plusieurs traces de chocs. Le client demande un remboursement intégral.",
  montantConteste: 95000,
  dateOuverture: "2026-04-25T11:32:00",
  statut: "ouvert" as StatutLitige,
  piecesJointes: [
    { nom: "photo-colis-1.jpg", taille: "2.4 MB", type: "image" },
    { nom: "photo-colis-2.jpg", taille: "2.1 MB", type: "image" },
    { nom: "facture.pdf", taille: "184 KB", type: "pdf" },
  ],
  echanges: [
    {
      auteur: "Konan Yao",
      role: "client",
      date: "2026-04-25T11:32:00",
      message:
        "Bonjour, j'ai reçu mon colis aujourd'hui mais l'écran du téléphone est complètement fissuré. L'emballage extérieur était également abîmé. Je joins les photos comme preuves. Je demande un remboursement complet de la commande.",
    },
    {
      auteur: "Système",
      role: "system",
      date: "2026-04-25T11:35:00",
      message: "Litige créé automatiquement suite à la réclamation du client.",
    },
    {
      auteur: "Aminata Koné",
      role: "admin",
      date: "2026-04-25T14:12:00",
      message:
        "Bonjour Konan, nous avons bien reçu votre réclamation et les photos. Nous allons vérifier auprès du livreur et du vendeur. Vous recevrez une réponse sous 48h.",
    },
  ],
}

interface LitigeDetailViewProps {
  id: string
}

export default function LitigeDetailView({ id }: LitigeDetailViewProps) {
  const [reponse, setReponse] = React.useState("")
  const [statut, setStatut] = React.useState<StatutLitige>(litige.statut)
  const cfg = statutConfig[statut]

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground mb-1">
            <ArrowLeft className="h-4 w-4" />
            Litiges
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{litige.id}</h1>
            <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
              {cfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Ouvert le {new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            }).format(new Date(litige.dateOuverture))} • Commande{" "}
            <span className="font-medium text-foreground font-mono">{litige.commandeId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {statut === "ouvert" && (
            <Button variant="outline" onClick={() => setStatut("en_enquete")}>
              <Search className="mr-2 h-4 w-4" /> Ouvrir une enquête
            </Button>
          )}
          {(statut === "ouvert" || statut === "en_enquete") && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setStatut("resolu")}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Approuver remboursement
              </Button>
              <Button variant="destructive" onClick={() => setStatut("rejete")}>
                <XCircle className="mr-2 h-4 w-4" /> Rejeter
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Motif */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Motif déclaré
              </CardTitle>
              <CardDescription>{litige.motif}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="leading-relaxed">{litige.description}</p>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Montant contesté</span>
                <span className="font-semibold text-base">
                  {litige.montantConteste.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pièces jointes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                Pièces jointes ({litige.piecesJointes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {litige.piecesJointes.map((pj) => (
                  <div key={pj.nom} className="flex items-center gap-3 p-3 rounded-md border bg-muted/30 hover:bg-muted/50 cursor-pointer">
                    <div className="h-9 w-9 rounded-md bg-background flex items-center justify-center shrink-0">
                      {pj.type === "image" ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{pj.nom}</p>
                      <p className="text-xs text-muted-foreground">{pj.taille}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Échanges */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Historique des échanges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {litige.echanges.map((e, i) => {
                const isAdmin = e.role === "admin"
                const isSystem = e.role === "system"
                return (
                  <div
                    key={i}
                    className={`flex flex-col gap-1 p-3 rounded-md border ${
                      isSystem
                        ? "bg-muted/30"
                        : isAdmin
                        ? "bg-blue-50/40 border-blue-100"
                        : "bg-amber-50/40 border-amber-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{e.auteur}</span>
                        <Badge variant="outline" className="text-xs border-none">
                          {e.role === "admin" ? "Admin" : e.role === "system" ? "Système" : "Client"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        }).format(new Date(e.date))}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{e.message}</p>
                  </div>
                )
              })}

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Répondre au client</p>
                <Textarea
                  value={reponse}
                  onChange={(e) => setReponse(e.target.value)}
                  placeholder="Tapez votre réponse..."
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button size="sm" disabled={!reponse.trim()}>
                    <Send className="mr-2 h-3.5 w-3.5" />
                    Envoyer la réponse
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          {/* Client */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-semibold">
                  {litige.client.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{litige.client.nom}</p>
                  <p className="text-xs text-muted-foreground">{litige.client.email}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground text-xs">Téléphone</p>
                <p className="font-medium">{litige.client.telephone}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Voir le profil client
              </Button>
            </CardContent>
          </Card>

          {/* Livreur */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Livreur impliqué
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="font-semibold">{litige.livreur.nom}</p>
                <p className="text-xs text-muted-foreground">{litige.livreur.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground text-xs">Téléphone</p>
                <p className="font-medium">{litige.livreur.telephone}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Voir le profil livreur
              </Button>
            </CardContent>
          </Card>

          {/* Décision */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Statut actuel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
                  {cfg.label}
                </Badge>
              </div>
              <Separator />
              {statut === "resolu" && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3">
                  <p className="text-xs font-medium text-green-700">
                    Remboursement approuvé pour {litige.montantConteste.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              )}
              {statut === "rejete" && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-xs font-medium text-red-700">
                    Litige rejeté — aucun remboursement accordé
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
