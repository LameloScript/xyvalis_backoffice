"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, AlertCircle } from 'lucide-react';
import { BulkCodeData } from '@/lib/promo-code-generator';

interface BulkCodeGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: BulkCodeData) => void;
}

export function BulkCodeGeneratorDialog({ 
  open, 
  onOpenChange, 
  onGenerate 
}: BulkCodeGeneratorDialogProps) {
  const [campaignName, setCampaignName] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [prefix, setPrefix] = useState('');
  const [codeLength, setCodeLength] = useState('8');
  const [format, setFormat] = useState<'alphanumeric' | 'numeric'>('alphanumeric');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [minCart, setMinCart] = useState('0');
  const [usageLimit, setUsageLimit] = useState<'single' | 'unlimited' | 'custom'>('single');
  const [customLimit, setCustomLimit] = useState('');

  const estimatedTotal = () => {
    const qty = parseInt(quantity) || 0;
    const value = parseInt(discountValue) || 0;
    return qty * value;
  };

  const handleGenerate = () => {
    const data: BulkCodeData = {
      campaignName,
      discountType,
      discountValue: parseInt(discountValue),
      quantity: parseInt(quantity),
      prefix,
      codeLength: parseInt(codeLength),
      format,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      minCart: parseInt(minCart),
      usageLimit: usageLimit === 'custom' ? parseInt(customLimit) : usageLimit,
    };
    
    onGenerate(data);
    onOpenChange(false);
  };

  const isValid = campaignName && discountValue && quantity && startDate && endDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Générer des codes promotionnels en masse
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nom de la campagne */}
          <div className="space-y-2">
            <Label htmlFor="campaignName">Nom de la campagne *</Label>
            <Input
              id="campaignName"
              placeholder="Ex: Black Friday 2026"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>

          {/* Type de réduction */}
          <div className="space-y-2">
            <Label>Type de réduction *</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="discountType" 
                  checked={discountType === 'percentage'} 
                  onChange={() => setDiscountType('percentage')}
                  className="accent-primary"
                />
                <span>Pourcentage</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="discountType" 
                  checked={discountType === 'fixed'} 
                  onChange={() => setDiscountType('fixed')}
                  className="accent-primary"
                />
                <span>Montant fixe</span>
              </label>
            </div>
          </div>

          {/* Valeur */}
          <div className="space-y-2">
            <Label htmlFor="value">Valeur *</Label>
            <div className="flex gap-2">
              <Input
                id="value"
                type="number"
                placeholder="Ex: 10"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
              <span className="flex items-center px-3 bg-muted rounded-md border text-sm">
                {discountType === 'percentage' ? '%' : 'FCFA'}
              </span>
            </div>
          </div>

          {/* Nombre de codes */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Nombre de codes à générer *</Label>
            <Input
              id="quantity"
              type="number"
              min="10"
              max="10000"
              placeholder="Ex: 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Min: 10, Max: 10 000</p>
          </div>

          {/* Préfixe */}
          <div className="space-y-2">
            <Label htmlFor="prefix">Préfixe des codes (optionnel)</Label>
            <Input
              id="prefix"
              placeholder="Ex: BF2026-"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
            />
          </div>

          {/* Longueur et format */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codeLength">Longueur du code</Label>
              <Select value={codeLength} onValueChange={setCodeLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 caractères</SelectItem>
                  <SelectItem value="8">8 caractères</SelectItem>
                  <SelectItem value="10">10 caractères</SelectItem>
                  <SelectItem value="12">12 caractères</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <div className="flex flex-col gap-2 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="format" 
                    checked={format === 'alphanumeric'} 
                    onChange={() => setFormat('alphanumeric')}
                    className="accent-primary"
                  />
                  <span>Alphanumérique</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="format" 
                    checked={format === 'numeric'} 
                    onChange={() => setFormat('numeric')}
                    className="accent-primary"
                  />
                  <span>Numérique</span>
                </label>
              </div>
            </div>
          </div>

          {/* Période de validité */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début *</Label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label>Date de fin *</Label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          </div>

          {/* Montant minimum du panier */}
          <div className="space-y-2">
            <Label htmlFor="minCart">Montant minimum du panier (FCFA)</Label>
            <Input
              id="minCart"
              type="number"
              placeholder="0"
              value={minCart}
              onChange={(e) => setMinCart(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">0 = pas de minimum</p>
          </div>

          {/* Limite d'utilisation */}
          <div className="space-y-2">
            <Label>Limite d&apos;utilisation par code</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="usageLimit" 
                  checked={usageLimit === 'single'} 
                  onChange={() => setUsageLimit('single')}
                  className="accent-primary"
                />
                <span>Usage unique</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="usageLimit" 
                  checked={usageLimit === 'unlimited'} 
                  onChange={() => setUsageLimit('unlimited')}
                  className="accent-primary"
                />
                <span>Illimité</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="usageLimit" 
                  checked={usageLimit === 'custom'} 
                  onChange={() => setUsageLimit('custom')}
                  className="accent-primary"
                />
                <span>Personnalisé</span>
              </label>
            </div>
            
            {usageLimit === 'custom' && (
              <Input
                type="number"
                placeholder="Nombre d'utilisations"
                value={customLimit}
                onChange={(e) => setCustomLimit(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Estimation */}
          {quantity && discountValue && discountType === 'fixed' && (
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <strong>Total de remise maximale estimée:</strong><br />
                {quantity} codes × {discountValue} FCFA = {estimatedTotal().toLocaleString()} FCFA
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleGenerate} disabled={!isValid}>
            <Sparkles className="mr-2 h-4 w-4" />
            Générer les codes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
