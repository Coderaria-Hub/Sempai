const beautify = require('beautify');
const {
    inspect
} = require('util');
const hastebin = require('hastebin.js');
const bin = new hastebin();
const {
    COLORS: {
        correct,
        errors
    }
} = require('../../../structures/Constants');

module.exports = {
    /* Command Run Settings. */
    name: 'evaluate',
    aliases: ['eval', 'ev'],
    usage: 'sm.evaluate [Code To Run]',
    description: 'Runs a code by command inside a Discord chat.',
    access: 'Developers',

    /* Other Command Settings */
    deleteInvoke: true,
    args: true,
    guildBound: true,
    helperBound: false,
    modBound: false,
    adminBound: false,
    devBound: true,

    /* Command Running */
    async run(message, args) {



    }
}