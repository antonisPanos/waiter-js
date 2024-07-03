<pre align="center" style="color:lightblue">
                           d8,                        
                          `8P    d8P                  
                              d888888P                
 ?88   d8P  d8P d888b8b    88b  ?88'   d8888b  88bd88b
 d88  d8P' d8P'd8P' ?88    88P  88P   d8b_,dP  88P'  `
 ?8b ,88b ,88' 88b  ,88b  d88   88b   88b     d88     
 `?888P'888P'  `?88P'`88bd88'   `?8b  `?888P'd88'     
                                                      

<small><b>A simple module for handling async requests synchronously throughout your application</b></small>
</pre>

## 🧭 Overview

Waiter is a simple module for handling async requests synchronously throughout your front-end applications.

It allows micro-frontends to handle async requests synchronously, simplifying application flow and data exchange between components.

## 🚀 Features

- **Synchronous requests**: Handles async requests synchronously, simplifying application flow and data exchange between components.
- **Controller-based**: Organizes requests using controllers for better manageability.
- **Promise-based API**: Facilitates async programming with promises.
- **Lightweight**: Is a lightweight library with no dependencies, making it easy to integrate into your project.
- **TypeScript Support**: Is written in TypeScript and provides type definitions out of the box.

## ⚙️ Installation

### NPM

```bash
npm i @strange-bytes/waiter
```

### Yarn

```bash
yarn add @strange-bytes/waiter
```

### PNPM

```bash
pnpm add @strange-bytes/waiter
```

## 🧩 Usage

To use Waiter, you need to import it into your project:

```typescript
// ES6
import Waiter from 'waiter';
// CommonJS
const Waiter = require('waiter');
```

Then you can create a new instance of Waiter to add controllers and handle requests:

```typescript
// App A
const waiter = new Waiter();

waiter.createController('fetchUserState', () => {
  const { user } = userStore();
  return user;
});
```

```typescript
// App B
const waiter = new Waiter();

const user = await waiter.request('fetchUserState');
```

## 📖 API

### `constructor(options?: { namespace?: WaiterConfigKeyPattern; outputPrefix?: string })`

Creates an instance of Waiter. You can optionally specify a custom namespace and output prefix.

- **options.namespace**: The namespace to use for the Waiter configuration. Defaults to `__WAITER_CONFIG_COMMON__`.
- **options.outputPrefix**: The prefix to use for output messages. Defaults to '[Waiter]'.

### `createController(endpoint: string, callback: (payload: any) => any): void`

Registers a new controller that handles requests to a specific endpoint.

- **endpoint**: The name of the endpoint.
- **callback**: The function to execute when the endpoint is called. It should return the response.

### `removeController(endpointName: string): void`

Removes a previously registered controller.

- **endpointName**: The name of the endpoint to remove.

### `request(endpointName: string, payload: any, options?: { timeout: number }): Promise<any>`

Sends a request to a specific endpoint and returns a promise that resolves with the response.

- **endpointName**: The name of the endpoint to send the request to.
- **payload**: The payload to send with the request.
- **options.timeout**: Optional timeout in milliseconds. Defaults to 1000ms.

### `config: WaiterConfig`

Provides access to the current Waiter configuration. This is a read-only property.

## 🤝 Contributing

We welcome contributions! Feel free to open an issue or submit a pull request from your fork if you have any ideas or
suggestions.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
