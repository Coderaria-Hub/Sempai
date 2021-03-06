const {
    stripIndents
} = require('common-tags');

module.exports = {
    /* Command Run Settings */
    category: 'Roleplay',
    name: 'hug',
    aliases: ['huggo', 'sendhug'],
    usage: 'sp.hug [User]',
    description: 'Give someone a warm hug :3',
    access: 'Members',

    /* Other Command Settings */
    disabled: false,
    args: true,
    deleteInvoke: true,
    guildBound: true,
    helperBound: false,
    modBound: false,
    adminBound: false,
    devBound: false,

    async execute(message, args) {
        let { client, author, channel, guild } = message;
        let user = await client.fetch('member', args.join(' '), guild);
        let gifs = [
            'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
            'https://media.giphy.com/media/cotftb3AXgfV6/giphy.gif',
            'https://media.giphy.com/media/wnsgren9NtITS/giphy.gif',
            'https://media.giphy.com/media/yziFo5qYAOgY8/giphy.gif',
            'https://media.giphy.com/media/HaC1WdpkL3W00/giphy.gif',
            'https://media.giphy.com/media/143v0Z4767T15e/giphy.gif',
            'https://media.giphy.com/media/kvKFM3UWg2P04/giphy.gif'
        ];

        let gif = gifs[Math.floor(Math.random() * gifs.length)];

        const embed = new client.Embed();

        if (user.id === client.user.id) return client.delete(channel, new client.Embed().error('Invalid Argument', 'You can\'t hug me ~:sob:'), 25000);
        if (user.id === author.id) return client.delete(channel, new client.Embed().error('Invalid Argument', 'You can\'t hug yourself ~:sob:'), 25000);

        try {
            embed.main('Hugged Member', stripIndents`
                ${message.member.displayName} hugged ${user.displayName} ~:heart:
            `)
              .setImage(gif);
        } catch(e) {
            embed.error('Error Occured', stripIndents`
                Please report this error using \`sp.error <Error Message>\`.
                \`\`\`css
                ${e.stack}
                \`\`\`

                ~ *Thank you for reporting it :3*
            `);
        }

        channel.send(embed);
    }
}