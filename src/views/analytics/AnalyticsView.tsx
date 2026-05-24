"use client"

import * as React from "react"
import { EllipsisVertical, UserPlus } from "lucide-react"
import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WeeklySalesChart } from "@/components/charts/weekly-sales-chart"

import analyticsMockData from "@/data/mock/analytics.json"

const topPrestataires = analyticsMockData.topPrestataires

const validationsEnAttente = analyticsMockData.validationsEnAttente

const prestationsParCommune = analyticsMockData.prestationsParCommune

export default function AnalyticsView() {
  const metrics = {
    reventue: "312 500 FCFA",
    orders: 87,
    avgOrder: "3 591 FCFA",
    tauxPrestation: "94.2%",
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Statistiques</div>
        <div className="mt-1 text-sm text-muted-foreground">Vue d&apos;ensemble des performances</div>
      </div>

      {/* KPI Cards */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Revenus du jour</CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums text-white">
              312 500
              <span className="text-sm font-normal text-white/60 ml-1">FCFA</span>
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+18%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">Frais de prestation collectés</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Prestations du jour</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{metrics.orders}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-sky-500 text-white">
                <IconTrendingUp className="text-white" />+12.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">74 réalisées · 8 en cours</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Frais moyen</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{metrics.avgOrder}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-white/20 text-white">Stable</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">Par prestation</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Taux de réponse</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">{metrics.tauxPrestation}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-violet-500 text-white">+0.4 pt</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">Réalisées / total</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Prestataires actifs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">143</CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <IconTrendingUp className="text-white" />+7
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">98 actifs en ligne</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Nouveaux inscrits</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">23</CardTitle>
            <CardAction>
              <UserPlus className="h-4 w-4 text-white/70" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">19 clients · 4 prestataires</div>
          </CardFooter>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Prestations hebdomadaires</CardTitle>
          <CardDescription>Tendance sur 7 jours</CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklySalesChart />
        </CardContent>
      </Card>

      {/* Top prestataires + Validations + Prestations par commune */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4">
        {/* Top prestataires */}
        <Card className="gap-3 w-full">
          <CardHeader className="flex justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold">Top prestataires</div>
              <div className="text-muted-foreground text-sm">Ce mois-ci</div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full">
              <EllipsisVertical className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-3">
            {topPrestataires.map((l) => (
              <div key={l.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {l.avatar}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">{l.name}</span>
                    <span className="text-muted-foreground text-xs">{l.commune}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-medium">{l.prestations} prestations</span>
                  <span className="text-muted-foreground text-xs">★ {l.note}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Validations en attente */}
        <Card className="gap-3 w-full">
          <CardHeader className="flex justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold">Validations en attente</div>
              <div className="text-muted-foreground text-sm">
                {validationsEnAttente.length} demandes à traiter
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full">
              <EllipsisVertical className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-3">
            {validationsEnAttente.map((v, i) => (
              <div key={i} className="flex flex-col gap-1 pb-3 border-b last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{v.nom}</span>
                  <Badge
                    variant="outline"
                    className={v.type === "Prestataire"
                      ? "text-blue-600 border-blue-200 text-xs"
                      : "text-amber-600 border-amber-200 text-xs"
                    }
                  >
                    {v.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">{v.commune}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(v.date))}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prestations par commune */}
        <Card className="gap-3 w-full">
          <CardHeader className="flex justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold">Prestations par commune</div>
              <div className="text-muted-foreground text-sm">Aujourd&apos;hui</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {prestationsParCommune.map((c) => {
              const max = prestationsParCommune[0].total
              const pct = (c.total / max) * 100
              return (
                <div key={c.commune} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.commune}</span>
                    <span className="text-muted-foreground tabular-nums">
                      <span className="text-blue-600 font-medium">{c.actives}</span>
                      <span className="mx-1">·</span>
                      <span className="text-green-600">{c.terminees}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> En cours
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Terminées
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
