"use client"

import * as React from "react"
import { Percent, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

type Discount = {
  type: "percentage" | "fixed"
  value: number
  startDate?: string
  endDate?: string
}

type ProductDiscountDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  productPrice: string
  currentDiscount?: Discount
  onSave: (discount: Discount | null) => void
}

export function ProductDiscountDialog({
  open,
  onOpenChange,
  productName,
  productPrice,
  currentDiscount,
  onSave,
}: ProductDiscountDialogProps) {
  const [discountType, setDiscountType] = React.useState<"percentage" | "fixed">(
    currentDiscount?.type || "percentage"
  )
  const [discountValue, setDiscountValue] = React.useState(
    currentDiscount?.value?.toString() || ""
  )
  const [startDate, setStartDate] = React.useState(
    currentDiscount?.startDate || ""
  )
  const [endDate, setEndDate] = React.useState(currentDiscount?.endDate || "")

  const handleSave = () => {
    if (!discountValue || parseFloat(discountValue) <= 0) {
      return
    }

    onSave({
      type: discountType,
      value: parseFloat(discountValue),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
    onOpenChange(false)
  }

  const handleRemove = () => {
    onSave(null)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Percent className="size-5" />
            Gérer la promotion
          </AlertDialogTitle>
          <AlertDialogDescription>
            Configurez une réduction pour{" "}
            <span className="font-semibold text-foreground">{productName}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Prix actuel</span>
            <span className="font-semibold">{productPrice}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType">Type de réduction</Label>
            <Select
              value={discountType}
              onValueChange={(value: "percentage" | "fixed") =>
                setDiscountType(value)
              }
            >
              <SelectTrigger id="discountType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                <SelectItem value="fixed">Montant fixe (FCFA)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountValue">
              Valeur de la réduction
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="discountValue"
                type="number"
                placeholder={discountType === "percentage" ? "15" : "50000"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {discountType === "percentage" ? "%" : "FCFA"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {discountValue && parseFloat(discountValue) > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Percent className="size-4" />
                <span className="text-sm font-medium">
                  Aperçu:{" "}
                  {discountType === "percentage"
                    ? `${discountValue}% de réduction`
                    : `${discountValue} FCFA de réduction`}
                </span>
              </div>
              {(startDate || endDate) && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mt-2">
                  <Calendar className="size-4" />
                  <span className="text-xs">
                    {startDate && `Du ${new Date(startDate).toLocaleDateString("fr-FR")}`}
                    {startDate && endDate && " "}
                    {endDate && `au ${new Date(endDate).toLocaleDateString("fr-FR")}`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          {currentDiscount && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              className="sm:mr-auto"
            >
              <X className="size-4 mr-2" />
              Retirer la promotion
            </Button>
          )}
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSave}
            disabled={!discountValue || parseFloat(discountValue) <= 0}
          >
            Enregistrer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
