import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function main() {
  await connectDb();
  createApp().listen(env.PORT, () => console.log(`FinSight AI backend listening on http://localhost:${env.PORT}`));
}
main().catch(err => { console.error('Startup failed', err); process.exit(1); });
