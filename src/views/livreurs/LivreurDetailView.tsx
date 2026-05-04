"use client"

import * as React from "react"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Truck,
  PackageCheck,
  BanknoteIcon,
  FileCheck,
  FileText,
  Calendar,
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

const livreur = {
  id: "LIV-001",
  nom: "Bamba Issouf",
  email: "bamba.issouf@gmail.com",
  telephone: "+225 01 45 67 89",
  commune: "Yopougon",
  zones: ["Yopougon", "Abobo", "Adjamé"],
  vehicule: { type: "Moto", marque: "Yamaha YBR 125", immat: "AB 1234 CI" },
  statut: "actif" as const,
  note: 4.8,
  courses: 312,
  tauxAcceptation: 94,
  revenus: 1240000,
  soldeWallet: 7400,
  dateInscription: "2025-09-12",
  documents: [
    { nom: "Carte nationale d'identité", statut: "valide", expiration: "2030-04-12" },
    { nom: "Permis de conduire", statut: "valide", expiration: "2028-09-05" },
    { nom: "Carte grise véhicule", statut: "valide", expiration: "2027-03-22" },
    { nom: "Casier judiciaire", statut: "valide", expiration: "2026-09-12" },
    { nom: "Justificatif de domicile", statut: "valide", expiration: "—" },
  ],
  retraitsRecents: [
    { id: "RET-0042", montant: 45000, operateur: "Wave", date: "2026-04-22T14:32:00", statut: "Effectué" },
    { id: "RET-0038", montant: 30000, operateur: "Orange Money", date: "2026-04-15T09:18:00", statut: "Effectué" },
    { id: "RET-0033", montant: 25000, operateur: "MTN MoMo", date: "2026-04-08T16:45:00", statut: "Effectué" },
    { id: "RET-0028", montant: 40000, operateur: "Wave", date: "2026-04-01T11:22:00", statut: "Effectué" },
  ],
  derniersCourses: [
    { id: "CMD-2604-002", date: "2026-04-25", commune: "Cocody", montant: 95000, statut: "En cours" },
    { id: "CMD-2604-001", date: "2026-04-25", commune: "Cocody", montant: 185000, statut: "Livrée" },
    { id: "CMD-2603-198", date: "2026-04-24", commune: "Yopougon", montant: 48500, statut: "Livrée" },
    { id: "CMD-2603-187", date: "2026-04-24", commune: "Abobo", montant: 72000, statut: "Livrée" },
    { id: "CMD-2603-176", date: "2026-04-23", commune: "Yopougon", montant: 28000, statut: "Livrée" },
  ],
}

interface LivreurDetailViewProps {
  id: string
}

export default function LivreurDetailView({ id }: LivreurDetailViewProps) {
  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" className="h-8 gap-1 pl-1 text-muted-foreground mb-1">
            <ArrowLeft className="h-4 w-4" />
            Livreurs
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{livreur.nom}</h1>
            <Badge variant="outline" className="border-none rounded-sm bg-green-600/10 text-green-600">
              {livreur.statut === "actif" ? "Actif" : "Suspendu"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {livreur.id} • Inscrit le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit", month: "long", year: "numeric",
            }).format(new Date(livreur.dateInscription))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" /> Contacter
          </Button>
          <Button variant="destructive">Suspendre</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card mt-4 dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Note moyenne</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {livreur.note} / 5
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+0.3
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              En progression <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Sur les 312 courses</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Courses effectuées</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {livreur.courses.toLocaleString("fr-FR")}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <IconTrendingUp className="text-green-700" />+24
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-700">
              24 courses ce mois <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">Depuis l&apos;inscription</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Taux d&apos;acceptation</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {livreur.tauxAcceptation}%
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-red-600 text-red-700">
                <IconTrendingDown className="text-red-700" />-2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-red-700">
              Léger recul <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">Vs. mois dernier</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Solde wallet</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {livreur.soldeWallet.toLocaleString("fr-FR")} FCFA
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-blue-600 text-blue-700">
                Disponible
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">Prêt à retirer</div>
            <div className="text-muted-foreground">Cumul de la semaine</div>
          </CardFooter>
        </Card>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Documents KYC */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Documents KYC</h2>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livreur.documents.map((doc) => (
                    <TableRow key={doc.nom}>
                      <TableCell className="font-medium">{doc.nom}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-none rounded-sm bg-green-600/10 text-green-600">
                          Valide
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{doc.expiration}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="mr-1 h-3.5 w-3.5" />
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Dernières courses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Dernières courses</h2>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Commune</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livreur.derniersCourses.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit", month: "short",
                        }).format(new Date(c.date))}
                      </TableCell>
                      <TableCell className="text-sm">{c.commune}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {c.montant.toLocaleString("fr-FR")} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-none rounded-sm ${
                            c.statut === "Livrée"
                              ? "bg-green-600/10 text-green-600"
                              : "bg-blue-600/10 text-blue-600"
                          }`}
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

          {/* Historique des retraits */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Historique des retraits</h2>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livreur.retraitsRecents.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                        }).format(new Date(r.date))}
                      </TableCell>
                      <TableCell className="text-sm">{r.operateur}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {r.montant.toLocaleString("fr-FR")} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-none rounded-sm bg-green-600/10 text-green-600">
                          {r.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          {/* Profil */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg">
                  {livreur.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{livreur.nom}</p>
                  <p className="text-xs text-muted-foreground">{livreur.id}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{livreur.telephone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{livreur.email}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>Réside : {livreur.commune}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Inscrit le{" "}
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit", month: "short", year: "numeric",
                    }).format(new Date(livreur.dateInscription))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Véhicule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" /> Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{livreur.vehicule.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Marque / Modèle</span>
                <span className="font-medium">{livreur.vehicule.marque}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Immatriculation</span>
                <span className="font-medium font-mono">{livreur.vehicule.immat}</span>
              </div>
            </CardContent>
          </Card>

          {/* Zones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" /> Zones de service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {livreur.zones.map((z) => (
                  <Badge key={z} variant="outline" className="text-xs">
                    {z}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenus */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Revenus cumulés</CardTitle>
              <CardDescription>Depuis l&apos;inscription</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">
                {livreur.revenus.toLocaleString("fr-FR")} FCFA
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
