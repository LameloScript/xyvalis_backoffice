"use client"

import * as React from "react"
import {
  MapPin,
  Package,
  Truck,
  Store,
  Phone,
  Clock,
  CheckCircle2,
  Circle,
  XCircle,
  ChevronDown,
  ArrowLeft,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

type TimelineStep = {
  label: string
  description: string
  date: string
  done: boolean
  current: boolean
  cancelled?: boolean
}

import commandeDetailMock from "@/data/mock/commande_detail.json"

const commandeDetail = commandeDetailMock.commandeDetail as any

const timelineSteps: TimelineStep[] = commandeDetailMock.timelineSteps as TimelineStep[]

const statutOptions = [
  { value: "en_cours", label: "En cours" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
]

const statutConfig = {
  en_cours: { label: "En cours", className: "bg-blue-600/10 text-blue-600" },
  livree: { label: "Livrée", className: "bg-green-600/10 text-green-600" },
  annulee: { label: "Annulée", className: "bg-red-600/10 text-red-600" },
}

const paiementConfig = {
  collecte: { label: "Collecté", className: "bg-green-600/10 text-green-600" },
  a_collecter: { label: "À collecter", className: "bg-orange-600/10 text-orange-600" },
}

interface CommandeDetailViewProps {
  id: string
}

export default function CommandeDetailView({ id }: CommandeDetailViewProps) {
  const cmd = commandeDetail
  const statutCfg = statutConfig[cmd.statut as keyof typeof statutConfig] || statutConfig.en_cours
  const paiementCfg = paiementConfig[cmd.paiement as keyof typeof paiementConfig] || paiementConfig.a_collecter

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Commandes
            </Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{cmd.id}</h1>
            <Badge
              variant="outline"
              className={`border-none rounded-sm ${statutCfg.className}`}
            >
              {statutCfg.label}
            </Badge>
            <Badge
              variant="outline"
              className={`border-none rounded-sm ${paiementCfg.className}`}
            >
              {paiementCfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Passée le 25 avr. 2026 à 09h14 — Mode :{" "}
            <span className="font-medium text-foreground">Point relais</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Forcer le statut <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Choisir un statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statutOptions
                .filter((o) => o.value !== cmd.statut)
                .map((o) => (
                  <DropdownMenuItem key={o.value}>
                    → {o.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive">Annuler la commande</Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* LEFT: Order info + Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Client */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Nom</p>
                <p className="font-medium">{cmd.client.nom}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Téléphone</p>
                <p className="font-medium">{cmd.client.telephone}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-muted-foreground">Adresse</p>
                <p className="font-medium">
                  {cmd.client.adresse}, {cmd.client.commune}, {cmd.client.ville}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Colis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Détails du colis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Type de colis</p>
                  <p className="font-medium capitalize">{cmd.colis.typeColis}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Poids estimé</p>
                  <p className="font-medium">{cmd.colis.poids}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Véhicule</p>
                  <p className="font-medium capitalize">{cmd.vehicule}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Urgence</p>
                  <p className="font-medium capitalize">{cmd.urgence.replace("-", " ")}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">Description</p>
                  <p className="font-medium">{cmd.colis.description}</p>
                </div>
                {cmd.colis.reperes && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-muted-foreground">Repères</p>
                    <p className="font-medium">{cmd.colis.reperes}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>De</span>
                  <span>{cmd.pickup.quartier}, {cmd.pickup.commune}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Vers</span>
                  <span>{cmd.dropoff.quartier}, {cmd.dropoff.commune}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Frais de livraison</span>
                  <span>{cmd.fraisLivraison.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Méthode de paiement</span>
                  <span>{cmd.methodePaiement}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Suivi de la commande
              </CardTitle>
              <CardDescription>Historique des étapes de livraison</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-3 space-y-0">
                {timelineSteps.map((step, i) => (
                  <li key={i} className="mb-5 ml-6 last:mb-0">
                    <span
                      className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-background ${
                        step.cancelled
                          ? "bg-red-100 text-red-600"
                          : step.done
                          ? "bg-green-100 text-green-600"
                          : step.current
                          ? "bg-blue-100 text-blue-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.cancelled ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : step.done ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : step.current ? (
                        <Circle className="h-3.5 w-3.5 fill-current" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            step.current ? "text-blue-600" : step.done ? "" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                          {step.current && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-none rounded-sm bg-blue-600/10 text-blue-600 text-xs"
                            >
                              En cours
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {step.date}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Prestataire + Point relais */}
        <div className="flex flex-col gap-4">
          {/* Prestataire */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Prestataire assigné
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-base font-semibold">
                  {cmd.prestataire.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{cmd.prestataire.nom}</p>
                  <p className="text-xs text-muted-foreground">{cmd.prestataire.id}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{cmd.prestataire.telephone}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Truck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{cmd.prestataire.vehicule}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>Zone : {cmd.prestataire.zone}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Voir le profil
              </Button>
            </CardContent>
          </Card>

          {/* Point relais */}
          {cmd.modeLivraison === "relais" && cmd.pointRelais && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  Point relais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">{cmd.pointRelais.nom}</p>
                  <p className="text-xs text-muted-foreground">{cmd.pointRelais.id}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{cmd.pointRelais.telephone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>
                      {cmd.pointRelais.adresse}, {cmd.pointRelais.commune}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>Horaires : {cmd.pointRelais.horaires}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Store className="h-3.5 w-3.5 shrink-0" />
                    <span>Resp. : {cmd.pointRelais.responsable}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Voir le point relais
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Résumé paiement */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Résumé paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Statut paiement</span>
                <Badge
                  variant="outline"
                  className={`border-none rounded-sm ${paiementCfg.className}`}
                >
                  {paiementCfg.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Méthode</span>
                <span className="font-medium">{cmd.methodePaiement}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>Total à collecter</span>
                <span>{cmd.montantTotal.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
