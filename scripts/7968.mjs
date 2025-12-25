import 'dotenv/config';
import { createPromidasForLocal } from '@f88/promidas';

async function main() {
  const repo = createPromidasForLocal({
    protopediaApiToken: process.env.PROTOPEDIA_API_V2_TOKEN,
    logLevel: 'debug ',
  });

  const result = await repo.setupSnapshot({
    // offset: 5500,
    // limit: 1000,
    prototypeId: 7968,
  });

  console.log(await repo.analyzePrototypes());
  const p = await repo.getPrototypeFromSnapshotByPrototypeId(7968);
  console.dir(p, { depth: null });
}

main();
