import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallBack(){
    const { login } = useAuth()
    const navigate = useNavigate()
    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true
        
        // Read token and user info from URL query params
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const name = params.get('name')
        const email = params.get('email')
        const error = params.get('error')

        // If Google OAuth failed, redirect to login with error
        if (error) {
            navigate(`/login?error=${error}`)
            return
        }

        // If token exists, store it and redirect to dashboard
        if (token && name && email) {
            login(token, { uid: 0, name, email })
            navigate('/dashboard')
            return
        }

        navigate('/login?error=unknown')
    }, [])

    return <div>Authenticating with Google...</div>
}