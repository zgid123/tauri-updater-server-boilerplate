import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import './env';
import { updater } from './api/updater';

const app = new Hono();

app.get('/health', (c) => {
  return c.text('OK!');
});

app.route('/updater', updater);

const port = 3_000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  port,
  fetch: app.fetch,
});
