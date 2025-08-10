beforeEach(() => {
  Object.keys(window).forEach((key) => {
    if (key.startsWith('__WAITER_CONFIG_')) {
      delete (window as any)[key];
    }
  });

  jest.clearAllMocks();
});
