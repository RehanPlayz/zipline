import { createReadStream, existsSync, ReadStream } from 'fs';
import { readdir, rm, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { Datasource } from '.';

export class Local extends Datasource {
  public name = 'local';

  public constructor(public path: string) {
    super();
  }

  public async save(file: string, data: Buffer): Promise<void> {
    await writeFile(join(this.path, file), Uint8Array.from(data));
  }

  public async delete(file: string): Promise<void> {
    await rm(join(this.path, file), { force: true });
  }

  public async clear(): Promise<void> {
    const files = await readdir(this.path);

    for (let i = 0; i !== files.length; ++i) {
      await rm(join(this.path, files[i]));
    }
  }

  public get(file: string): ReadStream {
    const full = join(this.path, file);
    if (!existsSync(full)) return null;

    try {
      return createReadStream(full);
    } catch (e) {
      return null;
    }
  }

  public async size(file: string): Promise<number | null> {
    const full = join(this.path, file);
    if (!existsSync(full)) return null;
    const stats = await stat(full);

    return stats.size;
  }

  public async fullSize(): Promise<number> {
    const files = await readdir(this.path);

    let size = 0;
    for (let i = 0, L = files.length; i !== L; ++i) {
      const sta = await stat(join(this.path, files[i]));
      size += sta.size;
    }

    return size;
  }

  public async range(file: string, start: number, end: number): Promise<ReadStream> {
    const path = join(this.path, file);
    const readStream = createReadStream(path, { start, end });

    return readStream;
  }
}
