const transcript = require('discord-html-transcripts');
const PremiumEmbed = require('../utils/EmbedBuilder');

module.exports = {
    id: 'ticket_transcript',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const attachment = await transcript.createTranscript(interaction.channel, {
            limit: -1,
            returnType: 'attachment',
            filename: `ticket-${interaction.channel.name}.html`,
            saveImages: true,
            poweredBy: false
        });
        
        const embed = new PremiumEmbed().setDescription('📄 Transcript gerado com sucesso!');
        await interaction.editReply({ embeds: [embed], files: [attachment] });
    }
};