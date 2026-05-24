"use client"

import * as React from "react"
import { Save, Bike, Truck, ShoppingBag, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ── Mock data ──────────────────────────────────────────────────────────────

import tarificationData from "@/data/mock/tarification.json"

const iconMap: Record<string, React.ComponentType<any>> = {
  Bike,
  Truck,
  ShoppingBag,
}

const communesInit = tarificationData.communesInit
const vehicules = tarificationData.vehicules.map((v) => ({
  ...v,
  icon: iconMap[v.icon] || Package,
}))
const urgenceMultiplicateurs = tarificationData.urgenceMultiplicateurs

// ── Component ──────────────────────────────────────────────────────────────

export default function TarificationView() {
  const [communes, setCommunes] = React.useState(communesInit)
  const [prixVehicules, setPrixVehicules] = React.useState<Record<string, string>>(
    Object.fromEntries(vehicules.map((v) => [v.key, v.prix]))
  )
  const [multiplicateurs, setMultiplicateurs] = React.useState<Record<string, string>>(
    Object.fromEntries(urgenceMultiplicateurs.map((u) => [u.key, u.multiplicateur]))
  )
  const [facteurDistance, setFacteurDistance] = React.useState("150")
  const [delaiRelais, setDelaiRelais] = React.useState("3")
  const [fraisStockage, setFraisStockage] = React.useState("100")

  function toggleCommune(id: number) {
    setCommunes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Tarification & Zones</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Configurez les prix, les frais et les zones de service actives.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Colonne gauche : config tarifaire ── */}
        <div className="flex flex-col gap-6">
          {/* Prix par véhicule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Prix de base par type de véhicule
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {vehicules.map((v) => (
                <div key={v.key} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <v.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Label className="w-40 shrink-0 text-sm">{v.label}</Label>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="number"
                      value={prixVehicules[v.key]}
                      onChange={(e) =>
                        setPrixVehicules((prev) => ({ ...prev, [v.key]: e.target.value }))
                      }
                      className="text-right"
                    />
                    <span className="shrink-0 text-sm text-muted-foreground">FCFA</span>
                  </div>
                </div>
              ))}
              <Button className="mt-2 self-end" size="sm">
                <Save className="mr-2 h-3.5 w-3.5" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          {/* Multiplicateurs d'urgence */}
          <Card>
            <CardHeader>
              <CardTitle>Multiplicateurs d&apos;urgence</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="text-sm text-muted-foreground">
                Appliqués au prix de base selon le niveau d&apos;urgence choisi par le client.
              </p>
              {urgenceMultiplicateurs.map((u) => (
                <div key={u.key} className="flex items-center gap-4">
                  <Label className="w-40 shrink-0 text-sm">{u.label}</Label>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={multiplicateurs[u.key]}
                      onChange={(e) =>
                        setMultiplicateurs((prev) => ({ ...prev, [u.key]: e.target.value }))
                      }
                      className="w-24 text-right"
                    />
                    <span className="shrink-0 text-sm text-muted-foreground">×</span>
                  </div>
                </div>
              ))}
              <Button className="mt-2 self-end" size="sm">
                <Save className="mr-2 h-3.5 w-3.5" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          {/* Facteur distance */}
          <Card>
            <CardHeader>
              <CardTitle>Facteur de distance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Coût additionnel par kilomètre supplémentaire (FCFA/km).
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={facteurDistance}
                  onChange={(e) => setFacteurDistance(e.target.value)}
                  className="w-36 text-right"
                />
                <span className="text-sm text-muted-foreground">FCFA / km</span>
              </div>
              <Button className="self-end" size="sm">
                <Save className="mr-2 h-3.5 w-3.5" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          {/* Franchise relais */}
          <Card>
            <CardHeader>
              <CardTitle>Délai de franchise relais</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Nombre de jours de stockage gratuit avant facturation.
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={delaiRelais}
                  onChange={(e) => setDelaiRelais(e.target.value)}
                  className="w-24 text-right"
                />
                <span className="text-sm text-muted-foreground">jours gratuits</span>
              </div>
              <Button className="self-end" size="sm">
                <Save className="mr-2 h-3.5 w-3.5" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          {/* Frais stockage */}
          <Card>
            <CardHeader>
              <CardTitle>Frais de stockage journalier</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Montant facturé par jour après la franchise relais.
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={fraisStockage}
                  onChange={(e) => setFraisStockage(e.target.value)}
                  className="w-28 text-right"
                />
                <span className="text-sm text-muted-foreground">FCFA / jour</span>
              </div>
              <Button className="self-end" size="sm">
                <Save className="mr-2 h-3.5 w-3.5" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Colonne droite : communes ── */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Zones de service — Communes actives</CardTitle>
              <Button size="sm">
                <Save className="mr-2 h-3.5 w-3.5" />
                Enregistrer
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commune</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center">Activer / Désactiver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nom}</TableCell>
                      <TableCell className="text-center">
                        {c.active ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={c.active}
                          onCheckedChange={() => toggleCommune(c.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
