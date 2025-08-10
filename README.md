<pre align="center" style="color:lightblue">

 __     __     ______     __     ______   ______     ______    
/\ \  _ \ \   /\  __ \   /\ \   /\__  _\ /\  ___\   /\  == \   
\ \ \/ ".\ \  \ \  __ \  \ \ \  \/_/\ \/ \ \  __\   \ \  __<   
 \ \__/".~\_\  \ \_\ \_\  \ \_\    \ \_\  \ \_____\  \ \_\ \_\ 
  \/_/   \/_/   \/_/\/_/   \/_/     \/_/   \/_____/   \/_/ /_/ 
                                                               

<small><b>A simple module that enables you to perform and handle<br>requests among your apps on the browser.</b></small>
</pre>

## 🧭 Overview

It allows micro-frontends to handle requests and responses, simplifying application flow and data exchange between
components.

## 🚀 Features

- **Dead simple**: Handles requests and responses with a simple interface, simplifying application flow and data exchange between
  components.
- **Controller-based**: Organizes requests using controllers for better manageability.
- **Promise-based API**: Facilitates async programming with promises.
- **Lightweight**: Is a lightweight tool with no dependencies, making it easy to integrate into your project.
- **TypeScript Support**: Is written in TypeScript and provides type definitions out of the box.

## 🎬 Demo

**👉 [Check it out here](https://waiter-demo.vercel.app/) 👈**

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

### `constructor(options)`

Creates an instance of Waiter. You can optionally specify configuration options.

- **options**: Object with optional properties:
    - **namespace**: The namespace to use for the Waiter configuration. Defaults to `__WAITER_CONFIG_COMMON__`.
    - **outputPrefix**: The prefix to use for output messages. Defaults to '[Waiter]'.
    - **token**: Optional authorization token required for creating/removing controllers.

### `createController(endpoint, callback, token?)`

Registers a new controller that handles requests to a specific endpoint.

- **endpoint**: string - The name of the endpoint.
- **callback**: Function - The function to execute when the endpoint is called. It should return the response.
- **token**: string (optional) - Authorization token. Required if the Waiter instance was created with a token.

### `removeController(endpointName, token?)`

Removes a previously registered controller.

- **endpointName**: string - The name of the endpoint to remove.
- **token**: string (optional) - Authorization token. Required if the Waiter instance was created with a token.

### `request(endpointName, payload, options)`

Sends a request to a specific endpoint and returns a promise that resolves with the response.

- **endpointName**: string - The name of the endpoint to send the request to.
- **payload**: any - The payload to send with the request.
- **options**: Object with optional properties:
    - **timeout**: number - Optional timeout in milliseconds. Defaults to 1000ms.

### `config`

Provides access to the current Waiter configuration. This is a read-only property.

## 🤝 Contributing

We welcome contributions! Feel free to open an issue or submit a pull request from your fork if you have any ideas or
suggestions.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
