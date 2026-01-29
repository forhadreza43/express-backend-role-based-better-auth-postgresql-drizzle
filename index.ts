import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import { authMiddleware } from './src/middleware/auth';
import { requireRole } from './src/middleware/role';

const PORT = process.env.PORT || 3000;
const app = express();

if (!process.env.FRONTEND_URL) {
   throw new Error('FRONTEND_URL is not set in the .env file');
}
// Important: Configure CORS to allow your React frontend
app.use(
   cors({
      origin: process.env.FRONTEND_URL!, // Your React URL
      credentials: true,
   })
);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/logged', authMiddleware,requireRole(['teacher', 'student']), (req, res) => {
   res.send('Hello from Better Auth server!');
});

app.listen(PORT, () => {
   console.log(`Server is running on port: ${PORT}`);
});
