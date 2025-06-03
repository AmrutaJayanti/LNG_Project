import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import cors from 'cors';
import http from 'http';
import chatRoutes from './routes/chatRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { Server } from 'socket.io';
import chatSocket from './controllers/chatSocket.controller.js';
import setup from './controllers/gameSocket.controller.js';

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/api',chatRoutes)
app.use('/api', userRoutes);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

setup(io); // Game socket setup (assuming it exists)
chatSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));