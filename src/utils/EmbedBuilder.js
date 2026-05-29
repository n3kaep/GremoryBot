const { EmbedBuilder } = require("discord.js");

// GIF padrão da Rias Gremory (o que você gostou)
const DEFAULT_THUMBNAIL = "https://c.tenor.com/JtUYt8wWqZMAAAAd/tenor.gif";

class PremiumEmbed extends EmbedBuilder {
  constructor() {
    super();
    
    // Ano automático
    const currentYear = new Date().getFullYear();

    this.setColor(0xff003c) // Vermelho Gremory
      .setFooter({ text: `Gremory Store © ${currentYear} | Premium Service` })
      .setTimestamp()
      .setThumbnail(DEFAULT_THUMBNAIL); // Define a Rias como padrão
  }
}

module.exports = PremiumEmbed;