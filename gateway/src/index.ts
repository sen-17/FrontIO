import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express from 'express'
import cors from 'cors'
import productsRouter from './routes/product'

const app = express()
const PORT = process.env.PORT || 3000

// MiddleWare
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // only allow request from the react frontend
    credentials: true, //allow cookies to be sent with requests
}))

// Routes
app.use('/api/products', productsRouter)

// Health Check Route
app.get('/health', (req, res) => {
    res.json({
        status:'ok',
        service: 'FrontIO Gateway',
        timestamp: new Date().toISOString()
    })
})

// Start Server
app.listen(PORT, () => {
    console.log(`Gateway Running on http://localhost:${PORT}`)
})

