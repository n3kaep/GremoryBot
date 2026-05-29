const fs = require("fs");
const path = require("path");

// Mapa para armazenar cooldown
const cooldowns = new Map();

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    
    // --- SISTEMA DE COOLDOWN (Anti-Spam) ---
    const userId = interaction.user.id;
    const now = Date.now();
    const cooldownAmount = 3000; // 3 segundos de cooldown entre interações

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        // Ignora silenciosamente ou avisa (pode remover o return se quiser permitir spam)
        return interaction.reply({ 
            content: `⏳ Calma! Espere ${timeLeft.toFixed(1)} segundos antes de usar outro comando.`, 
            ephemeral: true 
        }).catch(() => {});
      }
    }
    cooldowns.set(userId, now);
    setTimeout(() => cooldowns.delete(userId), cooldownAmount);
    // ---------------------------------------

    // Comandos Slash
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error("Erro no comando:", error);
        if (!interaction.replied) {
          await interaction.reply({ content: "❌ Erro ao executar comando.", ephemeral: true });
        }
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
        if (!interaction.replied) {
          await interaction.reply({ content: "❌ Erro ao executar ação.", ephemeral: true });
        }
      }
    }
  },
};