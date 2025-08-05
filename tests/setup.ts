import { Buffer } from 'buffer';

const mockCrypto = {
  subtle: {
    importKey: jest.fn().mockResolvedValue({}),
    encrypt: jest.fn().mockImplementation(() => {
      const testData = 'encrypted-test-data';
      return Promise.resolve(new TextEncoder().encode(testData).buffer);
    }),
    decrypt: jest.fn().mockImplementation(() => {
      const testData = JSON.stringify({ data: 'secret', number: 42 });
      return Promise.resolve(new TextEncoder().encode(testData).buffer);
    })
  },
  getRandomValues: jest.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i % 256;
    }
    return arr;
  })
};

Object.defineProperty(globalThis, 'crypto', {
  value: mockCrypto,
  writable: true
});

Object.defineProperty(globalThis, 'btoa', {
  value: jest.fn((str: string) => Buffer.from(str, 'binary').toString('base64')),
  writable: true
});

Object.defineProperty(globalThis, 'atob', {
  value: jest.fn((str: string) => Buffer.from(str, 'base64').toString('binary')),
  writable: true
});

Object.defineProperty(globalThis, 'TextEncoder', {
  value: jest.fn().mockImplementation(() => ({
    encode: jest.fn((str: string) => new Uint8Array(Buffer.from(str, 'utf8')))
  })),
  writable: true
});

Object.defineProperty(globalThis, 'TextDecoder', {
  value: jest.fn().mockImplementation(() => ({
    decode: jest.fn((buffer: Uint8Array) => Buffer.from(buffer).toString('utf8'))
  })),
  writable: true
});

beforeEach(() => {
  Object.keys(window).forEach((key) => {
    if (key.startsWith('__WAITER_CONFIG_')) {
      delete (window as any)[key];
    }
  });

  jest.clearAllMocks();
});
