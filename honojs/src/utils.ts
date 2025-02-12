import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

interface IResolveFileNameParams {
  arch: string;
  target: string;
}

export function resolveFileName({
  arch,
  target,
}: IResolveFileNameParams): string {
  switch (target) {
    case 'darwin': {
      return `${target}-${arch}.app.tar.gz`;
    }
    case 'windows': {
      return `${target}-${arch}.exe`;
    }
    default: {
      return `${target}-${arch}.AppImage`;
    }
  }
}

export async function getUpdateSignature({
  arch,
  target,
}: IResolveFileNameParams): Promise<string> {
  const fileName = resolveFileName({
    arch,
    target,
  });

  const signature = await readFile(
    join(__dirname, `./app-releases/${fileName}.sig`)
  );

  return signature.toString();
}
