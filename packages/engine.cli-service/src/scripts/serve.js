const handler = require("serve-handler");
const http = require("http");

const { host, port } = require("../utils/server");

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: "dist",
  });
});

module.exports = () =>
  server.listen(port, host, () => {
    // console.log(`Development server running on host ${HOST} and port ${PORT}`);
  });
