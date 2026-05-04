export type CatalogProduct = {
  id: string
  name: string
  category: string
}

export const categories: string[] = [
  "Smartphones",
  "Ordinateurs",
  "Tablettes",
  "Audio",
  "Montres connectées",
  "Gaming",
  "Photo & Vidéo",
  "Accessoires",
]

export const catalogProducts: CatalogProduct[] = [
  { id: "PRD-001", name: "iPhone 15 Pro Max 256Go", category: "Smartphones" },
  { id: "PRD-002", name: "Samsung Galaxy S24 Ultra", category: "Smartphones" },
  { id: "PRD-003", name: "MacBook Air M3 - 13 pouces", category: "Ordinateurs" },
  { id: "PRD-004", name: "Sony WH-1000XM5 - Casque Bluetooth", category: "Audio" },
  { id: "PRD-005", name: "iPad Pro 12.9 pouces Wi-Fi", category: "Tablettes" },
  { id: "PRD-006", name: "AirPods Pro 2ème génération", category: "Audio" },
  { id: "PRD-007", name: "Apple Watch Series 9", category: "Montres connectées" },
  { id: "PRD-008", name: "Console PlayStation 5 Digital", category: "Gaming" },
  { id: "PRD-009", name: "Dell XPS 15 - Core i7", category: "Ordinateurs" },
  { id: "PRD-010", name: "Canon EOS R6 Mark II", category: "Photo & Vidéo" },
]

