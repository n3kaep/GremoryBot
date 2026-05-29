const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("🔴 Erro na conexão MongoDB:", error);
    process.exit(1);
  }
};