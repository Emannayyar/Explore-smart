import { Router } from 'express'
import { db, saveDb } from '../store.js'
import { requireAuth, publicUser, checkPassword, hashPassword, notify, DEFAULT_PREFS } from '../auth.js'

const router = Router()
router.use(requireAuth)

const LIMITS = { name: [1, 80], phone: [0, 30], location: [0, 100], about: [0, 500] }

router.get('/', (req, res) => res.json({ user: publicUser(req.user) }))

router.patch('/', async (req, res) => {
  const body = req.body || {}
  const u = req.user
  for (const [key, [min, max]] of Object.entries(LIMITS)) {
    if (body[key] === undefined) continue
    if (typeof body[key] !== 'string') return res.status(400).json({ error: `${key} must be text` })
    const v = body[key].trim()
    if (v.length < min || v.length > max) {
      return res.status(400).json({ error: `${key} must be ${min}-${max} characters` })
    }
    u[key] = v
  }
  if (body.preferences !== undefined) {
    if (typeof body.preferences !== 'object' || body.preferences === null || Array.isArray(body.preferences)) {
      return res.status(400).json({ error: 'preferences must be an object' })
    }
    const next = { ...DEFAULT_PREFS, ...u.preferences }
    for (const key of Object.keys(DEFAULT_PREFS)) {
      if (body.preferences[key] === undefined) continue
      if (typeof body.preferences[key] !== 'boolean') {
        return res.status(400).json({ error: `${key} must be true or false` })
      }
      next[key] = body.preferences[key]
    }
    u.preferences = next
  }
  await saveDb()
  res.json({ user: publicUser(u) })
})

router.put('/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body || {}
  if (typeof currentPassword !== 'string' || !(await checkPassword(currentPassword, req.user.passwordHash))) {
    return res.status(400).json({ error: 'Current password is incorrect' })
  }
  if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 200) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' })
  }
  req.user.passwordHash = await hashPassword(newPassword)
  db.sessions = db.sessions.filter((s) => s.userId !== req.user.id || s.token === req.token)
  notify(req.user.id, 'Password changed', 'Your password was updated. Other devices have been signed out.')
  await saveDb()
  res.status(204).end()
})

router.get('/export', (req, res) => {
  res.set('Content-Disposition', 'attachment; filename="explore-smart-data.json"')
  res.json({
    exportedAt: new Date().toISOString(),
    profile: publicUser(req.user),
    savedTrips: db.savedTrips.filter((t) => t.userId === req.user.id),
    notifications: db.notifications.filter((n) => n.userId === req.user.id),
  })
})

router.delete('/', async (req, res) => {
  const password = req.body?.password
  if (typeof password !== 'string' || !(await checkPassword(password, req.user.passwordHash))) {
    return res.status(400).json({ error: 'Password is incorrect' })
  }
  const id = req.user.id
  db.users = db.users.filter((u) => u.id !== id)
  db.sessions = db.sessions.filter((s) => s.userId !== id)
  db.savedTrips = db.savedTrips.filter((t) => t.userId !== id)
  db.notifications = db.notifications.filter((n) => n.userId !== id)
  await saveDb()
  res.status(204).end()
})

export default router
