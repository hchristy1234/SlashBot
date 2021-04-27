const DiscordJS = require('discord.js')
require('dotenv').config()

const guildId = '579459691269193732'
const client = new DiscordJS.Client()

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

client.on('ready', async () => {
    console.log('The bot is ready')

    const commands = await getApp(guildId).commands.get()
    console.log(commands)

    // ping -> pong
    await getApp(guildId).commands.post({
        data: {
            name: 'ping',
            description: 'A simple ping pong command',
        }
    })

    await getApp(guildId).commands.post({
        data: {
            name: 'testcommand',
            description: 'Me testing how this works',
            options: [
                {
                    name: 'Password',
                    description: 'Password required',
                    required: true,
                    type: 3
                }
            ]
        }
    })

    await getApp(guildId).commands.post({
        data: {
            name: 'embed',
            description: 'Displays an embed',
            options: [
                {
                    name: 'Name',
                    description: 'Your name',
                    required: true,
                    type: 3 // string
                },
                {
                    name: 'Age',
                    description: 'Your age',
                    required: false,
                    type: 4 // integer
                }
            ]
        }
    })

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data

        const command = name.toLowerCase()

        const args = {}
        
        console.log(options)

        if (options) {
            for (const option of options) {
                const { name, value } = option
                args[name]  = value
            }
        }

        console.log(args)

        if (command === 'ping') {
            reply(interaction, 'pong')
        } else if (command === 'embed') {
            const embed = new DiscordJS.MessageEmbed()
                .setTitle('Example Embed')
            
            for (const arg in args) {
                const value = args[arg]
                embed.addField(arg, value)
            }
        } else if (command === 'testcommand') {
            for (const arg in args) {
                const value = args[arg]
            }
            if (value === 'yuh') {
                reply(interaction, 'this works')
            }
            else {
                reply(interaction, 'wrong password')
            }
        }
    })
})

const reply = (interaction, response) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data:{
                content: response,
            }
        }
    })
}

client.login(process.env.TOKEN)
