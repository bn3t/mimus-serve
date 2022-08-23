import http from "node:http";
import { processRequest } from "./engine";
import { loadConfiguration } from "./mapping";

const start = async () => {
  const configuration = await loadConfiguration();

  const server = http.createServer(async (req, res) => {
    try {
      await processRequest(configuration.mappings, req, res);
    } catch (error) {
      console.error("Error while processing request", error);
    }
    res.end();
  });
  server.on("clientError", (err, socket) => {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  });
  server.listen(4000);
};

start().catch(console.error);
