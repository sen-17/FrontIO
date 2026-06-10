const GATEWAY_URL = 'http://localhost:3000'

// The shape of a product returned from Odoo via the gateway
export interface Product {
    id: number
    name: string
    list_price: number
    type: string
    qty_available: number
}

// The shape of the gateway's standard response wrapper
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Fetch all products from the gateway
export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${GATEWAY_URL}/api/products`)

    if (!response.ok) {
        throw new Error('Failed to fetch products')
    }

    const json: ApiResponse<Product[]> = await response.json()
    return json.data
}