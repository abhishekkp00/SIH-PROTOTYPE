const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const path = require('path');
const connectDB = require('./lib/db');

// Load env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sealens';

async function bootstrap() {
  await connectDB(MONGODB_URI);

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Routes
  app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
  app.use('/api', require('./routes'));

  // WebSocket events
  io.on('connection', (socket) => {
    console.log('Client connected', socket.id);
    socket.emit('welcome', { message: 'Connected to SeaLens live updates' });
    socket.on('disconnect', () => console.log('Client disconnected', socket.id));
  });

  // Mock live updates every 15s
  const { emitLiveUpdates } = require('./lib/live');
  setInterval(() => emitLiveUpdates(io), 15000);

  server.listen(PORT, () => {
    console.log(`SeaLens API listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap', err);
  process.exit(1);
});