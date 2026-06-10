import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/api'
import type { Product } from '../services/api'

export default function Products(){
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProducts()
        .then(data => {
            setProducts(data)
            setLoading(false)
        })
        .catch(err => {
            setError(err.message)
            setLoading(false)
        })
    }, [])

    if (loading) return <p>Loading Products...</p>
    if (error) return <p>Error: {error}</p>
    if (products.length === 0) return <p>No products found. Add some in Odoo first.</p>

    return  (
        <div>
            <h1>Products</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Type</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.list_price}</td>
                            <td>{product.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}