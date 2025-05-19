import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { characterInputSchema } from '../src/utils/zodSchemas';
import { generateCharacter } from './main';
import { runFlow } from '@genkit-ai/flow';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const parseResult = characterInputSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }

  try {
    const result = await runFlow(generateCharacter,
        {   name: parseResult.data.name,
            race: parseResult.data.race,
            clazz: parseResult.data.clazz,
            background: parseResult.data.background
        });
    return res.json(result);
  } catch (err: any) {
    console.error('Genkit error:', err);
    return res.status(500).json({ error: 'Character generation failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
