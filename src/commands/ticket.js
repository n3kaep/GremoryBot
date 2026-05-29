const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  data: new SlashCommandBuilder().setName("ticket").setDescription("Painel de tickets"),
  async execute(interaction) {
    const embed = new PremiumEmbed()
      .setTitle("🎟 GREMORY SUPPORT")
      .setDescription(
        "## Atendimento Oficial\n\n" +
        "Clique no botão abaixo para abrir um ticket privado.\n\n" +
        "```diff\n" +
        "+ Compra de Robux\n" +
        "+ Suporte\n" +
        "+ Pagamentos\n" +
        "```"
      )
      // GIFs que você gostou
      .setThumbnail("https://c.tenor.com/JtUYt8wWqZMAAAAd/tenor.gif")
      .setImage("https://c.tenor.com/hmIXIBOswlIAAAAd/tenor.gif");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("criar_ticket").setLabel("Abrir Ticket").setEmoji("🎟").setStyle(ButtonStyle.Danger)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: "✅ Painel enviado!", ephemeral: true });
  },
};