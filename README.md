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
- **Lightweight**: Is a lightweight library with no dependencies, making it easy to integrate into your project.
- **TypeScript Support**: Is written in TypeScript and provides type definitions out of the box.
- **Security Features**: Optional authentication and encryption support for sensitive data protection.

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
    - **authToken**: Optional authentication token required for creating/removing controllers.
    - **encryptionKey**: Optional encryption key for automatic payload/response encryption.

### `createController(endpoint, callback, authToken?)`

Registers a new controller that handles requests to a specific endpoint.

- **endpoint**: string - The name of the endpoint.
- **callback**: Function - The function to execute when the endpoint is called. It should return the response.
- **authToken**: string (optional) - Authentication token required if the Waiter instance was created with an authToken.

### `removeController(endpointName, authToken?)`

Removes a previously registered controller.

- **endpointName**: string - The name of the endpoint to remove.
- **authToken**: string (optional) - Authentication token required if the Waiter instance was created with an authToken.

### `request(endpointName, payload, options)`

Sends a request to a specific endpoint and returns a promise that resolves with the response.

- **endpointName**: string - The name of the endpoint to send the request to.
- **payload**: any - The payload to send with the request.
- **options**: Object with optional properties:
    - **timeout**: number - Optional timeout in milliseconds. Defaults to 1000ms.

### `config`

Provides access to the current Waiter configuration. This is a read-only property.

## 🔒 Security Features

Waiter supports optional authentication and encryption to protect sensitive data in micro-frontend communications.

### Authentication

You can protect controller creation and removal with an authentication token:

```typescript
// Create a Waiter instance with authentication
const secureWaiter = new Waiter({
  authToken: 'your-secret-token'
});

// Creating controllers requires the correct auth token
secureWaiter.createController('secureEndpoint', (payload) => {
  return { data: payload };
}, 'your-secret-token'); // ✅ Success

// Wrong token will throw an error
secureWaiter.createController('hackAttempt', () => {}, 'wrong-token'); // ❌ Error

// Same applies to removing controllers
secureWaiter.removeController('secureEndpoint', 'your-secret-token'); // ✅ Success
```

### Encryption

Payloads and responses can be automatically encrypted using AES-GCM encryption:

```typescript
// Create a Waiter instance with encryption
const encryptedWaiter = new Waiter({
  encryptionKey: 'your-32-character-encryption-key!!'
});

encryptedWaiter.createController('sensitiveData', (payload) => {
  // Payload is automatically decrypted before reaching your handler
  console.log('Decrypted payload:', payload);
  
  // Return value is automatically encrypted before sending
  return { secret: 'This will be encrypted' };
});

// Request with sensitive data
const result = await encryptedWaiter.request('sensitiveData', {
  creditCard: '1234-5678-9012-3456'
}); // Payload is encrypted in transit

console.log('Decrypted result:', result); // Response is decrypted automatically
```

### Combined Security

You can use both authentication and encryption together:

```typescript
const fullySecureWaiter = new Waiter({
  authToken: 'auth-token',
  encryptionKey: 'encryption-key-32-characters!!',
  namespace: '__WAITER_CONFIG_SECURE__' // Separate namespace for security
});

fullySecureWaiter.createController('topSecret', (payload) => {
  return { classified: true, data: payload };
}, 'auth-token');
```

### Security Considerations

⚠️ **Important Security Notes:**

1. **Storage**: Waiter configuration is stored on the browser's `window` object, which can be accessed by any script on the page
2. **XSS Protection**: Ensure your application is protected against XSS attacks
3. **Token Management**: Store authentication tokens securely and rotate them regularly  
4. **Key Management**: Use strong encryption keys (32+ characters) and store them securely
5. **HTTPS**: Always use HTTPS in production to prevent man-in-the-middle attacks
6. **Content Security Policy**: Implement strict CSP headers to limit script execution

### Best Practices

- Use different namespaces for different security levels
- Don't send highly sensitive data through any browser-based communication system
- Validate and sanitize all payloads in your controllers
- Consider server-side validation for critical operations
- Use authentication for controller management in production environments

## 🤝 Contributing

We welcome contributions! Feel free to open an issue or submit a pull request from your fork if you have any ideas or
suggestions.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
