const fs = require("fs");
const path = require("path");

const cooldowns = new Map();

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    
    // Cooldown
    const userId = interaction.user.id;
    const now = Date.now();
    const cooldownAmount = 3000;
    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + cooldownAmount;
      if (now < expirationTime) return; // Ignora silenciosamente se estiver em cooldown
    }
    cooldowns.set(userId, now);
    setTimeout(() => cooldowns.delete(userId), cooldownAmount);

    // Comandos Slash
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error("Erro no comando:", error);
        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: "❌ Erro ao executar comando." });
            } else {
                await interaction.reply({ content: "❌ Erro ao executar comando.", ephemeral: true });
            }
        } catch (e) { console.error("Erro crítico ao responder comando:", e) }
      }
    }

    // Botões
    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error("Erro no botão:", error);
        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: "❌ Ocorreu um erro ao processar esta ação." });
            } else {
                await interaction.reply({ content: "❌ Ocorreu um erro ao processar esta ação.", ephemeral: true });
            }
        } catch (e) { console.error("Erro crítico ao responder botão:", e) }
      }
    }
  },
};