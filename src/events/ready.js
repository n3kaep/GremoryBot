const { ActivityType } = require("discord.js");
const connectDB = require("../database/connect");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`🟢 Bot logado como ${client.user.tag}`);
    await connectDB();

    // Define a presença usando o Status Customizado (o que funciona para Bots)
    client.user.setPresence({
      activities: [
        {
          name: "customstatus", // Obrigatório para o Discord entender que é um status customizado
          type: ActivityType.Custom,
          state: "🔴 Comprando na Gremory Store | ⚡", // Texto com emojis que aparece direto no perfil
        },
      ],
      status: "online",
    });

    console.log("🔴 Status Customizado da Rias configurado com sucesso!");
  },
};