import { PromoCode } from './promo-code-generator';

export function exportToCSV(codes: PromoCode[], campaignName: string) {
  // En-têtes
  const headers = ['Code', 'Type', 'Valeur', 'Début', 'Fin', 'Limite', 'Statut'];
  
  // Lignes de données
  const rows = codes.map(code => [
    code.code,
    code.type === 'percentage' ? 'Pourcentage' : 'Montant fixe',
    code.value,
    code.startDate.toLocaleDateString('fr-FR'),
    code.endDate.toLocaleDateString('fr-FR'),
    code.usageLimit === -1 ? 'Illimité' : code.usageLimit,
    code.status,
  ]);
  
  // Construire le CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  // Télécharger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `codes-promo-${campaignName}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
