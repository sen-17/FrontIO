import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

// MiddleWare
app.use(express.json())

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

