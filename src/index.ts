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

/**
 * Waiter is a simple module for handling async requests synchronously throughout your application
 * @class Waiter
 */
export default class Waiter {
  /**
   * Default request timeout in milliseconds
   * @readonly
   * @memberof Waiter
   */
  readonly defaultRequestTimeout: number = 1000;

  private readonly configNamespace: WaiterConfigKeyPattern = '__WAITER_CONFIG_COMMON__';

  private readonly outputPrefix: string = '[Waiter]';

  /**
   * Creates an instance of Waiter.
   *
   * @description You can override the default namespace by passing a custom one.</br>
   * This can be useful when you want to separate the Waiter configuration between different parts of your application
   * or if the namespace is already in use.</br>
   * **Be careful when doing this**, as it can lead to unresolved requests if the namespace is not shared between the
   * parts of your application.
   * @param {WaiterConfigKeyPattern} [namespace] The namespace to use for the Waiter configuration.
   * The format should be `__WAITER_CONFIG_${string}__`. Defaults to `__WAITER_CONFIG_COMMON__`.
   * @param {string} [outputPrefix] The prefix to use for the output messages. Defaults to 'Waiter:'.
   */
  constructor({ namespace, outputPrefix }: { namespace?: WaiterConfigKeyPattern; outputPrefix?: string } = {}) {
    this.configNamespace = namespace || this.configNamespace;
    this.outputPrefix = outputPrefix || this.outputPrefix;
    if (!this.hasExistingConfig()) this.createConfig();
  }

  /**
   * Waiter configuration object.
   * @readonly
   * @memberof Waiter
   */
  get config(): WaiterConfig {
    return window[this.configNamespace];
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
   * @memberof Waiter
   */
  createController(endpoint: string, callback: (payload: any) => any): void {
    if (this.config.controllers.has(endpoint))
      throw new Error(`${this.outputPrefix} Endpoint: "${endpoint}", already exists.`);
    const controller = async (payload: any, resolve: (value: any) => void) => {
      try {
        const result = await callback(payload);
        resolve(result);
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
   * @memberof Waiter
   */
  removeController(endpointName: string): void {
    if (!this.config.controllers.has(endpointName))
      throw new Error(`${this.outputPrefix} Endpoint: "${endpointName}", not found.`);
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
  request(endpointName: string, payload: any, options?: { timeout: number }): Promise<any> {
    if (!this.config.controllers.has(endpointName))
      throw new Error(`${this.outputPrefix} Endpoint: "${endpointName}", not found.`);

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error(`${this.outputPrefix} Request to endpoint: "${endpointName}", timed out.`)),
        options?.timeout || this.defaultRequestTimeout
      );

      const resolver = (value: any): void => {
        clearTimeout(timeoutId);
        return resolve(value);
      };

      try {
        this.config.controllers.get(endpointName)?.(payload, resolver);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Creates the Waiter configuration.
   * @memberof Waiter
   */
  private createConfig(): void {
    window[this.configNamespace] = {
      controllers: new Map()
    };
  }

  /**
   * Checks if the Waiter configuration already exists.
   * @memberof Waiter
   */
  private hasExistingConfig(): boolean {
    return this.config !== undefined;
  }
}
