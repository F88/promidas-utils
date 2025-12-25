import 'dotenv/config';
import { createPromidasForLocal } from '@f88/promidas';

/**
 * Create repository instance using factory function.
 */
function createRepository() {
  return createPromidasForLocal({
    protopediaApiToken: process.env.PROTOPEDIA_API_V2_TOKEN,
    logLevel: 'debug',
  });
}

/**
 * Dump prototype information by ID.
 */
async function dumpPrototypeInfo(repo, id) {
  // Setup snapshot of prototypes
  await repo.setupSnapshot({ prototypeId: id });
  // Dump prototype with specified ID
  console.dir(repo.getPrototypeFromSnapshotByPrototypeId(id), { depth: null });
}

// Create repository instance
const repo = createRepository();
const id = 7968; // Specify prototype ID

// Dump prototype information
dumpPrototypeInfo(repo, id);
