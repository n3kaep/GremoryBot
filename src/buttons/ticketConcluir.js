const StoreData = require("../database/schemas/StoreSchema");
const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  id: "ticket_concluir",
  async execute(interaction) {
    // Verifica se é staff
    if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
      return interaction.reply({ content: "🚫 Apenas staff pode concluir vendas.", ephemeral: true });
    }

    try {
      // 1. Atualiza o banco (+1 venda)
      let data = await StoreData.findOne();
      if (!data) data = new StoreData();
      data.totalSales += 1;
      await data.save();

      // 2. Avisa no ticket
      await interaction.reply({ content: "✅ Venda concluída! Fechando em 5 segundos...", ephemeral: true });

      // 3. Envia Log (Sem transcript)
      const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
      if (logChannel) {
        const logEmbed = new PremiumEmbed()
          .setTitle("💰 Venda Concluída")
          .setDescription("Uma venda foi finalizada com sucesso.")
          .addFields(
            { name: "Staff", value: `${interaction.user}`, inline: true },
            { name: "Canal", value: `${interaction.channel.name}`, inline: true }
          );
        logChannel.send({ embeds: [logEmbed] });
      }

      // 4. Deleta o canal
      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 5000);

    } catch (error) {
      console.error("Erro ao concluir:", error);
      if (!interaction.replied) {
        await interaction.reply({ content: "❌ Erro ao concluir.", ephemeral: true });
      }
    }
  },
};