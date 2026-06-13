import { Router } from "express";
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import axios from 'axios'

const router = Router()

const ODOO_URL = process.env.ODOO_URL
const ODOO_DB = process.env.ODOO_DB 
const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRES_IN = '8h'

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
// Accepts email + password from the frontend
// Verifies credentials against Odoo
// Returns a signed JWT token if successful
// ---------------------------------------------------------------------------
router.post('/login', async(req: Request, res:Response) => {
    const { email, password } = req.body

    if (!email || !password){
        res.status(400).json({
            success: false,
            message: 'Email and Password are Required'
        })

        return
    }

    try {
        // Step 1 — Authenticate against Odoo
        // We use Odoo as our user database — if Odoo accepts the credentials,
        // we trust them and issue our own JWT
        const odooResponse = await axios.post(
            `${ODOO_URL}/web/session/authenticate`,
            {
                jsonrpc:'2.0',
                method:'call',
                params:{
                    db: ODOO_DB,
                    login: email,
                    password: password
                }
            },
            {headers : {"Content-Type": "application/json"}}
        )

        const result = odooResponse.data.result

        // Step 2 — Check if Odoo accepted the credentials
        // Odoo returns uid: false if login failed
        if (!result || !result.uid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
            return
        }

        // Step 3 — Issue our own JWT token
        // We store the user's email, uid, and name in the token payload
        const token = jwt.sign(
            {
                uid: result.uid,
                email: email,
                name: result.name
            },
            JWT_SECRET,
            {expiresIn : JWT_EXPIRES_IN}
        )

        // Step 4 — Return the token to the frontend
        res.json({
            success: true,
            token,
            user: {
                uid: result.uid,
                name: result.name,
                email: email
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        })
    }
})

export default router
