const {
    Client,
    Collection,
    Message,
    User,
    GuildMember,
    Role,
    Channel,
    Guild
} = require('discord.js');
const {
    resolve
} = require('path');
const {
    readdirSync
} = require('fs');
const moment = require('moment');
const Embed = require('./Embeds');
const {
    token
} = require('../../config.json');

class BotClient extends Client {
    constructor(options = {}) {
        super(options);
        this.token = token;
        this.prefix = 's.';
        this.devs = ['671374842951630858', '443097868694454282', '380967240515977218', '336608827484930050'];
        this.commands = new Collection();
        this.cmdDir = '../commands';
        this.evntDir = '../events';
        this.Embed = Embed;
    }

    /* Logs the bot into Discord. */
    async login() {
        return await super.login(this.token);
    }

    /** Logs a regular related message to console.
     * @param {String} msg - The message to log. 
     */
    async log(msg) {
        return console.log(`[SEMPAI - ALERT | LOG] (${moment(Date.now()).format('hh:mm A')}): ${msg}`);
    }
}