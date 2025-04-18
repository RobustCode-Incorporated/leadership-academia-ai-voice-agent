require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const { twiml: { VoiceResponse } } = require('twilio');

const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.urlencoded({ extended: false }));

app.post('/voice', async (req, res) => {
  const transcription = req.body.SpeechResult || "Rien entendu.";
  const response = new VoiceResponse();

  try {
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Un étudiant appelle l'université à Kinshasa et dit : "${transcription}". Réponds comme un assistant administratif poli, professionnel et utile.`
      }]
    });

    const reply = gptResponse.choices[0].message.content;
    response.say({ voice: 'alice', language: 'fr-FR' }, reply);
    response.redirect('/voice'); // Boucle de conversation

  } catch (error) {
    response.say({ voice: 'alice', language: 'fr-FR' },
      "Désolé, je rencontre une difficulté technique. Veuillez réessayer plus tard.");
  }

  res.type('text/xml');
  res.send(response.toString());
});

app.listen(port, () => {
  console.log(`Bot vocal lancé sur http://localhost:${port}`);
});
