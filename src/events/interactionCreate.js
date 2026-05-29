const fs = require("fs");
const path = require("path");

const cooldowns = new Map();

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    
    // --- SISTEMA DE COOLDOWN ---
    const userId = interaction.user.id;
    const now = Date.now();
    const cooldownAmount = 3000;

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({ 
            content: `⏳ Espere ${timeLeft.toFixed(1)} segundos.`, 
            ephemeral: true 
        }).catch(() => {});
      }
    }
    cooldowns.set(userId, now);
    setTimeout(() => cooldowns.delete(userId), cooldownAmount);
    // -----------------------

    // COMANDOS SLASH
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error("Erro no comando:", error);
        // Verifica se já respondeu ou adiou
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({ content: "❌ Erro ao executar comando." });
        } else {
          await interaction.reply({ content: "❌ Erro ao executar comando.", ephemeral: true });
        }
      }
    }

    // BOTÕES
    if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error("Erro no botão:", error);
        // CORREÇÃO AQUI: Verifica se já está "pensando" (deferred)
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({ content: "❌ Ocorreu um erro ao processar esta ação." });
        } else {
          await interaction.reply({ content: "❌ Ocorreu um erro ao processar esta ação.", ephemeral: true });
        }
      }
    }
  },
};