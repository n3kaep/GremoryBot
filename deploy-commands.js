require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];
const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  // Verificação de segurança
  if (!command.data) {
    console.log(`[AVISO] O arquivo ${file} está vazio ou incorreto. Pulando...`);
    continue;
  }

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🔄 Registrando ${commands.length} comandos...`);

    // COLOQUE SEUS IDs REAIS AQUI
    await rest.put(
      Routes.applicationGuildCommands(
        "1509712362557542490", // Ex: "123456789012345678"
        "1509714634129539152" // Ex: "987654321098765432"
      ),
      { body: commands }
    );

    console.log("✅ Comandos registrados com sucesso!");
  } catch (error) {
    console.error(error);
  }
})();