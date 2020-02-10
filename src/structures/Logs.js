const ms = require('pretty-ms');
const db = require('quick.db');
const {
    stripIndents
} = require('common-tags');
const {
    COLORS: {
        punish
    }
} = require('./Constants');

class Logs {
    constructor(guild, client) {
        this.guild = guild;
        this.client = client;
    }

    /** Returns the guild's logs.
     * @param {Object=} options - Optional.
     * @param {Booleon} options.partials - Whether to include deleted logs or not.
     * @param {String} options.user - Whether to filter logs by offender.
     * @param {Number} options.id - Returns the specific log.
    */
    async get({user, partials, logID} = {}) {
        let data = await db.fetch(`logs_${this.guild.id}`);
        if (partials) data = data.filter(x => !x.partial || (x.partial && x.partials));
        if (user) data = data.filter(x => x.offender === user);
        if (logID) data = data.filter(x => x.logID === logID);
        return data.sort((a, b) => {
            return a.logID - b.logID;
        });
    }

    /* Returns the next log ID. */
    async next() {
        return ++(await this.get()).length;
    }

    /** Returns logs performed by a specific moderator.
     * @param {String} id - Filter logs by this moderator their ID.
    */
    async byMod(id) {
        return (await this.get())
                .filter(x => x.moderator === id)
                .sort((a, b) => {
                    return b.issuedAt - a.issuedAt;
                });
    }

    /** Creates a new log.
     * @param {String} offender - User object of the logged offender.
     * @param {String} mod - User object of the logged moderator.
     * @param {Object} options - Type is required.
     * @param {String} options.type - Type of log. (Warning, mute, kick, ban.)
     * @param {Number=0} options.time - Duration for the log. (In milliseconds.)
     * @param {String='No Reason Provided'} options.reason - Reason of the log.
    */
    async create(offender, mod, {
        type,
        time = 0,
        reason
    }) {
        const client = this.client;
        const logID = await this.next();
        const format = t => ms(t, {
            verbose: true
        });
        const data = await this.get({
            partials: true
        });
        const member = await client.resolve('member', offender.id, this.guild);
        reason = reason
                        ? typeof reason === 'object'
                                ? reason.join(' ')
                                : reason
                            : 'No Reason Provided';

        data.push({
            logID,
            type,
            partial: false,
            time,
            reason,
            offender: offender.id,
            moderator: mod.id,
            expired: !!time || null,
            issuedAt: new Date.now().getTime(),
            roles: member ? member.roles.map(x => x.id).filter(x => x.id !== this.guild.id) : null,
            message: null
        });

        await db.push(`logs_${this.guild.id}`, [data]);

        const embed = new client.Embed()
            .setColor(punish)
            .setTitle(`${type} | #${logID}`)
            .setDescription(stripIndents`
                **Moderator** ${mod.tag} (${mod.id})
                **User** ${offender.tag} (${offender.id})
                **Time** ${time ? `\n**Duration** ${format(time)}` : ''}
                **Reason** ${reason}
            `)
            .setTimestamp();

        const modChan = await db.fetch(`modChan_${this.guild.id}`);
        const chan = client.channels.get(modChan);

        if (chan) {
            chan.send(embed).then(m => {
                this.update(logID, {message: m.id});
            });
        }
    }

    /** Updates a log.
     * @param {Object} data - The data to update.
     * @param {Number} logID - The log to update.
    */
    async update(data, logID) {
        const {time, reason} = data;
        const client = this.client;
        const guildLogs = await this.get();
        const format = t => ms(t, {
            verbose: true
        });
        const log = (await this.get({
            logID
        }))[0];
        if (log) {
            let edit = false;
            if ((reason && reason !== log.reason) || (time && time !== log.time)) edit = true;

            for (const key in data) {
                if (log[key] !== data[key]) log[key] = data[key];
                else continue;
            }

            guildLogs.splice(guildLogs.map(x => x.logID).indexOf(log.logID), 1, log);
            await db.push(`logs_${this.guild.id}`, guildLogs);

            const modLogsChan = await db.fetch(`modChan_${this.guild.id}`);
            const chan = client.channels.get(modLogsChan);
            const moderator = await client.resolve('user', log.moderator);
            const user = await client.resolve('user', log.offender);

            if (chan) {
                chan.messages
                        .fetch(log.message)
                            .then(msg => {
                                if (moderator && user) {
                                    const upEmb = new client.Embed()
                                        .setTitle(`Moderation: ${log.type} | Case #${log.logID}`)
                                        .setDescription(stripIndents`
                                            **Moderator** ${moderator.tag} (${moderator.id})
                                            **User** ${user.tag} (${user.id})
                                            **Time** ${log.time ? `\n**Duration** ${format(log.time)}` : ''}
                                            **Reason** ${log.reason}
                                        `)
                                        .setTimestamp();

                                        if (edit) msg.edit(upEmb);
                                }
                                if (log.partial) msg.delete();
                            })
                              .catch(() => null);
            }
        }
    }

    async delete(logID) {
        return await this.update(logID, {partial: true});
    }
}

module.exports = Logs;