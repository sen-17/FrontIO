import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// Shape of the user object we get back from the gateway
interface User {
  uid: number
  name: string
  email: string
}

// Shape of the auth context value
interface AuthContextType {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null> (null)

// Provider — wraps the whole app, holds the auth state
export function AuthProvider({children} : {children: ReactNode}) {
    const [token, setToken] = useState <string | null> (
        localStorage.getItem('frontio_token') // persist login across page refresh
    )

    const [user, setuser] = useState<User | null>(() => {
        const saved = localStorage.getItem('frontio_user')
        return saved ? JSON.parse(saved) : null
    })

    function login(newToken: string, newUser: User){
        setToken(newToken)
        setuser(newUser)
        localStorage.setItem('frontio_token', newToken)
        localStorage.setItem('frontio_user', JSON.stringify(newUser))
    }

    function logout(){
        setToken(null)
        setuser(null)
        localStorage.removeItem('frontio_token')
        localStorage.removeItem('frontio_user')
    }

    return (
        <AuthContext.Provider value={{
            token,
            user,
            login,
            logout,
            isAuthenticated: !!token // true if token exists, false if null
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside Auth Provider')
    }

    return context
}