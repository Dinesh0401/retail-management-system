export type ProductCategory =
  | 'electronics'
  | 'clothing'
  | 'grocery'
  | 'household'
  | 'other'

export interface Product {
  readonly id: string
  name: string
  sku: string
  category: ProductCategory
  price: number
  unit: string
  description?: string
  readonly createdAt: string
}