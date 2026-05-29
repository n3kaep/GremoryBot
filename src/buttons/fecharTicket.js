const transcript = require("discord-html-transcripts");
const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  id: "fechar_ticket",
  async execute(interaction) {
    
    // 1. Responde imediatamente que está processando
    await interaction.deferReply({ ephemeral: true });

    try {
        // 2. Gera o Transcript (Com saveImages: false para evitar o erro de React)
       const attachment = await transcript.createTranscript(interaction.channel, {
      limit: -1,
      returnType: 'attachment',
       filename: `transcript-${interaction.channel.name}.html`,
       saveImages: false, // <- ALTERAÇÃO IMPORTANTE
      poweredBy: false
});

        // 3. Envia para o Log
        const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
        if (logChannel) {
            const logEmbed = new PremiumEmbed()
                .setTitle('🔒 Ticket Fechado')
                .addFields(
                    { name: 'Fechado por', value: `${interaction.user}`, inline: true },
                    { name: 'Ticket', value: `${interaction.channel.name}`, inline: true }
                );
            logChannel.send({ embeds: [logEmbed], files: [attachment] }).catch(() => {});
        }

        // 4. Edita a resposta original
        await interaction.editReply({ content: '🔒 Ticket fechado! Transcript salvo nos logs.' });
        
        // 5. Deleta o canal
        setTimeout(() => {
            interaction.channel.delete().catch(() => {});
        }, 5000);

    } catch (error) {
        console.error("Erro ao fechar ticket:", error);
        await interaction.editReply({ content: "❌ Erro ao gerar transcript ou fechar." });
    }
  },
};