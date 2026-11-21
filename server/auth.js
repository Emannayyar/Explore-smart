import { randomBytes, randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { db, saveDb } from './store.js'

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export const hashPassword = (pw) => bcrypt.hash(pw, 10)
export const checkPassword = (pw, hash) => bcrypt.compare(pw, hash)
export const newId = () => randomUUID()

export const DEFAULT_PREFS = {
  emailNotifications: true,
  tripReminders: true,
  weatherAlerts: false,
  profilePublic: false,
  shareActivity: false,
  dataCollection: true,
}

export function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    location: u.location || '',
    about: u.about || '',
    preferences: { ...DEFAULT_PREFS, ...u.preferences },
    createdAt: u.createdAt,
  }
}

const MAX_NOTIFICATIONS = 50

// Adds a notification for a user (newest kept, 50 max). Caller is responsible for saveDb().
export function notify(userId, title, body) {
  db.notifications.push({
    id: newId(), userId, title, body, read: false, createdAt: new Date().toISOString(),
  })
  const mine = db.notifications.filter((n) => n.userId === userId)
  if (mine.length > MAX_NOTIFICATIONS) {
    const drop = new Set(mine.slice(0, mine.length - MAX_NOTIFICATIONS))
    db.notifications = db.notifications.filter((n) => !drop.has(n))
  }
}

export async function createSession(userId) {
  const token = randomBytes(32).toString('hex')
  db.sessions.push({ token, userId, expiresAt: Date.now() + THIRTY_DAYS })
  await saveDb()
  return token
}

// Middleware: requires a valid Bearer token, sets req.user and req.token.
export function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/.exec(req.get('authorization') || '')
  const session = m && db.sessions.find((s) => s.token === m[1])
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Please sign in' })
  }
  const user = db.users.find((u) => u.id === session.userId)
  if (!user) return res.status(401).json({ error: 'Please sign in' })
  req.user = user
  req.token = session.token
  next()
}

// Very small in-memory rate limiter: `max` hits per `windowMs` per IP.
export function rateLimit(max, windowMs) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const ip = req.ip || 'unknown'
    const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs)
    if (recent.length >= max) {
      return res.status(429).json({ error: 'Too many attempts, please try again later' })
    }
    recent.push(now)
    hits.set(ip, recent)
    next()
  }
}
