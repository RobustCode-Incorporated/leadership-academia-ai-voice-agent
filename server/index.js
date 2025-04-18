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
      messages: [
        {
          role: 'system',
          content: `Tu es UniGuide, une réceptionniste virtuelle d’université chaleureuse, accueillante et à l’écoute. Tu aides les futurs étudiants, parents ou visiteurs à obtenir les infos utiles sur : inscriptions, programmes, bourses, logement, vie étudiante, etc. Tu réponds comme un·e pote sympa, mais de façon claire. Utilise un langage informel, simple (niveau CE2), une seule question à la fois, pas de répétitions. Parle comme si tu étais en appel vocal. Ajoute parfois un emoji 🙂.`
        },
        {
          role: 'user',
          content: `Une personne appelle l’université à Kinshasa et dit : "${transcription}". Réponds-lui comme UniGuide.`
        }
      ]
    });

    const reply = gptResponse.choices[0].message.content;
    response.say({ voice: 'alice', language: 'fr-FR' }, reply);
    response.redirect('/voice'); // Boucle de conversation

  } catch (error) {
    console.error("Erreur GPT ou Twilio :", error);
    response.say({ voice: 'alice', language: 'fr-FR' },
      "Désolé, je rencontre une difficulté technique. Veuillez réessayer plus tard.");
  }

  res.type('text/xml');
  res.send(response.toString());
});

app.listen(port, () => {
  console.log(`Bot vocal UniGuide lancé sur http://localhost:${port}`);
});
