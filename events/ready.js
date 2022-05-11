const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const fs = require('fs')
module.exports=(bot)=>{
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    const commands = [];
    bot.application.commands.set([])
    for (const file of commandFiles) {
        
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
    }
    bot.user.setPresence({ activities: [{ name: '/help' }], status: 'idle' })
    const rest = new REST({ version: '9' }).setToken(bot.config.token);
    (async () => {
        try {
            console.log('Started refreshing guild application (/) commands.');
    
            await rest.put(
                Routes.applicationGuildCommands(bot.user.id, '935170777760813106'),
                { body: commands},
            );
    
            console.log('Successfully reloaded guild application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}
