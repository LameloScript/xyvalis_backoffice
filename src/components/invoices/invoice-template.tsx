import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Order } from '@/data/orders';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  shopInfo: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
  },
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export const InvoiceTemplate = ({ order }: { order: Order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* EN-TÊTE */}
      <View style={styles.header}>
        <View>
          {/* Using a placeholder image or removing if not available */}
          {/* <Image src="/assets/logo-brand/logo.png" style={styles.logo} /> */}
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Ma Boutique</Text>
          <Text>RCCM: CI-ABJ-2024-12345</Text>
          <Text>Cocody, Abidjan</Text>
          <Text>Tel: +225 07 00 00 00 00</Text>
        </View>
        
        <View style={styles.shopInfo}>
          <Text style={styles.title}>FACTURE</Text>
          <Text>N° {order.invoiceNumber}</Text>
          <Text>Date: {new Date().toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>

      {/* INFORMATIONS CLIENT */}
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Facturé à:</Text>
        <Text>{order.customerDetails.name}</Text>
        <Text>{order.customerDetails.phone}</Text>
        <Text>{order.customerDetails.email}</Text>
        <Text>{order.deliveryAddress.street}, {order.deliveryAddress.city}</Text>
      </View>

      {/* TABLEAU DES PRODUITS */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={{ width: '50%' }}>Désignation</Text>
          <Text style={{ width: '15%', textAlign: 'center' }}>Qté</Text>
          <Text style={{ width: '20%', textAlign: 'right' }}>Prix Unit.</Text>
          <Text style={{ width: '15%', textAlign: 'right' }}>Total</Text>
        </View>
        
        {order.products && order.products.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={{ width: '50%' }}>{product.name}</Text>
            <Text style={{ width: '15%', textAlign: 'center' }}>{product.quantity}</Text>
            <Text style={{ width: '20%', textAlign: 'right' }}>{product.price.toLocaleString('fr-FR')} FCFA</Text>
            <Text style={{ width: '15%', textAlign: 'right' }}>
              {(product.price * product.quantity).toLocaleString('fr-FR')} FCFA
            </Text>
          </View>
        ))}
      </View>

      {/* TOTAUX */}
      <View style={styles.totalSection}>
        <Text>Sous-total HT: {order.subtotal?.toLocaleString('fr-FR')} FCFA</Text>
        <Text>TVA 18%: {order.tax?.toLocaleString('fr-FR')} FCFA</Text>
        <Text>Frais de livraison: {order.shipping?.toLocaleString('fr-FR')} FCFA</Text>
        <Text style={styles.total}>TOTAL TTC: {order.total?.toLocaleString('fr-FR')} FCFA</Text>
      </View>

      {/* PIED DE PAGE */}
      <View style={{ marginTop: 40, borderTopWidth: 1, paddingTop: 10 }}>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#666' }}>
          Facture acquittée - Payée par {order.paymentMethod}
        </Text>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#666', marginTop: 5 }}>
          Merci pour votre confiance !
        </Text>
      </View>
    </Page>
  </Document>
);
