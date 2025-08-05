import Waiter from '../src/index';

describe('Waiter', () => {
  const authToken = 'test-auth-token';
  const encryptionKey = '32charactersencryptionkey123456';

  describe('Basic functionality without auth', () => {
    let waiter: Waiter;

    beforeEach(() => {
      waiter = new Waiter();
    });

    it('should create a controller and handle requests', async () => {
      waiter.createController('testEndpoint', (payload) => `response for ${payload}`);
      const response = await waiter.request('testEndpoint', 'testPayload');
      expect(response).toBe('response for testPayload');
    });

    it('should throw error for duplicate endpoint', () => {
      waiter.createController('duplicateEndpoint', () => 'first');
      expect(() => {
        waiter.createController('duplicateEndpoint', () => 'second');
      }).toThrow('Endpoint: "duplicateEndpoint", already exists.');
    });

    it('should remove a controller successfully', () => {
      waiter.createController('removableEndpoint', () => 'test');
      expect(() => waiter.removeController('removableEndpoint')).not.toThrow();
    });

    it('should throw error when removing non-existent controller', () => {
      expect(() => {
        waiter.removeController('nonExistent');
      }).toThrow('Endpoint: "nonExistent", not found.');
    });

    it('should throw error for non-existent endpoint request', async () => {
      await expect(waiter.request('nonExistent', {})).rejects.toThrow('Endpoint: "nonExistent", not found.');
    });

    it('should handle timeout correctly', async () => {
      waiter.createController('slowEndpoint', () => {
        return new Promise((resolve) => setTimeout(() => resolve('slow'), 2000));
      });

      await expect(waiter.request('slowEndpoint', {}, { timeout: 100 })).rejects.toThrow(
        'Request to endpoint: "slowEndpoint", timed out.'
      );
    });
  });

  describe('Authentication features', () => {
    let secureWaiter: Waiter;

    beforeEach(() => {
      secureWaiter = new Waiter({ authToken });
    });

    it('should create a controller with correct authToken', () => {
      expect(() => {
        secureWaiter.createController('secureEndpoint', () => 'secure', authToken);
      }).not.toThrow();
    });

    it('should not create a controller with invalid authToken', () => {
      expect(() => {
        secureWaiter.createController('invalidEndpoint', () => {}, 'invalid-token');
      }).toThrow('Invalid authentication token for endpoint: "invalidEndpoint".');
    });

    it('should not create a controller without authToken when required', () => {
      expect(() => {
        secureWaiter.createController('noTokenEndpoint', () => {});
      }).toThrow('Invalid authentication token for endpoint: "noTokenEndpoint".');
    });

    it('should remove a controller with correct authToken', () => {
      secureWaiter.createController('removableEndpoint', () => {}, authToken);
      expect(() => {
        secureWaiter.removeController('removableEndpoint', authToken);
      }).not.toThrow();
    });

    it('should not remove a controller with invalid authToken', () => {
      secureWaiter.createController('secureEndpoint', () => {}, authToken);
      expect(() => {
        secureWaiter.removeController('secureEndpoint', 'invalid-token');
      }).toThrow('Invalid authentication token for endpoint: "secureEndpoint".');
    });
  });

  describe('Encryption features', () => {
    let encryptedWaiter: Waiter;

    beforeEach(() => {
      encryptedWaiter = new Waiter({ encryptionKey });
    });

    it('should handle encryption flow (mocked)', async () => {
      const testData = { data: 'secret', number: 42 };

      encryptedWaiter.createController('encryptEndpoint', (payload) => {
        return { response: 'encrypted', input: 'processed' };
      });

      const result = await encryptedWaiter.request('encryptEndpoint', testData);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('Combined auth and encryption', () => {
    let fullySecureWaiter: Waiter;

    beforeEach(() => {
      fullySecureWaiter = new Waiter({ authToken, encryptionKey });
    });

    it('should work with both auth and encryption (mocked)', async () => {
      const testData = { secret: 'classified' };

      fullySecureWaiter.createController(
        'fullySecure',
        (payload) => {
          return { status: 'success', processed: true };
        },
        authToken
      );

      const result = await fullySecureWaiter.request('fullySecure', testData);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('Configuration options', () => {
    it('should use custom namespace', () => {
      const customWaiter = new Waiter({
        namespace: '__WAITER_CONFIG_CUSTOM__' as any
      });

      customWaiter.createController('test', () => 'custom');
      expect((window as any).__WAITER_CONFIG_CUSTOM__).toBeDefined();
    });

    it('should use custom output prefix', () => {
      const customWaiter = new Waiter({
        outputPrefix: '[CustomWaiter]'
      });

      expect(() => {
        customWaiter.removeController('nonExistent');
      }).toThrow('[CustomWaiter] Endpoint: "nonExistent", not found.');
    });
  });
});
