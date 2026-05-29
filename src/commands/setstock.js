const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const StoreData = require("../database/schemas/StoreSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstock")
    .setDescription("Adiciona estoque (Admin)")
    .addStringOption(opt => opt.setName("nome").setDescription("Nome do item").setRequired(true))
    .addIntegerOption(opt => opt.setName("quantidade").setDescription("Quantidade").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const nome = interaction.options.getString("nome");
    const quantidade = interaction.options.getInteger("quantidade");

    let data = await StoreData.findOne();
    if (!data) data = new StoreData();

    // Lógica simples: adiciona ao estoque
    const itemIndex = data.stockItems.findIndex(i => i.name.toLowerCase() === nome.toLowerCase());
    if (itemIndex > -1) {
        data.stockItems[itemIndex].quantity += quantidade;
    } else {
        data.stockItems.push({ name: nome, quantity: quantidade, price: 0 });
    }

    await data.save();
    await interaction.reply({ content: `✅ Estoque atualizado! Adicionado ${quantidade}x ${nome}.`, ephemeral: true });
  },
};