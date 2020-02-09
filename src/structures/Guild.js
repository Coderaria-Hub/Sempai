const {
    Structures
} = require('discord.js');
const db = require('quick.db');
const Logs = require('./Logs');

module.exports = Structures.extend('Guild', Guild => {
    class GuildExt extends Guild {
        constructor(client, data) {
            super(client, data);
            this.logs = new Logs(this);
        }

        async isStaff(member) {
            member = await this.client.resolve('member', member.id, this);
            const roles = {};

            if (member) {
                const helper = await db.fetch(`helper_${this.id}`);
                const mod = await db.fetch(`mod_${this.id}`);
                const admin = await db.fetch(`admin_${this.id}`);

                if (
                    member.hasPermission(['MANAGE_MESSAGES']) ||
                    (helper && helper.length && helper.some(x => member.roles.has(x)))
                    ) {
                      roles.helper = true;
                    } else if (
                               member.hasPermission(['KICK_MEMBERS']) ||
                               (mod && mod.length && mod.some(x => member.roles.has(x)))
                               ) {
                                   roles.mod = true;
                                } else if (
                                           member.hasPermission(['MANAGE_CHANNELS']) ||
                                           (admin && admin.length && admin.some(x => member.roles.has(x))) 
                                           ) {
                                                roles.admin = true;
                                            };
            }
            return roles;
        }
    }
    return GuildExt;
});