import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { resolveFileName } from '../utils';
import semver from '../app-releases/semver.json';

export const updater = new Hono();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

updater.get(':target/:arch/latest-version', async (c) => {
  const arch = c.req.param('arch');
  const target = c.req.param('target');
  const { DOMAIN } = env(c);

  const signature = await readFile(
    join(__dirname, `../app-releases/${target}-${arch}.app.tar.gz.sig`),
    'utf8'
  );

  return c.json(
    Object.assign(semver, {
      platforms: {
        [`${target}-${arch}`]: {
          signature: signature.trim(),
          url: `${DOMAIN}/updater/${target}/${arch}/update`,
        },
      },
    })
  );
});

updater.get(':target/:arch/update', async (c) => {
  const arch = c.req.param('arch');
  const target = c.req.param('target');
  const fileName = resolveFileName({
    arch,
    target,
  });

  c.res.headers.set('Accept', 'application/octet-stream');
  c.res.headers.set('Content-Type', 'application/octet-stream');

  const data = await readFile(join(__dirname, `../app-releases/${fileName}`));

  return c.body(data);
});
