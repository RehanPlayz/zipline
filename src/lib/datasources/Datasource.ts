import { Readable } from 'stream';

export abstract class Datasource {
  public name: string;

  public abstract save(file: string, data: Buffer, options?: { type: string }): Promise<void>;
  public abstract delete(file: string): Promise<void>;
  public abstract clear(): Promise<void>;
  public abstract size(file: string): Promise<number | null>;
  public abstract get(file: string): Readable | Promise<Readable>;
  public abstract fullSize(): Promise<number>;
  public abstract range(file: string, start: number, end: number): Promise<Readable>;
}
