const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const PremiumEmbed = require("../utils/EmbedBuilder");
const StoreData = require("../database/schemas/StoreSchema");

module.exports = {
  data: new SlashCommandBuilder().setName("painel").setDescription("Mostra o painel da loja"),
  async execute(interaction) {
    // Busca dados do banco, se não tiver, cria um padrão
    let data = await StoreData.findOne();
    if (!data) data = new StoreData();

    const totalStock = data.stockItems.reduce((acc, item) => acc + item.quantity, 0);

    const embed = new PremiumEmbed()
      .setTitle("🛒 GREMORY STORE — PAINEL")
      .setDescription(
        "```ansi\n[2;31m➜ Robux via Gamepass\n➜ Entrega rápida e segura\n➜ Atendimento 24/7\n➜ Loja verificada[0m\n```"
      )
      .addFields(
        { name: "📦 Estoque Atual", value: `${totalStock} Robux`, inline: true },
        { name: "⏱ Tempo de Entrega", value: "5-15 Min", inline: true },
        { name: "⭐ Avaliação Média", value: `${data.averageRating.toFixed(1)}/5.0`, inline: true },
        { name: "💳 Pagamento", value: "PIX", inline: true },
        { name: "🎟 Suporte", value: "24/7", inline: true },
        { name: "🔥 Status", value: totalStock > 0 ? "🟢 Online" : "🔴 Offline", inline: true }
      )
      // Seu GIF principal
      .setImage("https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc0N2xhbmR6aHg3MGZra2Fhbzh0eml5Ymp6dTBkanA3NnA3NW1rZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dDzcbYi058lJS/giphy.gif");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("criar_ticket").setLabel("Abrir Ticket").setEmoji("🎟").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("ver_estoque").setLabel("Estoque").setEmoji("📦").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("ver_feedback").setLabel("Feedbacks").setEmoji("⭐").setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};