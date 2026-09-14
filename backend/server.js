import dotenv from 'dotenv';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
