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
        await this.log(`Logged out ${super.user.tag} from Discord...`);
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
    processEvents() {
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
    processCommands() {
        const folders = readdirSync(resolve(`${__dirname}/${this.cmdDir}`));
        for (const folder of folders) {
            const files = readdirSync(resolve(`${__dirname}/${this.cmdDir}/${folder}`)).filter(
                f =>
                    f.endsWith('.js')
            );
            for (const file of files) {
                const command = require(resolve(`${__dirname}/${this.cmdDir}/${folder}/${file}`));
                const category = command.category ? command.category : folder;
                const name = command.name ? command.name : file.split('.')[0];
                this.commands.set(name, {
                    category,
                    ...command
                });
            }
        }
    }

    /** Captialises a word of a function.
     * @param {String} str - The starting word to captialise.
    */
    captialise(str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    }

    /** Deletes a Discord message after a certain specified time.
     * 
     * Default:
     * @param {...any} args - Arguments to manipulate.
     * 
     * Usage 1:
     * @param {instanceof Message} args[0] - The message to delete.
     * @param {Number=0} args[1] - The time to wait before deletion (milliseconds).
     * 
     * Usage 2:
     * @param {instanceof Channel} args[0] - The channel to send the message to.
     * @param {instanceof Message} args[1] - The message to delete.
     * @param {Number=0} args[2] - The time to wait before deletion (milliseconds).
     * 
     * Usage 3:
     * @param {instanceof Guild} args[0] - The guild to send the message to.
     * @param {instanceof Channel} args[1] - The channel to send the message to.
     * @param {instanceof Message} args[2] - The message to delete.
     * @param {Number=0} args[3] - The time to wait before deletion (milliseconds).
    */
    delete(...args) {
        let options = {};
        if (args[0] instanceof Message) {
            if (typeof args[1] === 'number') options.timeout = args[1];
            return args[0]
                          .delete(options).catch(
                                                 () => null
                                                );
        }

        if (args[0] instanceof Channel && args[1]) {
            if (typeof args[2] === 'number') options.timeout = args[2];
            return args[0]
                          .send(args[1])
                                        .then(
                                            m =>
                                                 m.delete(options)
                                              )
                                               .catch(
                                                      () => null
                                                      );
        }

        if (args[0] instanceof Guild && args[0] instanceof Channel) {
            if (typeof args[3] === 'number') options.timeout = args[3];
            return args[0]
                          .channels.get(args[1])
                                                .send(args[2])
                                                              .then(
                                                                    m =>
                                                                         m.delete(options)
                                                                    )
                                                                     .catch(
                                                                            () => null
                                                                     );
        }
    }

    /** Formats a string containing {} with the following arguments.
     * @param {String} str - The string to format.
     * @param {...any} args - Arguments in order of what {} should be replaced as.
    */
    format(str, ...args) {
        for (const arg of args) {
            str = str.replace(/{}/, arg);
        }
        return str;
    }

    /** Converts milliseconds into readable human numbers.
     * @param {Number} ms - The time in milliseconds to convert.
    */
    parseMilliSeconds(ms) {
        const round = ms > 0 ? Math.floor : Math.ceil;
        return {
            nanoSeconds: round(ms * 1e6) % 1000,
            microSeconds: round(ms * 1000) % 1000,
            milliseconds: round(ms) % 1000,
            seconds: round(ms / 1000) % 60,
            minutes: round(ms / 60000) % 60,
            hours: round(ms / 3600000) % 24,
            days: round(ms / 86400000)
        };
    }

    /** Resolves a user, member, role or channel.
     * @param {String} type - User, Member, Role or Channel.
     * @param {String} value - The value to resolve or fetch as a type.
     * @param {Object} guild - The guild to search for the member, role or channel.
    */
    async fetch(type, value, guild) {
        if (!value) return null;
        value = value.toLowerCase();
        switch (type.toLowerCase()) {
            case 'user':
                if (value instanceof User) return value;
                let fetchUser = this.users.find(
                    u =>
                         u.username.toLowerCase() === value ||
                         u.tag.toLowerCase() === value ||
                         u.id === value.replace(/[\\<>@!]/g, '')
                );
                try {
                    if (!fetchUser) fetchUser = await this.users.fetch(value);
                } catch {}
                return fetchUser || null;

            case 'member':
                if (!(guild instanceof Guild)) this.error('GUILD PARAMETER', 'The guild parameter wasn\'t passed!');
                if (value instanceof GuildMember) return value;
                const fetchMember = guild.members.find(
                    m => 
                         m.user.username.toLowerCase() === value ||
                         m.user.tag.toLowerCase() === value ||
                         m.id === value.replace(/[\\<>@!]/g, '')
                );
                return (await guild.members.fetch(fetchMember.id)) || null;

            case 'role':
                if (!(guild instanceof Guild)) this.error('GUILD PARAMETER', 'The guild parameter wasn\'t passed!');
                if (value instanceof Role) return value;
                const fetchRole = guild.roles.find(
                    r => 
                         r.name.toLowerCase() === value ||
                         r.id === value.replace(/[\\<>@&]/g, '')
                );
                return fetchRole || null;
            
            case 'channel':
                if (!(guild instanceof Guild)) this.error('GUILD PARAMETER', 'The guild parameter wasn\'t passed!');
                if (value instanceof Channel) return value;
                const fetchChannel = guild.channels.find(
                    c => 
                         c.name.toLowerCase() === value ||
                         c.id === value.replace(/[\\<>#]/g, '')
                );
                return fetchChannel || null;

            default:
                return null;
        }
    }

}

module.exports = BotClient;