module.exports = (client) => {
  process.on("unhandledRejection", (reason) => {
    console.error("Evento: unhandledRejection", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("Evento: uncaughtException", error);
  });

  client.on("error", (error) => {
    console.error("Discord.js Client error:", error);
  });
};