const transcript = require("discord-html-transcripts");
const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  id: "fechar_ticket",
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    // 1. Gerar o Transcript (HTML)
    const attachment = await transcript.createTranscript(interaction.channel, {
      limit: -1,
      returnType: 'attachment',
      filename: `transcript-${interaction.channel.name}.html`,
      saveImages: true,
      poweredBy: false
    });

    // 2. Enviar para o Canal de Logs com o arquivo
    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      const logEmbed = new PremiumEmbed()
        .setTitle('🔒 Ticket Fechado')
        .addFields(
          { name: 'Fechado por', value: `${interaction.user}`, inline: true },
          { name: 'Ticket', value: `${interaction.channel.name}`, inline: true }
        );

      logChannel.send({ embeds: [logEmbed], files: [attachment] });
    }

    // 3. Fechar o ticket
    await interaction.editReply({ content: '🔒 Ticket fechado! Transcript salvo nos logs.' });
    
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  },
};