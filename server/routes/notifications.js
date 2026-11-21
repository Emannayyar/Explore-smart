import { Router } from 'express'
import { db, saveDb } from '../store.js'
import { requireAuth } from '../auth.js'

const router = Router()
router.use(requireAuth)

const mine = (req) => db.notifications.filter((n) => n.userId === req.user.id)
const view = ({ userId, ...n }) => n // eslint-disable-line no-unused-vars

router.get('/', (req, res) => {
  const list = mine(req).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  res.json({ notifications: list.map(view), unread: list.filter((n) => !n.read).length })
})

router.post('/read-all', async (req, res) => {
  mine(req).forEach((n) => { n.read = true })
  await saveDb()
  res.status(204).end()
})

router.patch('/:id', async (req, res) => {
  const n = mine(req).find((x) => x.id === req.params.id)
  if (!n) return res.status(404).json({ error: 'Notification not found' })
  if (req.body?.read !== true) return res.status(400).json({ error: 'Send { "read": true }' })
  n.read = true
  await saveDb()
  res.json({ notification: view(n) })
})

router.delete('/:id', async (req, res) => {
  const n = mine(req).find((x) => x.id === req.params.id)
  if (!n) return res.status(404).json({ error: 'Notification not found' })
  db.notifications = db.notifications.filter((x) => x !== n)
  await saveDb()
  res.status(204).end()
})

router.delete('/', async (req, res) => {
  db.notifications = db.notifications.filter((n) => n.userId !== req.user.id)
  await saveDb()
  res.status(204).end()
})

export default router
