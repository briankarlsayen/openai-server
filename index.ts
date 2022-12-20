import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json())

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/rephrase', async(req: Request, res: Response) => {
  const { prompt } = req.body;
  const promptQuestion = `Rephrase using highly sophisticated language: ${prompt}`
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: promptQuestion,
      temperature: 0.2,
      max_tokens: 1990,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if(!response.data.choices[0].text) return res.status(422).json({ message: "Invalid response"});
    const responseText = response.data.choices[0].text;
    const newText = responseText?.replace(/\n/g, '')

    res.status(200).json({data: newText})
  } catch (err) {
    console.log('error', err)
    res.status(422).json(err)
  }
});

app.get('/', async(req: Request, res: Response) => {
  res.status(200).json({message: "Alive alive"});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});