import express, { RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authenticate } from './middleware/auth';

import { authRouter } from './routes/auth/auth.routes';
import { usersRouter } from './routes/users/users.routes';
import { partsRouter } from './routes/parts/parts.routes';
import { modelsRouter } from './routes/models/models.routes';
import { linesRouter } from './routes/lines/lines.routes';

const app = express();
const port = 3000;

app.use(express.json());

// Auth
// Users
// Products
// Strips
// Times (daily)
// capture
// Displays
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/auth', authRouter);

app.use('/users', authenticate('users') as RequestHandler, usersRouter);
app.use('/parts', authenticate('models') as RequestHandler, partsRouter);
app.use('/models', authenticate('models') as RequestHandler, modelsRouter);
app.use('/lines', authenticate('planning') as RequestHandler, linesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
