const StoreData = require("../database/schemas/StoreSchema");
const PremiumEmbed = require("../utils/EmbedBuilder");
const transcript = require("discord-html-transcripts");

module.exports = {
  id: "ticket_concluir",
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
      return interaction.reply({ content: "🚫 Apenas staff pode concluir vendas.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    // 1. Gerar Transcript
    const attachment = await transcript.createTranscript(interaction.channel, {
        limit: -1,
        returnType: 'attachment',
        filename: `transcript-${interaction.channel.name}.html`,
        saveImages: true,
        poweredBy: false
    });

    // 2. Atualizar Vendas (+1)
    let data = await StoreData.findOne();
    if (!data) data = new StoreData();
    data.totalSales += 1;
    await data.save();

    // 3. Enviar para Logs com Transcript
    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
        const logEmbed = new PremiumEmbed()
            .setTitle('💰 Venda Concluída')
            .addFields(
                { name: 'Staff', value: `${interaction.user}`, inline: true },
                { name: 'Ticket', value: `${interaction.channel.name}`, inline: true }
            );
        logChannel.send({ embeds: [logEmbed], files: [attachment] });
    }

    // 4. Fechar
    await interaction.editReply({ content: '✅ Venda concluída! Transcript salvo nos logs.' });
    
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  },
};