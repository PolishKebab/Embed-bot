const {SlashCommandBuilder}=require("@discordjs/builders")
const {MessageEmbed, WebhookClient}=require("discord.js")
module.exports={
    data:new SlashCommandBuilder().setName("embed").setDescription("Command for embed generation and sending")
        .addSubcommand(o=>
            o.setName("generate").setDescription("Generate your embed").addStringOption(a=>a.setName("color").setDescription("Set embed color (must be hex)"))
        ).addSubcommand(o=>
            o.setName("edit").setDescription("Edit the embed")
                .addStringOption(a=>a.setName("color").setDescription("Set embed color (must be hex)"))
                .addStringOption(a=>a.setName("description").setDescription("Set embed description"))
                .addStringOption(a=>a.setName("image").setDescription("Set embed image"))
                .addStringOption(a=>a.setName("thumbnail").setDescription("Set embed thumbnail"))
                .addStringOption(a=>a.setName("footer").setDescription("Set embed footer"))
                .addStringOption(a=>a.setName("title").setDescription("Set embed title"))
        ).addSubcommand(o=>
            o.setName("preview").setDescription("Preview your embed")
        ).addSubcommand(o=>
            o.setName("help").setDescription("Check how to do certain stuff")  
        ).addSubcommand(o=>
            o.setName("send").setDescription("Send the embed")
                .addStringOption(a=>a.setName("webhook").setDescription("Input webhook url"))
        ),
    async execute(bot,interaction){
        const subcommand = interaction.options.getSubcommand()
        let embed = bot.embeds.get(interaction.user.id)||new MessageEmbed()
        const color = interaction.options.getString("color")
        const description = interaction.options.getString("description")?.split("\\n")
        const image = interaction.options.getString("image")
        const thumbnail = interaction.options.getString("thumbnail")
        const footer= interaction.options.getString("footer")
        const title = interaction.options.getString("title")
        if(subcommand=="generate"){
            embed=new MessageEmbed()
            if(color&&color.startsWith("#")&&color.length==7){
                embed.setColor(color)
            }else if(color){
                return await interaction.reply("Invalid color hex")
            }
            if(color){
                await interaction.reply({content:`Generated embed ${color?`with color ${color}`:""}`,ephemeral:true})
            }
        }
        if(subcommand=="edit"){
            try{
                if(title)embed.setTitle(title)
                if(description)embed.setDescription(`${description.join("\n")}`)
                if(color)embed.setColor(color)
                if(image)embed.setImage(image)
                if(thumbnail)embed.setThumbnail(thumbnail)
                if(footer)embed.setFooter({text:`${footer}`})
                interaction.reply({content:"Look after changes:",embeds:[embed],ephemeral:true})
            }catch(e){
                interaction.reply(e)
            }
        }
        if(subcommand=="preview"){
            if(!embed.description){
                return await interaction.reply({content:"You need to set a description first",ephemeral:true})
            }
            await interaction.reply({content:"Embed preview:",embeds:[embed],ephemeral:true})
        }
        if(subcommand=="help"){
            const helpEmbed = new MessageEmbed()
            helpEmbed.setTitle("FAQ")
            helpEmbed.addField("How to add new lines?","It's easy, simply use \\n and after that the further text will appear below.")
            helpEmbed.addField("How to create a embed?","Run the /embed generate command")
            helpEmbed.addField("How to edit the embed?","Run the /embed edit command")
            helpEmbed.addField("How to send the embed?","Run the /embed send command along with a webhook url")
            helpEmbed.addField("How to get the embed url?","Go to: Channel Settings>Integrations>Click the webhook>Click webhook url button")
            await interaction.reply({embeds:[helpEmbed],ephemeral:true})
        }
        if(subcommand=="send"){
            const webhookUrl = interaction.options.getString("webhook")
            const webhook = new WebhookClient({ url: webhookUrl})
            webhook.send({embeds:[embed]})
        }
        bot.embeds.set(interaction.user.id,embed)
    }
}