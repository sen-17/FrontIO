import { Router } from "express";
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { google } from 'googleapis'

const router = Router()

const ODOO_URL = process.env.ODOO_URL
const ODOO_DB = process.env.ODOO_DB 
const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRES_IN = '8h'
const FRONTEND_URL = process.env.FRONTEND_URL

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

// Google OAuth client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Scopes — what info we request from Google
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
]


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

// ---------------------------------------------------------------------------
// GET /api/auth/google
// ---------------------------------------------------------------------------
// Step 1 of Google OAuth — redirect user to Google's login page
// ---------------------------------------------------------------------------
router.get('/google', (req: Request, res: Response) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  res.redirect(authUrl)
})

// ---------------------------------------------------------------------------
// GET /api/auth/google/callback
// ---------------------------------------------------------------------------
// Step 2 of Google OAuth — Google redirects back here with a code
// We exchange the code for user info and issue a FrontIO JWT
// ---------------------------------------------------------------------------
router.get('/google/callback', async (req: Request, res: Response) => {
    const code = req.query

    if (!code){
        res.redirect(`${FRONTEND_URL}/login?error=no_code`)
        return
    }

    try {
        // Step 1 — Exchange code for tokens
        const {tokens} = await oauth2Client.getToken(code as unknown as string)
        oauth2Client.setCredentials(tokens)

        // Step 2 — Get user info from Google
        const oauth2 = google.oauth2({version: 'v2', auth:oauth2Client})
        const { data } = await oauth2.userinfo.get()

        if (!data.email || !data.name){
            res.redirect(`${FRONTEND_URL}/login?error=no_user_info`)
            return
        }

        // Step 3 — Issue FrontIO JWT
        // Google users don't have an Odoo uid so we use 0 as a placeholder
        const token = jwt.sign(
            {
                uid : 0,
                email: data.email,
                name: data.name
            },
            JWT_SECRET,
            {expiresIn : JWT_EXPIRES_IN}
        )

        // Step 4 — Redirect to frontend with token in URL
        // Frontend will extract the token and store it
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`)

    } catch (error) {
        res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`)
    }
})

export default router
