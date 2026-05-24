"use client"

import * as React from "react"
import {
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react"
import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ── Mock data ──────────────────────────────────────────────────────────────

import financeMockData from "@/data/mock/finance.json"

const transactions = financeMockData.transactions

const demandesRetrait = financeMockData.demandesRetrait

const portefeuilles = financeMockData.portefeuilles

// ── Helpers ────────────────────────────────────────────────────────────────

function typeBadge(type: string) {
  const map: Record<string, string> = {
    Gain: "bg-green-100 text-green-700",
    Retrait: "bg-orange-100 text-orange-700",
    Bonus: "bg-blue-100 text-blue-700",
    Commission: "bg-purple-100 text-purple-700",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[type] ?? "bg-muted text-muted-foreground"}`}>
      {type}
    </span>
  )
}

function statutBadge(statut: string) {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Complété: "default",
    "En attente": "secondary",
    Rejeté: "destructive",
  }
  return <Badge variant={map[statut] ?? "outline"}>{statut}</Badge>
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    Prestataire: "bg-sky-100 text-sky-700",
    Client: "bg-amber-100 text-amber-700",
    Relais: "bg-violet-100 text-violet-700",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[role] ?? "bg-muted text-muted-foreground"}`}>
      {role}
    </span>
  )
}

// ── Component ──────────────────────────────────────────────────────────────

export default function FinanceView() {
  const [retrait, setRetrait] = React.useState(demandesRetrait)

  function valider(id: number) {
    setRetrait((prev) => prev.filter((d) => d.id !== id))
  }
  function rejeter(id: number) {
    setRetrait((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Finance</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble des flux financiers de la plateforme.
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Reventus plateforme ce mois</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              1 248 500
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+18%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Croissance soutenue <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Avril 2026</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Commissions collectées</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              384 200
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+9.4%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Marges en hausse <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Sur l&apos;ensemble du réseau</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Retraits en attente</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              5
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-amber-500 text-white">
                <IconTrendingUp className="text-white" />+2
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-amber-300">
              À traiter <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Demandes en file</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Volume total transactions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              6 740 000
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+22%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-emerald-300">
              Forte activité <IconTrendingUp className="size-4" />
            </div>
            <div className="text-white/60">Tous types confondus</div>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="retraits">Demandes de retrait</TabsTrigger>
          <TabsTrigger value="portefeuilles">Portefeuilles</TabsTrigger>
        </TabsList>

        {/* ── Transactions ── */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Historique des transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{tx.id}</TableCell>
                      <TableCell>{typeBadge(tx.type)}</TableCell>
                      <TableCell className="font-medium">{tx.user}</TableCell>
                      <TableCell>{roleBadge(tx.role)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {tx.montant.toLocaleString("fr-CI")} FCFA
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{tx.date}</TableCell>
                      <TableCell>{statutBadge(tx.statut)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Demandes de retrait ── */}
        <TabsContent value="retraits">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de retrait en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Opérateur Mobile Money</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retrait.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Aucune demande en attente
                      </TableCell>
                    </TableRow>
                  ) : (
                    retrait.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.nom}</TableCell>
                        <TableCell>{roleBadge(d.role)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {d.montant.toLocaleString("fr-CI")} FCFA
                        </TableCell>
                        <TableCell>{d.operateur}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{d.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => valider(d.id)}
                            >
                              <CheckCircle className="mr-1 h-3.5 w-3.5" />
                              Valider
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => rejeter(d.id)}
                            >
                              <XCircle className="mr-1 h-3.5 w-3.5" />
                              Rejeter
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Portefeuilles ── */}
        <TabsContent value="portefeuilles">
          <Card>
            <CardHeader>
              <CardTitle>Portefeuilles utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-right">Solde FCFA</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portefeuilles.map((p) => (
                    <TableRow key={p.user}>
                      <TableCell className="font-medium">{p.user}</TableCell>
                      <TableCell>{roleBadge(p.role)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {p.solde.toLocaleString("fr-CI")} FCFA
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.activite}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir détails</DropdownMenuItem>
                            <DropdownMenuItem>Ajuster solde</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Bloquer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
