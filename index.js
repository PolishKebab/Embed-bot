const {Client,Collection} = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const ints = require('./data/intents.json');
const bot = new Client({intents:[ints]});
bot.config = require('./data/config.json')
bot.commands=new Collection()
bot.embeds=new Collection()
const fs=require('fs');
for(let r of fs.readdirSync('./events')){
    bot.on(r.split('.')[0],(...arr)=>{
        const env=require(`./events/${r}`)
        async function ran(){await env(bot,...arr)}
        ran()
    })
}
for(let command of fs.readdirSync('./commands')){
    const cmd=require(`./commands/${command}`)
    bot.commands.set(cmd.data.name,cmd)
}
bot.login(bot.config.token);