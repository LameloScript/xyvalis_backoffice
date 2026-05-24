"use client"

import * as React from "react"
import { Send, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

// ── Mock data ──────────────────────────────────────────────────────────────

import notificationsMockData from "@/data/mock/notifications.json"

const historique = notificationsMockData.historique

const modeles = notificationsMockData.modeles

// ── Helpers ────────────────────────────────────────────────────────────────

function statutBadge(statut: string) {
  if (statut === "Envoyée")
    return <Badge variant="default">Envoyée</Badge>
  return <Badge variant="secondary">Planifiée</Badge>
}

function typeBadge(type: string) {
  const map: Record<string, string> = {
    livraison: "bg-blue-100 text-blue-700",
    promo: "bg-amber-100 text-amber-700",
    système: "bg-slate-100 text-slate-700",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[type] ?? "bg-muted text-muted-foreground"}`}>
      {type}
    </span>
  )
}

function truncate(str: string, n = 60) {
  return str.length > n ? str.slice(0, n) + "…" : str
}

// ── Component ──────────────────────────────────────────────────────────────

export default function NotificationsAdminView() {
  const [destinataires, setDestinataires] = React.useState("tous")
  const [titre, setTitre] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [sending, setSending] = React.useState(false)

  function handleEnvoyer() {
    if (!titre.trim() || !message.trim()) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setTitre("")
      setMessage("")
    }, 1200)
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Notifications</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Envoyez des notifications push et gérez vos modèles de messages.
        </div>
      </div>

      {/* ── Formulaire d'envoi ── */}
      <Card>
        <CardHeader>
          <CardTitle>Envoyer une notification push</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Destinataires</Label>
              <Select value={destinataires} onValueChange={setDestinataires}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les utilisateurs</SelectItem>
                  <SelectItem value="clients">Clients</SelectItem>
                  <SelectItem value="prestataires">Prestataires</SelectItem>
                  <SelectItem value="relais">Relais</SelectItem>
                  <SelectItem value="utilisateur">Un utilisateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Titre</Label>
              <Input
                placeholder="Titre de la notification"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Rédigez votre message ici…"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button onClick={handleEnvoyer} disabled={sending || !titre.trim() || !message.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Envoi en cours…" : "Envoyer la notification"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Tables : historique + modèles ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Historique */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historique.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium max-w-[120px] truncate">{n.titre}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {n.segment}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-[160px]">
                      {truncate(n.message, 50)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{n.date}</TableCell>
                    <TableCell>{statutBadge(n.statut)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modèles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Modèles de messages</CardTitle>
            <Button size="sm" variant="outline">
              Nouveau modèle
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du modèle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dernière modif.</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modeles.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.nom}</TableCell>
                    <TableCell>{typeBadge(m.type)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{m.modif}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Utiliser</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
