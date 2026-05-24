import catalogMock from "./mock/catalog.json"

export type CatalogProduct = {
  id: string
  name: string
  category: string
}

export const categories: string[] = catalogMock.categories

export const catalogProducts: CatalogProduct[] = catalogMock.catalogProducts as CatalogProduct[]


