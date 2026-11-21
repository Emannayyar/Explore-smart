import { Router } from 'express'
import { db, saveDb } from '../store.js'
import { requireAuth, newId, notify } from '../auth.js'
import { trips } from '../../src/data/trips.js'
import { calculateEcoScore } from '../../src/utils/ecoScore.js'

export const catalogue = Router()
export const saved = Router()
export const stats = Router()

const DESTINATIONS = ['Hunza Valley', 'Skardu', 'Naran Kaghan', 'Swat Valley', 'Murree', 'Fairy Meadows', 'Neelum Valley']
const ACCOMMODATION = ['Hotel', 'Camping', 'Guest House']
const TRANSPORT = ['Bus', 'Coaster']
const MAX_SAVED = 100

catalogue.get('/', (req, res) => res.json({ trips }))

const mine = (req) => db.savedTrips.filter((t) => t.userId === req.user.id)
const inRange = (n, min, max) => Number.isInteger(n) && n >= min && n <= max

saved.use(requireAuth)

saved.get('/', (req, res) => {
  const list = mine(req).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  res.json({ savedTrips: list })
})

saved.post('/', async (req, res) => {
  const b = req.body || {}
  const existing = mine(req)
  let record

  if (b.kind === 'trip') {
    const trip = trips.find((t) => t.id === Number(b.tripId))
    if (!trip) return res.status(404).json({ error: 'Trip not found' })
    const dup = existing.find((t) => t.kind === 'trip' && t.tripId === trip.id)
    if (dup) return res.json({ savedTrip: dup })
    record = {
      kind: 'trip', tripId: trip.id, title: trip.title, destination: trip.destination,
      travelers: trip.groupSize, duration: trip.duration, accommodation: trip.accommodation,
      transport: trip.transport, price: trip.price,
      eco: calculateEcoScore({
        destination: trip.destination, activities: trip.activities, groupSize: trip.groupSize,
        transport: trip.transport, accommodation: trip.accommodation,
      }),
    }
  } else if (b.kind === 'plan') {
    const travelers = Number(b.travelers)
    const duration = Number(b.duration)
    const hasBudget = b.budget !== undefined && b.budget !== null && b.budget !== ''
    const budget = hasBudget ? Number(b.budget) : null
    if (!DESTINATIONS.includes(b.destination)) return res.status(400).json({ error: 'Unknown destination' })
    if (!ACCOMMODATION.includes(b.accommodation)) return res.status(400).json({ error: 'Invalid accommodation' })
    if (!TRANSPORT.includes(b.transport)) return res.status(400).json({ error: 'Invalid transport' })
    if (!inRange(travelers, 1, 100)) return res.status(400).json({ error: 'Travelers must be 1-100' })
    if (!inRange(duration, 1, 60)) return res.status(400).json({ error: 'Duration must be 1-60 days' })
    if (hasBudget && !(Number.isFinite(budget) && budget >= 0)) return res.status(400).json({ error: 'Budget must be a number 0 or more' })
    record = {
      kind: 'plan', title: `${b.destination} plan`, destination: b.destination, budget,
      travelers, duration, accommodation: b.accommodation, transport: b.transport,
      eco: calculateEcoScore({
        destination: b.destination, activities: [], groupSize: travelers,
        transport: b.transport, accommodation: b.accommodation,
      }),
    }
  } else {
    return res.status(400).json({ error: 'kind must be "plan" or "trip"' })
  }

  if (existing.length >= MAX_SAVED) return res.status(400).json({ error: `You can save up to ${MAX_SAVED} trips` })
  record = { id: newId(), userId: req.user.id, createdAt: new Date().toISOString(), ...record }
  db.savedTrips.push(record)
  notify(req.user.id, 'Trip saved', `${record.title} was added to your dashboard.`)
  await saveDb()
  res.status(201).json({ savedTrip: record })
})

saved.delete('/:id', async (req, res) => {
  const found = mine(req).find((t) => t.id === req.params.id)
  if (!found) return res.status(404).json({ error: 'Saved trip not found' })
  db.savedTrips = db.savedTrips.filter((t) => t !== found)
  await saveDb()
  res.status(204).end()
})

stats.get('/', requireAuth, (req, res) => {
  const list = mine(req)
  const scores = list.map((t) => t.eco.total)
  res.json({
    savedTrips: list.length,
    ecoFriendlyTrips: scores.filter((s) => s >= 60).length,
    averageEcoScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
  })
})
