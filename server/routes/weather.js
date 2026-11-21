import { Router } from 'express'
import { getWeather } from '../weather.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    res.json(await getWeather())
  } catch (err) {
    console.error('Weather fetch failed:', err.message)
    res.status(503).json({ error: 'Weather service unavailable' })
  }
})

export default router
