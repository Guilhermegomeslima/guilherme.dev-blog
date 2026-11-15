declare module 'node:test' {
  export function describe(name: string, fn: () => void | Promise<void>): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
}

declare module 'node:assert/strict' {
  const assert: {
    equal<T>(actual: T, expected: T, message?: string | Error): void;
    notEqual<T>(actual: T, expected: T, message?: string | Error): void;
    deepEqual<T>(actual: T, expected: T, message?: string | Error): void;
    ok(value: unknown, message?: string | Error): void;
    throws(fn: () => void, error?: RegExp | Function, message?: string): void;
  };
  export default assert;
}

declare module 'node:fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function readdirSync(path: string): string[];
  export function existsSync(path: string): boolean;
  export function statSync(path: string): {
    isFile(): boolean;
    isDirectory(): boolean;
  };
  const fs: {
    readFileSync(path: string, encoding: string): string;
    readdirSync(path: string): string[];
    existsSync(path: string): boolean;
    statSync(path: string): { isFile(): boolean; isDirectory(): boolean };
  };
  export default fs;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  const path: {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
  };
  export default path;
}
