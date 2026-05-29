const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  id: "ticket_claim",
  async execute(interaction) {
    // Verifica se é staff
    if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
      return interaction.reply({ content: "🚫 Apenas staff pode assumir tickets.", ephemeral: true });
    }

    // 1. Muda o tópico do canal para mostrar quem assumiu
    await interaction.channel.setTopic(`📌 Assumido por: ${interaction.user.tag}`);

    // 2. Avisa no canal do ticket
    const embed = new PremiumEmbed()
      .setDescription(`📌 Este ticket foi assumido por ${interaction.user}.`)
      .setColor(0xff003c);

    await interaction.reply({ embeds: [embed] });

    // 3. Envia Log
    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
        const logEmbed = new PremiumEmbed()
            .setTitle('📌 Log: Ticket Assumido')
            .addFields(
                { name: 'Staff', value: `${interaction.user}`, inline: true },
                { name: 'Ticket', value: `${interaction.channel}`, inline: true }
            );
        logChannel.send({ embeds: [logEmbed] });
    }
  },
};