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

// ── Mock data ──────────────────────────────────────────────────────────────

const faqEntrees = [
  { id: 1, question: "Comment créer un compte livreur ?", categorie: "Compte", modif: "20 avr. 2026" },
  { id: 2, question: "Comment suivre mon colis en temps réel ?", categorie: "Livraison", modif: "18 avr. 2026" },
  { id: 3, question: "Quels sont les délais de livraison standard ?", categorie: "Livraison", modif: "15 avr. 2026" },
  { id: 4, question: "Comment devenir point relais partenaire ?", categorie: "Relais", modif: "12 avr. 2026" },
  { id: 5, question: "Comment retirer mes gains sur Mobile Money ?", categorie: "Finance", modif: "10 avr. 2026" },
  { id: 6, question: "Que faire si mon colis est endommagé ?", categorie: "Réclamation", modif: "8 avr. 2026" },
  { id: 7, question: "Puis-je modifier une commande après validation ?", categorie: "Commandes", modif: "5 avr. 2026" },
]

const cguInitial = `CONDITIONS GÉNÉRALES D'UTILISATION — XYVALIS

Dernière mise à jour : 1er avril 2026

1. OBJET
Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Xyvalis, accessible via l'application mobile et le site web, permettant la mise en relation entre expéditeurs, livreurs et points relais en Côte d'Ivoire.

2. INSCRIPTION ET COMPTE
L'accès à la plateforme est soumis à la création d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes, complètes et à jour. Toute usurpation d'identité entraînera la suspension immédiate du compte.

3. SERVICES PROPOSÉS
Xyvalis propose les services suivants :
- Livraison de colis de particulier à particulier
- Livraison depuis les commerces partenaires
- Retrait en point relais agréé
- Suivi en temps réel des livraisons

4. TARIFICATION
Les tarifs applicables sont affichés avant toute confirmation de commande. Xyvalis se réserve le droit de modifier ses tarifs avec un préavis de 7 jours notifié par l'application.

5. RESPONSABILITÉ
Xyvalis agit en qualité d'intermédiaire. La responsabilité de la plateforme est limitée aux dommages directs causés par son fait prouvé. Tout colis dont la valeur déclarée dépasse 500 000 FCFA doit faire l'objet d'une assurance séparée.

6. DONNÉES PERSONNELLES
Les données collectées sont traitées conformément à la loi ivoirienne n° 2013-450 relative à la protection des données à caractère personnel. L'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données.

7. LITIGES
En cas de litige, une réclamation doit être adressée au service client dans un délai de 7 jours suivant la livraison. À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents d'Abidjan.`

const supportMessages = [
  { id: 1, expediteur: "Kouamé Brou", sujet: "Colis non récupéré au relais", message: "Mon colis est au relais depuis 5 jours et je n'arrive pas à le récupérer…", date: "24 avr. 2026", statut: "Nouveau" },
  { id: 2, expediteur: "Aya Touré", sujet: "Remboursement livraison annulée", message: "J'ai annulé ma commande mais je n'ai toujours pas été remboursée…", date: "23 avr. 2026", statut: "Lu" },
  { id: 3, expediteur: "Ibrahim Koné", sujet: "Problème connexion compte relais", message: "Je ne peux plus me connecter à mon espace relais depuis hier…", date: "22 avr. 2026", statut: "Résolu" },
  { id: 4, expediteur: "Fatou Diallo", sujet: "Erreur sur le montant facturé", message: "Le montant débité est supérieur à ce qui était affiché lors de la commande…", date: "21 avr. 2026", statut: "Nouveau" },
  { id: 5, expediteur: "Jean Gnangnan", sujet: "Livreur injoignable", message: "Le livreur assigné à ma commande ne répond plus au téléphone…", date: "20 avr. 2026", statut: "Lu" },
  { id: 6, expediteur: "Mariam Coulibaly", sujet: "Demande de partenariat relais", message: "Je souhaite devenir point relais partenaire dans la commune de Yopougon…", date: "18 avr. 2026", statut: "Résolu" },
]

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
