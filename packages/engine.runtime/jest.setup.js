if (!global.performance) {
    global.performance = {}
}
global.performance.now = jest.fn(Date.now)