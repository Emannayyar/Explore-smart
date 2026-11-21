import { Router } from 'express'
import { db, saveDb } from '../store.js'
import {
  hashPassword, checkPassword, createSession, requireAuth, rateLimit, publicUser, newId, notify,
} from '../auth.js'

const router = Router()
const limiter = rateLimit(10, 10 * 60 * 1000)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (v) => (typeof v === 'string' ? v.trim() : '')

router.post('/signup', limiter, async (req, res) => {
  const name = str(req.body?.name)
  const email = str(req.body?.email).toLowerCase()
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (name.length < 1 || name.length > 80) return res.status(400).json({ error: 'Name must be 1-80 characters' })
  if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address' })
  if (password.length < 8 || password.length > 200) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }
  const user = {
    id: newId(), name, email, passwordHash: await hashPassword(password),
    phone: '', location: '', about: '', preferences: {}, createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  notify(user.id, 'Welcome to ExploreSmart', 'Your account is ready. Plan a trip or explore the packages to get started.')
  const token = await createSession(user.id)
  res.status(201).json({ token, user: publicUser(user) })
})

router.post('/signin', limiter, async (req, res) => {
  const email = str(req.body?.email).toLowerCase()
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const user = db.users.find((u) => u.email.toLowerCase() === email)
  // Compare even when the user is missing so timing doesn't reveal which emails exist.
  const hash = user?.passwordHash || '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi'
  const ok = await checkPassword(password, hash)
  if (!user || !ok) return res.status(401).json({ error: 'Invalid email or password' })
  const token = await createSession(user.id)
  res.json({ token, user: publicUser(user) })
})

router.post('/signout', requireAuth, async (req, res) => {
  db.sessions = db.sessions.filter((s) => s.token !== req.token)
  await saveDb()
  res.status(204).end()
})

export default router
