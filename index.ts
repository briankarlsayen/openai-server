import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import routes from './src/routes';
import { errorHandler } from './middlewares/errorHandler';
import { connectDB } from './config/config';
import generate from './utils/generateMock';

const app: Express = express();
const port = process.env.PORT;
const key = process.env.OPENAI_API_KEY ? true : false;
app.use(express.json());
app.use(cors());
// console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
connectDB();

// * routes
app.get('/', async (_req: Request, res: Response) => {
  console.log('gaga');
  res.status(200).json({
    message: 'Alive alive',
    key,
  });
});

interface ICheckListData {
  title: string;
  schedules: number;
  template?: string;
  status?: string;
}

app.get('/checklists', async (_req: Request, res: Response) => {
  const mockData: ICheckListData[] = [
    {
      title: '1Place Standard Centre Closing Procedure // v1.1',
      schedules: 3,
      template: 'form',
      status: 'inactive',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.2',
      schedules: 4,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.3',
      schedules: 5,
      template: 'partner',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.4',
      schedules: 1,
      template: 'form',
      status: 'inactive',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.5',
      schedules: 8,
      template: 'form',
      status: 'inactive',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.6',
      schedules: 9,
      template: 'partner',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.7',
      schedules: 11,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.8',
      schedules: 2,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.9',
      schedules: 1,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.10',
      schedules: 8,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.11',
      schedules: 1,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.12',
      schedules: 1,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.13',
      schedules: 6,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.14',
      schedules: 1,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.15',
      schedules: 1,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.16',
      schedules: 4,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.17',
      schedules: 4,
      template: 'form',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.18',
      schedules: 4,
      template: 'partner',
      status: 'active',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.19',
      schedules: 3,
      template: 'form',
      status: 'inactive',
    },
    {
      title: '1Place Standard Centre Closing Procedure // v1.20',
      schedules: 7,
      template: 'form',
      status: 'active',
    },
  ];

  res.status(200).json({
    data: mockData,
  });
});

app.get('/names', async (_req: Request, res: Response) => {
  try {
    console.log('haha');
    const data = generate(8000);
    res.status(201).json(data);
  } catch (err) {
    res.status(422).json({ message: 'Unable to generate data' });
  }
});

app.use('/api', routes);

// * error hander middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
