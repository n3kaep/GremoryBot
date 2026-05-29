const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Gremory Bot está online e funcionando!');
});

app.listen(port, () => {
  console.log(`🟢 Servidor web ouvindo na porta ${port}`);
});

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();
client.buttons = new Collection();

// Load commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Load buttons
const buttonsPath = path.join(__dirname, "buttons");
const buttonFiles = fs.readdirSync(buttonsPath).filter((f) => f.endsWith(".js"));
for (const file of buttonFiles) {
  const button = require(path.join(buttonsPath, file));
  client.buttons.set(button.id, button);
}

// Load events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

// AntiCrash
require("./Handlers/AntiCrash")(client);

// Login
client.login(process.env.TOKEN);