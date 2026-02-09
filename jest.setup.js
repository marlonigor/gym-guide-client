// Minimal setup for service tests
if (typeof global.fetch === 'undefined') {
    global.fetch = jest.fn();
} else if (!jest.isMockFunction(global.fetch)) {
    jest.spyOn(global, 'fetch');
}
