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
            if (!cooldowns.has(name)) {
                cooldowns.set(name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(name);
            const amount = (cooldown || 3) * 1000;
            
            if (timestamps.has(this.author.id)) {
                const expTime = timestamps.get(this.author.id) + amount;
                if (now < expTime) {
                    const timeLeft = (expTime - now) / 1000;
                    return  this.client.delete(this.channel, new this.client.Embed().error('On Cooldown', this.client.format(onCooldown, author.tag, name, timeLeft.toFixed(1))), 25000);
                }
            }

            timestamps.set(this.author.id, now);
            setTimeout(() => timestamps.delete(this.author.id), amount);
        }

        async commandCheck(args, cmd, author, guild) {
            if (cmd.disabled) {
                return this.client.delete(this.channel, new this.client.Embed().error('Command Disability', `The command \`${this.client.captialise(cmd.name)}\` is currently disabled!`), 25000);
            }

            if (cmd.guildBound && !this.guild && this.channel.type !== 'text') {
                return this.client.delete(this.channel, new this.client.Embed().error('Invalid Channel', this.client.format(guildOnly, author.tag, cmd.name)), 25000);
            }

            if (cmd.devBound && !developers.includes(author.id)) {
                return this.client.delete(this.channel, new this.client.Embed().error('Invalid Permissions', client.format(devOnly, author.tag, cmd.name)), 25000);
            }

            if (guild) {
                const {
                    helper,
                    mod,
                    admin
                } = await guild.isStaff(author);

                if (cmd.helperBound && !helper) {
                    return this.client.delete(this.channel, new this.client.Embed().error('Invalid Permissions', client.format(helperOnly, author.tag, cmd.name)), 25000);
                }

                if (cmd.modBound && !mod) {
                    return this.client.delete(this.channel, new this.client.Embed().error('Invalid Permissions', client.format(modOnly, author.tag, cmd.name)), 25000);
                }

                if (cmd.adminBound && !admin) {
                    return this.client.delete(this.channel, new this.client.Embed().error('Invalid Permissions', client.format(adminOnly, author.tag, cmd.name)), 25000);
                }
            }

            if (cmd.args && !args.length) {
                return this.client.delete(this.channel, new this.client.Embed().error('Invalid Usage', this.client.format(usage, cmd.category, this.client.captialise(cmd.name), cmd.aliases.join(', '), cmd.usage, cmd.description, cmd.access)), 25000);
            }
        }

    }
    return MessageExt;
});