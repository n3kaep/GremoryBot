const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  id: "ticket_claim",
  async execute(interaction) {
    // Verifica permissão
    if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
      return interaction.reply({ content: "🚫 Apenas staff pode assumir tickets.", ephemeral: true });
    }

    // Muda o tópico
    await interaction.channel.setTopic(`📌 Assumido por: ${interaction.user.tag}`).catch(() => {});

    // Avisa
    const embed = new PremiumEmbed()
      .setDescription(`📌 Este ticket foi assumido por ${interaction.user}.`);

    await interaction.reply({ embeds: [embed] });
  },
};