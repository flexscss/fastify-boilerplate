import fs from 'node:fs/promises'
import path from 'node:path'

export async function findFiles(dir, extension, excludedFolders = []) {
  const files = []

  async function scan(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        if (!excludedFolders.includes(entry.name)) {
          await scan(fullPath)
        }
      }
      else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath)
      }
    }
  }

  await scan(dir)
  return files
}
