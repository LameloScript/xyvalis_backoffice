"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Trophy, Clock, XCircle, Package, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react"

export function SellerPerformance() {
  const performance = {
    globalScore: 92,
    deliveryRate: 98,
    cancellationRate: 1.2,
    processingTime: "12h",
    responseTime: "2h",
    satisfactionRate: 4.8,
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-600"
    if (score >= 70) return "bg-blue-600"
    if (score >= 50) return "bg-yellow-600"
    return "bg-red-600"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Score Vendeur Global</CardTitle>
              <CardDescription>Calculé sur les 30 derniers jours</CardDescription>
            </div>
            <Trophy className={`h-8 w-8 ${getScoreColor(performance.globalScore)}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <span className={`text-4xl font-bold ${getScoreColor(performance.globalScore)}`}>
                {performance.globalScore}/100
              </span>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+2.5 pts</span>
              </div>
            </div>
            <Progress value={performance.globalScore} className="h-2" indicatorClassName={getProgressColor(performance.globalScore)} />
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Conseil :</span> Réduisez votre temps de réponse aux messages pour atteindre le niveau Excellence.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métriques Détaillées</CardTitle>
          <CardDescription>Indicateurs clés de performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/20">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Livraison à temps</span>
                  <span className="text-xs text-muted-foreground">Objectif: {">"}95%</span>
                </div>
              </div>
              <span className="font-bold">{performance.deliveryRate}%</span>
            </div>
            <Progress value={performance.deliveryRate} className="h-1.5" indicatorClassName="bg-green-600" />
            
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/20">
                  <XCircle className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Taux d'annulation</span>
                  <span className="text-xs text-muted-foreground">Objectif: {"<"}2%</span>
                </div>
              </div>
              <span className="font-bold">{performance.cancellationRate}%</span>
            </div>
            <Progress value={performance.cancellationRate * 20} className="h-1.5" indicatorClassName="bg-red-600" />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Traitement</span>
                </div>
                <span className="text-xl font-bold">{performance.processingTime}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Réponse</span>
                </div>
                <span className="text-xl font-bold">{performance.responseTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Satisfaction Client</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold">{performance.satisfactionRate}</span>
                <span className="text-muted-foreground">/ 5.0</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
