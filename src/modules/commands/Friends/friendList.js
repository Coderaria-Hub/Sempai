const moment = require('moment');
const db = require('quick.db');
const {
    stripIndents
} = require('common-tags');

module.exports = {
    /* Command Run Settings */
    category: 'Friends',
    name: 'friendlist',
    aliases: ['friendl', 'flist', 'fl'],
    usage: 'sp.friendlist [Page]',
    description: 'Look at your friend list, like how many friends you have and who they are.',
    access: 'Members',

    /* Other Command Settings */
    disabled: false,
    deleteInvoke: false,
    args: true,
    guildBound: true,
    helperBound: false,
    modBound: false,
    adminBound: false,
    devBound: false,

    async execute(message, args) {
        let { client, author, channel, guild } = message;
        let friends = await db.fetch(`friends_${author.id}_${guild.id}`);

        const embed = new client.Embed().main('Friend List', stripIndents`
            Displaying ${author.tag}'s friend list
        `)
          .addField('Friends', friends.forEach(f => f.tag));

        client.delete(channel, embed, 30000);
    }
}