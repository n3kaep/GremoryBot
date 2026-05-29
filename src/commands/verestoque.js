const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const PremiumEmbed = require("../utils/EmbedBuilder");
const StoreData = require("../database/schemas/StoreSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verestoque")
    .setDescription("Ver estoque atual (Admin)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const data = await StoreData.findOne() || new StoreData();
    
    if (data.stockItems.length === 0) {
        return interaction.reply({ content: "📦 Estoque vazio.", ephemeral: true });
    }

    const list = data.stockItems.map(i => `**${i.name}**: ${i.quantity} un`).join("\n");
    const embed = new PremiumEmbed()
        .setTitle("📦 Gerenciamento de Estoque")
        .setDescription(`\`\`\`\n${list}\n\`\`\``);
        
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};