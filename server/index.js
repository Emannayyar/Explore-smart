import express from 'express'
import { loadDb } from './store.js'
import authRoutes from './routes/auth.js'
import meRoutes from './routes/me.js'
import contactRoutes from './routes/contact.js'
import weatherRoutes from './routes/weather.js'
import notificationRoutes from './routes/notifications.js'
import { catalogue, saved, stats } from './routes/trips.js'

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))

const api = express.Router()
api.get('/health', (req, res) => res.json({ ok: true }))
api.use('/auth', authRoutes)
api.use('/me', meRoutes)
api.use('/trips', catalogue)
api.use('/saved-trips', saved)
api.use('/stats', stats)
api.use('/contact', contactRoutes)
api.use('/weather', weatherRoutes)
api.use('/notifications', notificationRoutes)
api.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use('/api', api)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' })
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large' })
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

await loadDb()
const port = process.env.API_PORT || 3001
app.listen(port, () => console.log(`ExploreSmart API listening on http://localhost:${port}`))
