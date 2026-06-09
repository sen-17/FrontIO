import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const ODOO_URL = process.env.ODOO_URL
const ODOO_DB = process.env.ODOO_DB
const ODOO_USER = process.env.ODOO_USER
const ODOO_PASSWORD = process.env.ODOO_PASSWORD

// Store Session Cookies after Authenticate
let sessionCookie: string | null = null

// ---------------------------------------------------------------------------
// authenticate
// ---------------------------------------------------------------------------
// Logs into Odoo and stores the session cookie for future requests.
// Called automatically before any data request if not already authenticated.
// ---------------------------------------------------------------------------
export async function authenticate(): Promise <void> {
    const response = await axios.post(
        `${ODOO_URL}/web/session/authenticate`,
        {
            jsonrpc:'2.0',
            method: 'call',
            params: {
                db: ODOO_DB,
                login: ODOO_USER,
                password: ODOO_PASSWORD
            }
        },

        {
            headers: { 'Content-Type': 'application/json' }
        }

    )

    // Odoo returns the session cookie in the response headers
    const cookies = response.headers['set-cookie']
    
    if (cookies && cookies.length > 0) {
        sessionCookie = cookies[0].split(';')[0]
        console.log(cookies, 'Cookies')
        console.log(sessionCookie, 'Session Cookie')
        console.log('Odoo Authentication Success')
    } else {
        throw new Error('Odoo authentication failed — no session cookie returned')
    }

}

// ---------------------------------------------------------------------------
// callOdoo
// ---------------------------------------------------------------------------
// Generic function to call any Odoo model method.
// Automatically authenticates if no session cookie exists.
//
// model   — Odoo model name e.g. 'product.template'
// method  — method to call e.g. 'search_read'
// args    — positional arguments
// kwargs  — keyword arguments (fields, limit, domain, etc.)
// ---------------------------------------------------------------------------
export async function callOdoo(
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {}
): Promise<unknown> {
    
    if (!sessionCookie) {
        await authenticate()
    }

    const response = await axios.post(
        `${ODOO_URL}/web/dataset/call_kw/${model}/${method}`,
        
        {
            jsonrpc: '2.0',
            method: 'call',
            params: { model, method, args, kwargs }
        },

        {
        headers: {
            'Content-Type': 'application/json',
            Cookie: sessionCookie!
        }
        }
    )

    // Odoo wraps the actual result inside response.data.result
    // If something went wrong, it returns response.data.error instead
    if (response.data.error) {
        throw new Error(`Odoo error: ${response.data.error.message}`)
    }

    return response.data.result
}
