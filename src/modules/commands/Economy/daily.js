const db = require('quick.db');
const ms = require('parse-ms');
const {
    stripIndents
} = require('common-tags');

module.exports = {
    /* Command Run Settings */
    category: 'Economy',
    name: 'daily',
    aliases: ['payday', 'paydaily'],
    usage: 'sp.daily',
    description: 'Pays you your daily credits.',
    access: 'Members',

    /* Other Command Settings */
    disabled: false,
    args: false,
    guildBound: true,
    helperBound: false,
    modBound: false,
    adminBound: false,
    devBound: false,

    async execute(message) {
        const { client, author, channel, guild } = message;

        let cooldown = 86400000;
        let amount = 240;
        let daily = await db.fetch(`daily_${author.id}_${guild.id}`);
        
        if (cooldown - (Date.now() - daily) > 0) {
            let obj = ms(cooldown - (Date.now() - daily));
            client.delete(channel, new client.Embed().error('Time Ongoing', stripIndents`
                ${author.tag}, you still have to wait ${obj.hours}h ${obj.minutes}m ${obj.seconds}s
            `), 25000);
        } else {
            client.delete(channel, new client.Embed().correct('Money Claimed', stripIndents`
                ${author.tag} successfully claimed their daily $200.
            `), 25000);

            db.set(`daily_${author.id}_${guild.id}`, Date.now());
            db.add(`balance_${author.id}_${guild.id}`, amount);
        }
    }
}