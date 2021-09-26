// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES);

const client = new Client({ intents: myIntents});

client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    //client.user.setAvatar('./image/saltcan.png').then((user) => { console.log('new avater set'); }).catch(console.error);
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

//Command handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() || !interaction.inGuild()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    } catch(error) {
        console.error(error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
    }
});

// Login to Discord with your client's token
client.login(token);
