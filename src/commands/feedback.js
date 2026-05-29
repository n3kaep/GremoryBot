const { SlashCommandBuilder } = require("discord.js");
const StoreData = require("../database/schemas/StoreSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Avalie a loja")
    .addIntegerOption(opt => opt.setName("nota").setDescription("Nota de 1 a 5").setRequired(true).setMinValue(1).setMaxValue(5)),

  async execute(interaction) {
    const nota = interaction.options.getInteger("nota");
    let data = await StoreData.findOne();
    if (!data) data = new StoreData();

    // Cálculo simples de média
    const totalVotos = data.totalSales + 1;
    const novaMedia = ((data.averageRating * data.totalSales) + nota) / totalVotos;
    
    data.averageRating = novaMedia;
    data.totalSales = totalVotos; // Reutilizando campo para contar votos
    await data.save();

    await interaction.reply({ content: `⭐ Obrigado por avaliar! Você deu nota ${nota}.`, ephemeral: true });
  },
};