import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import gameService from './src/services/game.service.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    await gameService.start();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

