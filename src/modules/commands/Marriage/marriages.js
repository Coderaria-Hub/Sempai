const moment = require('moment');
const db = require('quick.db');
const {
    stripIndents
} = require('common-tags');

module.exports = {
    /* Command Run Settings */
    category: 'Marriage',
    name: 'marriages',
    aliases: 'marrys',
    usage: 'sp.marriages',
    description: 'Displays the amount of marriages and the last marriage.',
    access: 'Members',

    /* Other Command Settings */
    disabled: false,
    deleteInvoke: false,
    args: false,
    guildBound: true,
    helperBound: false,
    modBound: false,
    adminBound: false,
    devBound: false,

    async execute(message) {
        let { client, channel, guild } = message;
        let gCount = await db.fetch(`marriages_global`);
        let sCount = await db.fetch(`marriages_${guild.id}`);
        let lastD = await db.fetch(`lastMarry`);
        let lastMarry1 = await db.fetch(`married_last_user_1`);
        let lastMarry2 = await db.fetch(`married_last_user_2`);

        const embed = new client.Embed().main('Marriages', stripIndents`
            Last marriage was executed at ${moment(lastD).format('hh:mm A [on] dddd [in] MMMM, YYYY')}
            The lucky ones were ${client.users.get(lastMarry1).tag} & ${client.users.get(lastMarry2).tag}
        `)
          .addField('Server Marriages', sCount, true)
          .addField('Global Marriages', gCount, true);

        client.delete(channel, embed, 25000);
    }
}