const { Client, GatewayIntentBits } = require("discord.js");
const { CommandKit } = require("commandkit");
const path = require("path");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

new CommandKit({
    client,
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
    validationsPath: path.join(__dirname, 'validations'),
    devGuildIds: [process.env.GUILD_ID],
    bulkRegister: true,
});

client.login(`${process.env.DISCORD_TOKEN}`);