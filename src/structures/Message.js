const {
    Collection,
    Structures
} = require('discord.js');
const {
    MSGS: {
        usage,
        onCooldown,
        guildOnly,
        helperOnly,
        modOnly,
        adminOnly,
        devOnly
    },
    IDS: {
        developers
    }
} = require('./Constants');
const db = require('quick.db');
const cooldowns = new Collection();

module.exports = Structures.extend('Message', Message => {
    class MessageExt extends Message {
        constructor(...args) {
            super(...args);
        }

        get commandProps() {
            let [cmd, ...args] = this.content
                                             .slice(this.client.prefix.length)
                                                                              .trim()
                                                                                     .split(/ +/g);
            if (cmd)
                     cmd =
                           this.client.commands.get(cmd.toLowerCase()) ||
                           this.client.commands.find(
                                                     c =>
                                                          c.aliases &&
                                                          c.aliases.includes(cmd.toLowerCase())
                           );
            
            const flagArgs = args.filter(a => a.startsWith('--')).map(x => x.slice(2));
            args = args.filter(a => !a.startsWith('--'));

            const flags = {};
            flagArgs.forEach(flag => {
                flags[flag]
            });

            return {
                cmd,
                args,
                flags
            };
        }

        commandCooldown({
            name,
            cooldown
        }, author) {
            
        }
    }
})