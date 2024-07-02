# WaiterJS

Waiter is a simple library that enables blocking async requests between different parts of your application.

## How to Install

You can install the Waiter library using various package managers. Below are the commands for the most commonly used package managers.

### NPM

```bash
npm install waiter-js
```

### Yarn

```bash
yarn add waiter-js
```

### PNPM

```bash
pnpm add waiter-js
```

## How to Use

To use the Waiter library, you need to import it into your project and then create instances of Waiter as needed.

```typescript
import Waiter from 'waiter';

// Create a new instance of Waiter
const waiter = new Waiter();

// Create a controller
waiter.createController('fetchUserState', (payload) => {
  const { user } = userStore();
  return user;
});

// Send a request
waiter.request('fetchUserState', null)
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
