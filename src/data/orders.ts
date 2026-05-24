import ordersMock from "./mock/orders.json"

export type Order = {
  orderNumber: string
  customer: string
  customerDetails: {
    name: string
    phone: string
    email: string
    address: string
  }
  product: string
  productDetails: {
    name: string
    image: string
    price: string
    description?: string
  }
  date: string
  amount: string
  qty: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  RecoAddress: {
    street: string
    city: string
    region: string
    postalCode?: string
  }
  RecoPerson?: {
    name: string
    phone: string
  }
  // New fields for Invoice
  subtotal: number
  tax: number
  shipping: number
  total: number
  invoiceNumber: string
  products: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export const ordersData: Order[] = ordersMock as Order[]

export function getOrderByNumber(orderNumber?: string) {
  if (!orderNumber) return null
  const key = orderNumber.trim()
  if (!key) return null
  return ordersData.find(o => o.orderNumber === key) || null
}

