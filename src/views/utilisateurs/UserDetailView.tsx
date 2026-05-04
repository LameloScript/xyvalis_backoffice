"use client"

import * as React from "react"
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

const client = {
  id: "USR-001",
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
      contenu: "Client VIP — toujours noté 5 étoiles aux livreurs. Privilégier en cas de promo.",
    },
    {
      id: 2,
      auteur: "Diallo Fatoumata",
      date: "2026-02-08T14:18:00",
      contenu: "A appelé pour signaler un retard. Très compréhensif. Geste commercial : 1 livraison offerte.",
    },
  ],
  commandes: [
    { id: "CMD-2604-002", date: "2026-04-25", livreur: "Traoré Moussa", montant: 95000, statut: "En cours" },
    { id: "CMD-2603-187", date: "2026-04-22", livreur: "Bamba Issouf", montant: 72000, statut: "Livrée" },
    { id: "CMD-2603-152", date: "2026-04-15", livreur: "Diallo Mamadou", montant: 145000, statut: "Livrée" },
    { id: "CMD-2603-098", date: "2026-04-08", livreur: "Koffi Akissi", montant: 28000, statut: "Livrée" },
    { id: "CMD-2603-042", date: "2026-04-02", livreur: "Coulibaly Seydou", montant: 185000, statut: "Livrée" },
  ],
}

const statutCommandeConfig: Record<string, string> = {
  "En cours": "bg-blue-600/10 text-blue-600",
  "Livrée": "bg-green-600/10 text-green-600",
  "Annulée": "bg-red-600/10 text-red-600",
}

interface UserDetailViewProps {
  id: string
}

export default function UserDetailView({ id }: UserDetailViewProps) {
  const [nouvelleNote, setNouvelleNote] = React.useState("")
  const [statut, setStatut] = React.useState<"actif" | "suspendu">(client.statut)

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground mb-1">
            <ArrowLeft className="h-4 w-4" />
            Utilisateurs
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{client.nom}</h1>
            <Badge
              variant="outline"
              className={`border-none rounded-sm ${
                statut === "actif" ? "bg-green-600/10 text-green-600" : "bg-red-600/10 text-red-600"
              }`}
            >
              {statut === "actif" ? "Actif" : "Suspendu"}
            </Badge>
            <Badge variant="outline" className="border-none rounded-sm bg-blue-600/10 text-blue-600">
              Client
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {client.id} • Inscrit le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit", month: "long", year: "numeric",
            }).format(new Date(client.dateInscription))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" /> Contacter
          </Button>
          {statut === "actif" ? (
            <Button variant="destructive" onClick={() => setStatut("suspendu")}>
              Suspendre
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setStatut("actif")}
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
              {client.totalCommandes}
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
            <CardDescription>Solde wallet</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {client.soldeWallet.toLocaleString("fr-FR")} FCFA
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-blue-600 text-blue-700">
                Disponible
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Crédit utilisable</div>
            <div className="text-muted-foreground">Bonus & remboursements</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Note reçue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {client.note} / 5
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
            <div className="text-muted-foreground">Basée sur 47 livraisons</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total dépensé</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {client.totalDepense.toLocaleString("fr-FR")} FCFA
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
            <div className="text-muted-foreground">Cumul total des commandes</div>
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
              <h2 className="text-base font-semibold">Historique des commandes</h2>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Livreur</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.commandes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                        }).format(new Date(c.date))}
                      </TableCell>
                      <TableCell className="text-sm">{c.livreur}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {c.montant.toLocaleString("fr-FR")} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-none rounded-sm ${statutCommandeConfig[c.statut]}`}
                        >
                          {c.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes internes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                Notes internes
              </CardTitle>
              <CardDescription>Visibles uniquement par les administrateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.notesInternes.map((n) => (
                <div key={n.id} className="rounded-md border bg-amber-50/40 border-amber-100 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{n.auteur}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      }).format(new Date(n.date))}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{n.contenu}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Ajouter une note</p>
                <Textarea
                  value={nouvelleNote}
                  onChange={(e) => setNouvelleNote(e.target.value)}
                  placeholder="Note interne sur ce client..."
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button size="sm" disabled={!nouvelleNote.trim()}>
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          {/* Profil */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">
                  {client.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{client.nom}</p>
                  <p className="text-xs text-muted-foreground">{client.id}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{client.telephone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{client.adresse}, {client.commune}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Dernière connexion :{" "}
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    }).format(new Date(client.derniereConnexion))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" /> Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Solde actuel</span>
                <span className="font-bold text-lg tabular-nums">
                  {client.soldeWallet.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <Separator />
              <Button variant="outline" size="sm" className="w-full">
                Ajuster le solde
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Voir les transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
