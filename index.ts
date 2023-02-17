import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import cors from 'cors';
import sendMessage from './utils/sendMessage';
import { isFakeEmail } from 'fakefilter';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/rephrase', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const promptQuestion = `Rephrase using highly sophisticated language: ${prompt}`;
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: promptQuestion,
      temperature: 0.2,
      max_tokens: 1990,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (!response.data.choices[0].text)
      return res.status(422).json({ message: 'Invalid response' });
    const responseText = response.data.choices[0].text;
    const newText = responseText?.replace(/\n/g, '');

    res.status(200).json({ data: newText });
  } catch (err) {
    console.log('error', err);
    res.status(422).json(err);
  }
});

app.post('/generateemail', async (req: Request, res: Response) => {
  const { recipient, description, sender, tone, promotion } = req.body;
  const prompt = `write a ${tone} email for informing ${recipient}, 
  ${promotion ? `promotes business and want support of ${recipient}` : ''},
  description of ${description}, from sender named ${sender}`;
  try {
    console.log('prompt', prompt);
    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 1990,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (!response.data.choices[0].text)
      return res.status(422).json({ message: 'Invalid response' });
    const responseText = response.data.choices[0].text;

    res.status(200).json({ data: responseText });
  } catch (err) {
    console.log('error', err);
    res.status(422).json(err);
  }
});

const checkEmails = async (emails: any) => {
  console.log('emails', emails);
  const results = await Promise.all(
    await emails?.map(async (email: string) => isFakeEmail(email))
  );
  const emailIdx = results.filter((el) => el);
  const filteredEmails = emailIdx.filter((el) => {
    return el !== null && el !== undefined;
  });
  return [...new Set(filteredEmails)];
};

app.post('/sendmsg', async (req: Request, res: Response) => {
  const { html, emails } = req.body;
  try {
    const decodeMsg = atob(html);
    // console.log('decodeMsg', decodeMsg);
    const emailErr = await checkEmails(emails);
    if (emailErr.length) {
      return res
        .status(422)
        .json({ message: 'Found invalid email', data: emailErr });
    }

    const options = {
      to: emails,
      subject: 'Template message',
      html: decodeMsg,
    };

    // return res.json('taguro');

    const sendMsg = await sendMessage(options);

    res.status(200).json({ message: 'Successfully sent' });
  } catch (err) {
    console.log('error', err);
    res.status(422).json(err);
  }
});

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Alive alive',
    key: process.env.OPENAI_API_KEY ? true : false,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
