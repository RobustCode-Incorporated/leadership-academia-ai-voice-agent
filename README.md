# 🤖 Leadership Academia Voice Bot

Ce projet est un agent vocal intelligent pour répondre automatiquement aux appels téléphoniques de Leadership Academia à Kinshasa.

## 🚀 Démarrage rapide

```bash
npm install
npm start
```

Utilisez `ngrok` pour exposer votre serveur local à Twilio :

```bash
npx ngrok http 3000
```

Configurez l’URL dans Twilio comme : `https://xxxx.ngrok.io/voice`

## 🔐 Configuration
Créer un fichier `.env` :

```
OPENAI_API_KEY=ta_clé_openai
```
