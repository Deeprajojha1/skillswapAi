import http from 'http';
import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { createSocketServer } from './config/socket.js';

const server = http.createServer(app);
createSocketServer(server);

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${env.port} is already in use.`);
    console.error('Stop the running Docker/API server or set a different PORT in .env before starting dev server.');
    process.exit(1);
  }
  console.error('Server error:', error);
  process.exit(1);
});

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
