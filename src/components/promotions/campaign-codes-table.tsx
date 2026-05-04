"use client";

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Download, Trash2 } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';
import { PromoCode } from '@/lib/promo-code-generator';

export interface Campaign {
  id: string;
  name: string;
  codesGenerated: number;
  codesUsed: number;
  createdAt: Date;
  codes: PromoCode[];
}

export function CampaignCodesTable({ campaigns }: { campaigns: Campaign[] }) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleDownload = (campaign: Campaign) => {
    exportToCSV(campaign.codes, campaign.name);
  };

  const usageRate = (campaign: Campaign) => {
    if (campaign.codesGenerated === 0) return "0.0";
    return ((campaign.codesUsed / campaign.codesGenerated) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campagne</TableHead>
            <TableHead className="text-center">Codes générés</TableHead>
            <TableHead className="text-center">Codes utilisés</TableHead>
            <TableHead className="text-center">Taux d&apos;utilisation</TableHead>
            <TableHead>Date création</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                Aucune campagne générée pour le moment.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{campaign.codesGenerated}</Badge>
                </TableCell>
                <TableCell className="text-center">{campaign.codesUsed}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={parseFloat(usageRate(campaign)) > 50 ? 'default' : 'outline'}>
                    {usageRate(campaign)}%
                  </Badge>
                </TableCell>
                <TableCell>{campaign.createdAt.toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les codes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(campaign)}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Désactiver
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog pour voir les codes (à implémenter si nécessaire) */}
    </div>
  );
}
