import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  // Check for error from Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get('error')
    if (errorParam) {
      setError('Google login failed. Please try again.')
    }
  }, [])

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try{
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const json = await response.json()

      if (!json.success){
        throw new Error(json.message || 'Login Failed')
      }

      // Store token and user in AuthContext + localStorage
      login(json.token, json.user)
      navigate('/dashboard')
   
    } catch (err) {
      setError(err instanceof Error ? err.message: 'Login Failed')
    
    } finally {
      setLoading(false)

    }
  }

  function handleGoogleLogin() {
    // Redirect browser to gateway Google OAuth endpoint
    window.location.href = '/api/auth/google'
  }

  return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '24px' }}>
        <h1>FrontIO</h1>
        <h2>Login</h2>

        {error && (
          <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Email</label>
            <br />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label>Password</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '10px', cursor: 'pointer' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{ textAlign: 'center', color: '#666' }}>or</div>

          <button
            onClick={handleGoogleLogin}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Login with Google
          </button> 
        </div>
      </div>
    )

}