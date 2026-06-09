import { Router, Request, Response } from "express";
import { callOdoo } from "../services/odoo";

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {

        const products = await callOdoo(
            'product.template',
            'search_read',
            [[]],
            {
                fields: ['name', 'list_price', 'type', 'qty_available'],
                limit: 100
            }
        )

        res.json({
            success: true,
            data: products
        })


    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Failed to fetch products from Odoo',
    })
    }
})

export default router