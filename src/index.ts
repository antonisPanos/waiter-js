declare global {
  interface Window {
    [key: WaiterConfigKeyPattern]: WaiterConfig;
  }
}

export type WaiterConfigKeyPattern = `__WAITER_CONFIG_${string}__`;

export type Controller<TPayload = any, TResult = any> = {
  endpoint: string;
  handler: (payload: TPayload, resolve: (value: TResult) => void) => void;
};

export type WaiterConfig = {
  controllers: Map<Controller['endpoint'], Controller['handler']>;
};

export interface WaiterOptions {
  namespace?: WaiterConfigKeyPattern;
  outputPrefix?: string;
  authToken?: string;
  encryptionKey?: string;
}

/**
 * Waiter is a simple module that enables you to perform and handle requests among your apps on the browser.
 * @class Waiter
 */
export default class Waiter {
  /**
   * Default request timeout in milliseconds
   * @readonly
   * @memberof Waiter
   */
  readonly defaultRequestTimeout: number = 1000;

  readonly #configNamespace: WaiterConfigKeyPattern = '__WAITER_CONFIG_COMMON__';
  readonly #outputPrefix: string = '[Waiter]';
  readonly #authToken?: string;
  readonly #encryptionKey?: string;
  readonly #encryptionKeySize = 32;

  /**
   * Creates an instance of Waiter.
   *
   * @description You can override the default namespace by passing a custom one.</br>
   * This can be useful when you want to separate the Waiter configuration between different parts of your application
   * or if the namespace is already in use.</br>
   * **Be careful when doing this**, as it can lead to unresolved requests if the namespace is not shared between the
   * parts of your application.
   * @param {WaiterOptions} options Configuration options for Waiter
   */
  constructor(options: WaiterOptions = {}) {
    const { namespace, outputPrefix, authToken, encryptionKey } = options;
    this.#configNamespace = namespace || this.#configNamespace;
    this.#outputPrefix = outputPrefix || this.#outputPrefix;
    this.#authToken = authToken;
    this.#encryptionKey = encryptionKey;
    if (!this.#hasExistingConfig()) this.#createConfig();
  }

  /**
   * Waiter configuration object.
   * @readonly
   * @memberof Waiter
   */
  get config(): WaiterConfig {
    return window[this.#configNamespace];
  }

  /**
   * Registers a new controller that handles requests to a specific endpoint.
   * Throws an error if the endpoint already exists.
   * @example
   * ```typescript
   * const waiter = new Waiter();
   * waiter.createController('fetchUserState', () => {
   *   const {user} = userStore();
   *   return user;
   * });
   * ```
   * @param {string} endpoint The name of the endpoint
   * @param {Function} callback The callback function to execute when the endpoint is called
   * @param {string} [authToken] Optional authentication token required to create the controller
   * @returns {void}
   * @memberof Waiter
   */
  createController(endpoint: string, callback: (payload: any) => any, authToken?: string): void {
    if (this.#authToken && this.#authToken !== authToken) {
      throw new Error(`${this.#outputPrefix} Invalid authentication token for endpoint: "${endpoint}".`);
    }

    if (this.config.controllers.has(endpoint))
      throw new Error(`${this.#outputPrefix} Endpoint: "${endpoint}", already exists.`);

    const controller = async (payload: any, resolve: (value: any) => void) => {
      try {
        const decryptedPayload = this.#encryptionKey ? await this.#decrypt(payload) : payload;
        const result = await callback(decryptedPayload);
        const encryptedResult = this.#encryptionKey ? await this.#encrypt(result) : result;
        resolve(encryptedResult);
      } catch (error) {
        throw error;
      }
    };
    this.config.controllers.set(endpoint, controller);
  }

  /**
   * Removes a previously registered controller.
   * Throws an error if the endpoint does not exist.
   * @example
   * ```typescript
   * const waiter = new Waiter();
   * waiter.removeController('fetchUserState');
   * ```
   * @param {string} endpointName The name of the endpoint to remove
   * @param {string} [authToken] Optional authentication token required to remove the controller
   * @returns {void}
   * @memberof Waiter
   */
  removeController(endpointName: string, authToken?: string): void {
    if (this.#authToken && this.#authToken !== authToken) {
      throw new Error(`${this.#outputPrefix} Invalid authentication token for endpoint: "${endpointName}".`);
    }

    if (!this.config.controllers.has(endpointName))
      throw new Error(`${this.#outputPrefix} Endpoint: "${endpointName}", not found.`);
    this.config.controllers.delete(endpointName);
  }

  /**
   * Sends a request to a specific endpoint and returns a promise that resolves with the response.
   * Throws an error if the endpoint does not exist.
   * @param {string} endpointName The name of the endpoint to send the request to
   * @param {any} payload The payload to send with the request
   * @param {{ timeout: number }} [options] Optional request options
   * @memberof Waiter
   */
  async request(endpointName: string, payload: any, options?: { timeout: number }): Promise<any> {
    if (!this.config.controllers.has(endpointName))
      throw new Error(`${this.#outputPrefix} Endpoint: "${endpointName}", not found.`);

    const encryptedPayload = this.#encryptionKey ? await this.#encrypt(payload) : payload;

    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error(`${this.#outputPrefix} Request to endpoint: "${endpointName}", timed out.`)),
        options?.timeout || this.defaultRequestTimeout
      );

      const resolver = async (value: any): Promise<void> => {
        clearTimeout(timeoutId);
        const decryptedValue = this.#encryptionKey ? await this.#decrypt(value) : value;
        return resolve(decryptedValue);
      };

      try {
        this.config.controllers.get(endpointName)?.(encryptedPayload, resolver);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Creates the Waiter configuration.
   * @returns {void}
   * @memberof Waiter
   */
  #createConfig(): void {
    window[this.#configNamespace] = {
      controllers: new Map()
    };
  }

  /**
   * Checks if the Waiter configuration already exists.
   * @returns {boolean}
   * @memberof Waiter
   */
  #hasExistingConfig(): boolean {
    return this.config !== undefined;
  }

  /**
   * Encrypts data using AES-GCM encryption with the provided encryption key
   * @param data The data to encrypt
   * @returns Promise that resolves to encrypted data as base64 string
   * @memberof Waiter
   */
  async #encrypt(data: any): Promise<string> {
    if (!this.#encryptionKey) {
      throw new Error(`${this.#outputPrefix} Encryption key not provided.`);
    }

    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);

      const keyBuffer = encoder.encode(this.#encryptionKey);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer.slice(0, this.#encryptionKeySize),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, dataBuffer);
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      throw new Error(`${this.#outputPrefix} Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypts data using AES-GCM decryption with the provided encryption key
   * @param encryptedData The encrypted data as base64 string
   * @returns Promise that resolves to decrypted data
   * @memberof Waiter
   */
  async #decrypt(encryptedData: string): Promise<any> {
    if (!this.#encryptionKey) {
      throw new Error(`${this.#outputPrefix} Encryption key not provided.`);
    }

    try {
      const combined = new Uint8Array(
        atob(encryptedData)
          .split('')
          .map((char) => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encryptedBuffer = combined.slice(12);

      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(this.#encryptionKey);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer.slice(0, this.#encryptionKeySize),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, encryptedBuffer);

      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decryptedBuffer);
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`${this.#outputPrefix} Decryption failed: ${error}`);
    }
  }
}
