const PremiumEmbed = require("../utils/EmbedBuilder");
const StoreData = require("../database/schemas/StoreSchema");

module.exports = {
  id: "ver_estoque",
  async execute(interaction) {
    const data = await StoreData.findOne() || new StoreData();
    if (data.stockItems.length === 0) return interaction.reply({ content: "📦 Estoque vazio.", ephemeral: true });

    const list = data.stockItems.map(i => `**${i.name}**: ${i.quantity} un`).join("\n");
    const embed = new PremiumEmbed().setTitle("📦 Estoque Atual").setDescription(list);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};