// Tiny JSON-file store: whole db lives in memory, every change is written back atomically.
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data')
const file = path.join(dir, 'db.json')
const empty = () => ({ users: [], sessions: [], savedTrips: [], messages: [], notifications: [] })

export const db = empty()
let writing = Promise.resolve()

export async function loadDb() {
  await mkdir(dir, { recursive: true })
  try {
    Object.assign(db, empty(), JSON.parse(await readFile(file, 'utf8')))
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
    await saveDb()
  }
}

// Writes are queued so two requests never write the temp file at the same time.
export function saveDb() {
  writing = writing.then(async () => {
    const tmp = `${file}.${process.pid}.tmp`
    await writeFile(tmp, JSON.stringify(db, null, 2))
    await rename(tmp, file)
  })
  return writing
}
