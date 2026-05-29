const PremiumEmbed = require("../utils/EmbedBuilder");
const StoreData = require("../database/schemas/StoreSchema");

module.exports = {
  id: "ver_feedback",
  async execute(interaction) {
    const data = await StoreData.findOne() || new StoreData();
    const embed = new PremiumEmbed()
      .setTitle("⭐ Avaliações")
      .addFields(
        { name: "Média", value: `${data.averageRating.toFixed(1)}/5.0`, inline: true },
        { name: "Votos", value: `${data.totalSales}`, inline: true }
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};