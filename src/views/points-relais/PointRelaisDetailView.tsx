"use client"

import * as React from "react"
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  Package,
  User,
  Edit,
  MessageSquare,
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
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const relais = {
  id: "PR-002",
  nomBoutique: "Service Express Yopougon",
  responsable: { nom: "Konan Yao", id: "USR-019", telephone: "+225 05 98 76 54" },
  telephone: "+225 27 23 45 67 89",
  commune: "Yopougon",
  quartier: "Niangon Nord",
  adresse: "Boulevard Principal, à côté de la pharmacie Niangon",
  reperes: "Face à la station-service Total, 2ème porte sur la droite",
  type: "Boutique",
  horaires: "Lun-Sam : 07h30 - 21h00 | Dim : 09h00 - 18h00",
  capacite: 80,
  colisEnStock: 34,
  colisExpires: 5,
  fraisExpiresAccumules: 10000,
  note: 4.7,
  totalColisTraites: 1248,
  revenus: 312000,
  statut: "actif" as const,
  dateInscription: "2025-11-15",
  colisRecents: [
    { id: "CMD-2604-002", client: "Konan Yao", recu: "2026-04-25T14:32:00", statut: "en_attente_retrait", joursStock: 1 },
    { id: "CMD-2604-008", client: "Aya Traoré", recu: "2026-04-25T11:15:00", statut: "en_attente_retrait", joursStock: 1 },
    { id: "CMD-2603-176", client: "Bamba Issouf", recu: "2026-04-22T09:45:00", statut: "retire", joursStock: 0 },
    { id: "CMD-2603-152", client: "Diallo Fatou", recu: "2026-04-15T17:20:00", statut: "expire", joursStock: 11 },
    { id: "CMD-2603-148", client: "N'Goran Prisca", recu: "2026-04-12T10:08:00", statut: "expire", joursStock: 14 },
  ],
}

const statutColisConfig: Record<string, { label: string; className: string }> = {
  en_attente_retrait: { label: "En attente retrait", className: "bg-blue-600/10 text-blue-600" },
  retire: { label: "Retiré", className: "bg-green-600/10 text-green-600" },
  expire: { label: "Expiré", className: "bg-red-600/10 text-red-600" },
}

interface PointRelaisDetailViewProps {
  id: string
}

export default function PointRelaisDetailView({ id }: PointRelaisDetailViewProps) {
  const occupation = (relais.colisEnStock / relais.capacite) * 100

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground mb-1">
            <ArrowLeft className="h-4 w-4" />
            Points relais
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{relais.nomBoutique}</h1>
            <Badge variant="outline" className="border-none rounded-sm bg-green-600/10 text-green-600">
              Actif
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {relais.id} • {relais.type} • {relais.commune} / {relais.quartier}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" /> Contacter
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button variant="destructive">Suspendre</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card mt-4 dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Colis en stock</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {relais.colisEnStock} / {relais.capacite}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+8
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              {Math.round(occupation)}% capacité <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {relais.capacite - relais.colisEnStock} places disponibles
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Colis expirés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {relais.colisExpires}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-red-600 text-red-700">
                <IconTrendingDown className="text-red-700" />+2
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-red-700">
              À traiter rapidement <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Frais : {relais.fraisExpiresAccumules.toLocaleString("fr-FR")} FCFA
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Note moyenne</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {relais.note} / 5
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+0.1
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              Bien noté ce mois <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {relais.totalColisTraites} colis traités
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Revenus ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {relais.revenus.toLocaleString("fr-FR")} FCFA
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+12%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              Vs. mois dernier <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Avril 2026</div>
          </CardFooter>
        </Card>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Colis récents */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Colis récents</h2>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Reçu le</TableHead>
                    <TableHead>Jours stock</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relais.colisRecents.map((c) => {
                    const cfg = statutColisConfig[c.statut]
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs">{c.id}</TableCell>
                        <TableCell className="text-sm font-medium">{c.client}</TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Intl.DateTimeFormat("fr-FR", {
                            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                          }).format(new Date(c.recu))}
                        </TableCell>
                        <TableCell className="text-sm">
                          {c.joursStock === 0 ? "—" : `${c.joursStock}j`}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`border-none rounded-sm ${cfg.className}`}>
                            {cfg.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Adresse + repères */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Commune</p>
                  <p className="font-medium">{relais.commune}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Quartier</p>
                  <p className="font-medium">{relais.quartier}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Adresse complète</p>
                <p className="font-medium">{relais.adresse}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Repères</p>
                <p className="font-medium">{relais.reperes}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          {/* Responsable */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" /> Responsable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {relais.responsable.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{relais.responsable.nom}</p>
                  <p className="text-xs text-muted-foreground">{relais.responsable.id}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{relais.responsable.telephone}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Voir le profil
              </Button>
            </CardContent>
          </Card>

          {/* Coordonnées boutique */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Coordonnées boutique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{relais.telephone}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{relais.horaires}</span>
              </div>
            </CardContent>
          </Card>

          {/* Capacité */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Capacité de stockage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacité maximale</span>
                <span className="font-semibold">{relais.capacite} colis</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Actuellement stockés</span>
                <span className="font-semibold">{relais.colisEnStock} colis</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Disponible</span>
                <span className="font-semibold text-green-600">
                  {relais.capacite - relais.colisEnStock} places
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
