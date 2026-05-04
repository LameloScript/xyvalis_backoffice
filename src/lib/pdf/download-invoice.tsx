import { pdf } from '@react-pdf/renderer';
import { InvoiceTemplate } from '@/components/invoices/invoice-template';
import { Order } from '@/data/orders';
import React from 'react';

export async function downloadInvoice(order: Order) {
  // Générer le blob PDF
  const blob = await pdf(<InvoiceTemplate order={order} />).toBlob();
  
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `facture-${order.orderNumber}.pdf`;
  
  // Déclencher le téléchargement
  document.body.appendChild(link);
  link.click();
  
  // Nettoyer
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
