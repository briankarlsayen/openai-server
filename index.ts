import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import routes from './src/routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();
const port = process.env.PORT;
const key = process.env.OPENAI_API_KEY ? true : false;
app.use(express.json());
app.use(cors());

// * routes
app.get('/', async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Alive alive',
    key,
  });
});
app.use('/api', routes);

// * error hander middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
