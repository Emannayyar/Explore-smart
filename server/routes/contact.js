import { Router } from 'express'
import { db, saveDb } from '../store.js'
import { rateLimit, newId } from '../auth.js'

const router = Router()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (v) => (typeof v === 'string' ? v.trim() : '')

router.post('/', rateLimit(5, 10 * 60 * 1000), async (req, res) => {
  const name = str(req.body?.name)
  const email = str(req.body?.email)
  const subject = str(req.body?.subject)
  const message = str(req.body?.message)
  if (!name || name.length > 80) return res.status(400).json({ error: 'Name must be 1-80 characters' })
  if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address' })
  if (!subject || subject.length > 150) return res.status(400).json({ error: 'Subject must be 1-150 characters' })
  if (!message || message.length > 2000) return res.status(400).json({ error: 'Message must be 1-2000 characters' })
  db.messages.push({ id: newId(), name, email, subject, message, createdAt: new Date().toISOString() })
  await saveDb()
  res.status(201).json({ ok: true })
})

export default router
