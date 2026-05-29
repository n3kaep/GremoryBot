const {
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const PremiumEmbed = require("../utils/EmbedBuilder");

module.exports = {
  id: "criar_ticket",
  async execute(interaction) {
    const exists = interaction.guild.channels.cache.find(
      (c) => c.name === `ticket-${interaction.user.username.toLowerCase()}`,
    );
    if (exists)
      return interaction.reply({
        content: "❌ Você já tem um ticket aberto.",
        ephemeral: true,
      });

    // Pega ID da categoria do .env ou cria uma
    let category = interaction.guild.channels.cache.get(
      process.env.TICKET_CATEGORY_ID,
    );
    if (!category) {
      category = await interaction.guild.channels.create({
        name: "🎟・tickets",
        type: ChannelType.GuildCategory,
      });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username.toLowerCase()}`,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        },
        {
          id: process.env.STAFF_ROLE_ID,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        },
      ],
    });

    const embed = new PremiumEmbed()
      .setTitle("🎫 Ticket Aberto")
      .setDescription(`${interaction.user}, aguarde atendimento.`)
      .addFields(
        { name: "👤 Cliente", value: `${interaction.user}`, inline: true },
        {
          name: "📅 Data",
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true,
        },
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel("Assumir")
        .setEmoji("📌")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("ticket_concluir") // NOVO BOTÃO
        .setLabel("Concluir Venda")
        .setEmoji("💰")
        .setStyle(ButtonStyle.Success), // Verde

      new ButtonBuilder()
        .setCustomId("fechar_ticket")
        .setLabel("Fechar")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Danger), // Vermelho
    );

    await channel.send({
      content: `<@&${process.env.STAFF_ROLE_ID}>`,
      embeds: [embed],
      components: [row],
    });
    await interaction.reply({
      content: `✅ Ticket criado: ${channel}`,
      ephemeral: true,
    });
    // Enviar Log
    const logChannel = interaction.guild.channels.cache.get(
      process.env.LOG_CHANNEL_ID,
    );
    if (logChannel) {
      const logEmbed = new PremiumEmbed()
        .setTitle("📋 Log de Ticket")
        .addFields(
          { name: "Ação", value: "Ticket Aberto", inline: true },
          { name: "Usuário", value: `${interaction.user}`, inline: true },
          { name: "Canal", value: `${channel}`, inline: true }, // CORRIGIDO AQUI
        );
      logChannel.send({ embeds: [logEmbed] });
    }
  },
};
