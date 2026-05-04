"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Package, Truck, User, Phone, Mail, MapPin, ArrowRight, ShoppingCart } from "lucide-react"
import { type Order } from "@/data/orders"
import Image from "next/image"

interface OrderManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onStatusChange: (orderNumber: string, newStatus: Order["status"]) => void
}

export function OrderManagementDialog({
  open,
  onOpenChange,
  order,
  onStatusChange,
}: OrderManagementDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(1)

  React.useEffect(() => {
    if (order) {
      // Définir l'étape initiale selon le statut
      if (order.status === "pending") {
        setCurrentStep(1) // Commencer par le résumé
      } else if (order.status === "processing") {
        setCurrentStep(3) // Aller directement à l'expédition
      } else if (order.status === "shipped") {
        setCurrentStep(4) // Aller directement à la livraison
      } else {
        setCurrentStep(1) // Pour delivered ou cancelled, afficher le résumé
      }
    }
  }, [order, open])

  if (!order) return null

  const statusConfig = {
    pending: { label: "En attente", color: "bg-orange-600/10 text-orange-600" },
    processing: { label: "En traitement", color: "bg-yellow-600/10 text-yellow-600" },
    shipped: { label: "Expédiée", color: "bg-blue-600/10 text-blue-600" },
    delivered: { label: "Livrée", color: "bg-green-600/10 text-green-600" },
    cancelled: { label: "Annulée", color: "bg-red-600/10 text-red-600" },
  }

  const handleStartProcessing = () => {
    onStatusChange(order.orderNumber, "processing")
    setCurrentStep(2)
  }

  const handleMarkAsShipped = () => {
    onStatusChange(order.orderNumber, "shipped")
    setCurrentStep(4)
  }

  const handleMarkAsDelivered = () => {
    onStatusChange(order.orderNumber, "delivered")
    onOpenChange(false)
  }

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Résumé", icon: ShoppingCart },
      { number: 2, label: "Client", icon: User },
      { number: 3, label: "Traitement", icon: Package },
      { number: 4, label: "Expédition", icon: Truck },
      { number: 5, label: "Livraison", icon: CheckCircle2 },
    ]

    return (
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`rounded-full size-10 flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <StepIcon className="size-5" />
                </div>
                <span className={`text-xs ${isActive ? "font-semibold" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    isCompleted ? "bg-green-600" : "bg-muted"
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Résumé de la commande
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Détails de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative size-20 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                    <Image
                      src={order.productDetails.image}
                      alt={order.productDetails.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{order.productDetails.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.productDetails.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">
                        <span className="text-muted-foreground">Qté:</span> {order.qty}
                      </span>
                      <span className="text-sm">
                        <span className="text-muted-foreground">Prix:</span> {order.productDetails.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">{order.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paiement</span>
                  <span className="text-sm font-medium">{order.paymentMethod}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              {order.status === "pending" && (
                <Button onClick={() => setCurrentStep(2)}>
                  Suivant
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              )}
            </div>
          </div>
        )

      case 2: // Informations client
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="size-5" />
                  Informations du client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                    <p className="text-sm mt-1">{order.customerDetails.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                    <p className="text-sm mt-1">{order.customerDetails.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm mt-1">{order.customerDetails.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Adresse de livraison</label>
                    <p className="text-sm mt-1">
                      {order.deliveryAddress.street}<br />
                      {order.deliveryAddress.region}, {order.deliveryAddress.city}
                      {order.deliveryAddress.postalCode && <><br />{order.deliveryAddress.postalCode}</>}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Retour
              </Button>
              <Button onClick={handleStartProcessing}>
                Commencer le traitement
                <Package className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )

      case 3: // Traitement en cours
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="size-5 text-yellow-600" />
                  Commande en traitement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    La commande est actuellement en cours de traitement. Préparez le colis et vérifiez tous les articles avant l&apos;expédition.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Checklist avant expédition:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 mt-0.5 text-green-600" />
                      Vérifier la disponibilité du produit
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 mt-0.5 text-green-600" />
                      Emballer soigneusement le colis
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 mt-0.5 text-green-600" />
                      Joindre le bon de livraison
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 mt-0.5 text-green-600" />
                      Vérifier l&apos;adresse de livraison
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fermer
                </Button>
                <Button onClick={handleMarkAsShipped}>
                  Marquer comme expédiée
                  <Truck className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        )

      case 4: // Expédition
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="size-5 text-blue-600" />
                  Commande expédiée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Le colis est en cours de livraison. Assurez-vous que le livreur a toutes les informations nécessaires.
                  </p>
                </div>

                {order.deliveryPerson && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <User className="size-4" />
                      Livreur assigné
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Nom</span>
                        <span className="font-medium">{order.deliveryPerson.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Téléphone</span>
                        <span className="font-medium">{order.deliveryPerson.phone}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Adresse de livraison</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.region}, {order.deliveryAddress.city}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fermer
                </Button>
                <Button onClick={handleMarkAsDelivered} className="bg-green-600 hover:bg-green-700">
                  Marquer comme livrée
                  <CheckCircle2 className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Gestion de la commande {order.orderNumber}</span>
            <Badge variant="outline" className={`${statusConfig[order.status].color} border-none`}>
              {statusConfig[order.status].label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Suivez et gérez l&apos;état de votre commande étape par étape
          </DialogDescription>
        </DialogHeader>

        {renderStepIndicator()}
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  )
}
