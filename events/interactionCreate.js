module.exports=async(bot,interaction)=>{
    if(interaction.isCommand()){
        console.log(`[${interaction.user.tag}]: executed /${interaction.commandName}`)
        const command=bot.commands.get(interaction.commandName)
        if(!command) return;
        try{
            await command.execute(bot,interaction)
        }catch(e){
            console.log(e);interaction.reply({content:"An error has occured",ephemeral:true})
        }
    }
}
