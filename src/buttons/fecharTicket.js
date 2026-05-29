const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  id: "fechar_ticket",
  async execute(interaction) {
    try {
      // 1. Responde que está fechando
      await interaction.reply({ content: "🔒 Fechando o ticket em 5 segundos...", ephemeral: true });

      // 2. Envia Log (Sem transcript)
      const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
      if (logChannel) {
        const logEmbed = new PremiumEmbed()
          .setTitle("🔒 Ticket Fechado")
          .setDescription("O ticket foi fechado sem transcript (função desativada).")
          .addFields(
            { name: "Fechado por", value: `${interaction.user}`, inline: true },
            { name: "Canal", value: `${interaction.channel.name}`, inline: true }
          );
        logChannel.send({ embeds: [logEmbed] });
      }

      // 3. Deleta o canal
      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 5000);

    } catch (error) {
      console.error("Erro ao fechar:", error);
      if (!interaction.replied) {
        await interaction.reply({ content: "❌ Erro ao fechar.", ephemeral: true });
      }
    }
  },
};