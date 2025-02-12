import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { stream } from 'hono/streaming';
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
    join(__dirname, `../app-releases/${target}-${arch}.app.tar.gz.sig`)
  );

  return c.json(
    Object.assign(semver, {
      signature: signature.toString(),
      url: `${DOMAIN}/updater/${target}/${arch}/update`,
    })
  );
});

updater.get(':target/:arch/update', (c) => {
  const arch = c.req.param('arch');
  const target = c.req.param('target');
  const fileName = resolveFileName({
    arch,
    target,
  });

  return stream(c, async (str) => {
    const streamData = createReadStream(
      join(__dirname, `../app-releases/${fileName}`)
    );

    streamData.on('data', (chunk) => {
      str.write(chunk);
    });

    streamData.on('end', () => {
      str.close();
    });

    streamData.on('error', (_err) => {
      str.close();
    });
  });
});
