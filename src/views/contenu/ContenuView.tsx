"use client"

import * as React from "react"
import { Plus, MoreHorizontal, Save } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// ── Mock data ───────────────────
import faqMockData from "@/data/mock/faq.json"

const faqEntrees = faqMockData.faqEntrees

const cguInitial = faqMockData.cguInitial

const supportMessages = faqMockData.supportMessages

// ── Helpers ────────────────────────────────────────────────────────────────

function categorieBadge(cat: string) {
  const map: Record<string, string> = {
    Compte: "bg-blue-100 text-blue-700",
    Livraison: "bg-green-100 text-green-700",
    Relais: "bg-violet-100 text-violet-700",
    Finance: "bg-amber-100 text-amber-700",
    Réclamation: "bg-red-100 text-red-700",
    Commandes: "bg-sky-100 text-sky-700",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[cat] ?? "bg-muted text-muted-foreground"}`}>
      {cat}
    </span>
  )
}

function statutSupportBadge(statut: string) {
  if (statut === "Nouveau") return <Badge variant="destructive">Nouveau</Badge>
  if (statut === "Lu") return <Badge variant="secondary">Lu</Badge>
  return <Badge variant="outline">Résolu</Badge>
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ContenuView() {
  const [cguText, setCguText] = React.useState(cguInitial)
  const [cguSaved, setCguSaved] = React.useState(false)
  const [faq, setFaq] = React.useState(faqEntrees)
  const [support, setSupport] = React.useState(supportMessages)

  function handleSaveCgu() {
    setCguSaved(true)
    setTimeout(() => setCguSaved(false), 2000)
  }

  function deleteFaq(id: number) {
    setFaq((prev) => prev.filter((f) => f.id !== id))
  }

  function resolveTicket(id: number) {
    setSupport((prev) =>
      prev.map((s) => (s.id === id ? { ...s, statut: "Résolu" } : s))
    )
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Contenu & Support</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Gérez la FAQ, les CGU et les messages du support utilisateur.
        </div>
      </div>

      <Tabs defaultValue="faq">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="cgu">CGU</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* ── FAQ ── */}
        <TabsContent value="faq">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Foire aux questions</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-3.5 w-3.5" />
                Ajouter une entrée
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Dernière modif.</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faq.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.question}</TableCell>
                      <TableCell>{categorieBadge(f.categorie)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{f.modif}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => deleteFaq(f.id)}
                            >
                              Supprimer
                            </DropdownMenuItem>
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

        {/* ── CGU ── */}
        <TabsContent value="cgu">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Conditions Générales d'Utilisation</CardTitle>
              <Button size="sm" onClick={handleSaveCgu}>
                <Save className="mr-2 h-3.5 w-3.5" />
                {cguSaved ? "Enregistré !" : "Enregistrer les modifications"}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={cguText}
                onChange={(e) => setCguText(e.target.value)}
                rows={28}
                className="font-mono text-sm resize-y"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Support ── */}
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Messages entrants — Support utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expéditeur</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {support.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium whitespace-nowrap">{s.expediteur}</TableCell>
                      <TableCell className="max-w-[160px] truncate">{s.sujet}</TableCell>
                      <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">
                        {s.message}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{s.date}</TableCell>
                      <TableCell>{statutSupportBadge(s.statut)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir le message</DropdownMenuItem>
                            <DropdownMenuItem>Répondre</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => resolveTicket(s.id)}>
                              Marquer comme résolu
                            </DropdownMenuItem>
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
