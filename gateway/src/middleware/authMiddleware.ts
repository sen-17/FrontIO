import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET 

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}


// Extend Express Request type to include our user payload
export interface AuthRequest extends Request {
  user?: {
    uid: number
    email: string
    name: string
  }
}

interface TokenPayload extends jwt.JwtPayload {
  uid: number;
  email: string;
  name: string;
}

// ---------------------------------------------------------------------------
// verifyToken — middleware that protects routes
// ---------------------------------------------------------------------------
// Reads the JWT from the Authorization header
// Verifies the signature and expiry
// Attaches the decoded user to req.user
// Calls next() if valid, returns 401 if not
// ---------------------------------------------------------------------------
export function verifyToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void{
    // Token comes in the Authorization header as: "Bearer <token>"
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({
        success: false,
        message: 'No token provided'
        })
        return
    }

    try {
        // Verify the token signature and expiry
        const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as TokenPayload

        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}
