"use client"

import * as React from "react"
import { CheckCircle2, Clock, Truck, Package, XCircle, CreditCard, RotateCcw, AlertCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type TimelineEvent = {
  id: string
  type: 
    | "created" 
    | "payment_confirmed" 
    | "confirmed" 
    | "processing" 
    | "shipped" 
    | "delivering" 
    | "delivered" 
    | "cancelled" 
    | "return_requested" 
    | "refunded"
  date: string
  actor: "system" | "seller" | "customer" | "courier"
  description?: string
  metadata?: Record<string, any>
}

interface OrderTimelineProps {
  events: TimelineEvent[]
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  // Trier les événements du plus récent au plus ancien pour l'affichage
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getEventConfig = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "created":
        return { icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100", label: "Commande créée" }
      case "payment_confirmed":
        return { icon: CreditCard, color: "text-green-600", bg: "bg-green-100", label: "Paiement confirmé" }
      case "confirmed":
        return { icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-100", label: "Commande confirmée" }
      case "processing":
        return { icon: Package, color: "text-yellow-600", bg: "bg-yellow-100", label: "Préparation en cours" }
      case "shipped":
        return { icon: Truck, color: "text-purple-600", bg: "bg-purple-100", label: "Commande expédiée" }
      case "delivering":
        return { icon: Truck, color: "text-blue-500", bg: "bg-blue-50", label: "En cours de livraison" }
      case "delivered":
        return { icon: CheckCircle2, color: "text-green-700", bg: "bg-green-200", label: "Commande livrée" }
      case "cancelled":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Commande annulée" }
      case "return_requested":
        return { icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-100", label: "Retour demandé" }
      case "refunded":
        return { icon: RotateCcw, color: "text-gray-600", bg: "bg-gray-100", label: "Remboursement effectué" }
      default:
        return { icon: AlertCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Événement inconnu" }
    }
  }

  const getActorLabel = (actor: TimelineEvent["actor"]) => {
    switch (actor) {
      case "system": return "Système"
      case "seller": return "Vendeur"
      case "customer": return "Client"
      case "courier": return "Prestataire"
      default: return actor
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique de la commande</CardTitle>
        <CardDescription>Suivi chronologique des événements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-muted ml-4 space-y-8 pb-4">
          {sortedEvents.map((event, index) => {
            const config = getEventConfig(event.type)
            const Icon = config.icon
            
            return (
              <div key={event.id} className="relative pl-8">
                {/* Point sur la ligne */}
                <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-background ${config.bg}`}>
                  <Icon className={`h-3 w-3 ${config.color}`} />
                </span>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{config.label}</span>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground">
                      {getActorLabel(event.actor)}
                    </Badge>
                  </div>
                  
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.date)}
                  </span>
                  
                  {event.description && (
                    <p className="text-sm text-foreground mt-1 bg-muted/40 p-2 rounded-md">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
