import http from 'http';
import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { createSocketServer } from './config/socket.js';

const server = http.createServer(app);
createSocketServer(server);

connectDb()
  .then(() => {
    server.listen(env.port, () => {
      console.log(`SkillSwap API listening on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
