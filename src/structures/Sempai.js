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
        this.cmdDir = '../modules/commands';
        this.evntDir = '../modules/events';
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
        return console.log(`[SEMPAI - ALERT | LOG] (${moment(Date.now()).format('hh:mm A, DDDD')}): ${msg}`);
    }

    /* Logs the bot out from Discord. */
    async logout() {
        await log(`Logged out ${super.user.tag} from Discord...`);
        return process.exit(1);
    }

    /** Logs an informative related message to console.
     * @param {String} msg - The message to log.
     */
    async info(msg) {
        return console.log(`[SEMPAI - ALERT | INFO] (${moment(Date.now()).format('hh:mm A, DDDD')}): ${msg}`);
    }

    /** Logs a waning related message to console.
     * @param {String} msg - The message to log.
     */
    async warn(msg) {
        return console.log(`[SEMPAI - ALERT | WARN] (${moment(Date.now()).format('hh:mm A, DDDD')}): ${msg}`);
    }

    /** Logs a error related message to console.
     * @param {String} name - The error type to log.
     * @param {String} msg - The message to log.
     */
    async error(name, msg) {
        return console.log(`[SEMPAI - ERROR | ${name}] (${moment(Date.now()).format('hh:mm A, DDDD')}): ${msg}`);
    }

    /* Loads all events from the events directory/folder. */
    getEvents() {
        const folders = readdirSync(resolve(`${__dirname}/${this.evntDir}`));
        for (const folder of folders) {
            const files = readdirSync(resolve(`${__dirname}/${this.evntDir}/${folder}`)).filter(
                f =>
                    f.endsWith('.js')
            );
            for (const file of files) {
                const event = require(resolve(`${__dirname}/${this.evntDir}/${folder}/${file}`));
                const name = event.name ? event.name : file.split('.')[0];
                this.on(name, event.run.bind(null, this));
            }
        }
    }

    /* Loads all commands from the commands directory/folder. */
    
}