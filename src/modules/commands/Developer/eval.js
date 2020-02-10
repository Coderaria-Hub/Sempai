const beautify = require('beautify');
const {
    stripIndents
} = require('common-tags');
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
    category: 'Developer',
    name: 'evaluate',
    aliases: ['eval', 'ev'],
    usage: 'sp.evaluate [Code To Run]',
    description: 'Runs a code by command inside a Discord chat.',
    access: 'Developers',

    /* Other Command Settings */
    disabled: true,
    deleteInvoke: true,
    args: true,
    guildBound: true,
    helperBound: false,
    modBound: false,
    adminBound: false,
    devBound: true,

    /* Command Running */
    async execute(message, args) {

        const { client, author, channel } = message;
        let evulation = args.join(' ');
        const format = x => `\`\`\`js\n${x}\`\`\``;

        const input = 
            evulation.length > 1000
                ? await bin.post(evulation)
                : format(evulation);

        const embed = new client.Embed();

        try {
            const start = process.hrtime();
            
            if (evulation.includes('await'))
                evulation = `(async () => { ${evulation} })`;

            const _ = eval(evulation);
            const diff = process.hrtime(start);
            const type = client.captialise(typeof _);
            const time = diff[0] > 0 ? `${diff[0]}s` : `${diff[1] / 1000000}ms`;
            let output = beautify(inspect(_, { depth: 0 }), {
                format: 'js'
            });

            output = output.length > 1000 ? await bin.post(output) : format(output);

            embed.correct('Evaluation', stripIndents`
                This eval was requested by ${author.tag}
            `)
              .addField('Input', input)
              .addField('Output', output)
              .addField('Additional Info', `**Type** ${type}\n**Time** ${time}`)
        } catch(e) {
            const error =
                          e.stack.length > 1000 ? await bin.post(e.stack) : format(e.stack);
                
            embed.error('Evaluation', stripIndents`
                This eval was requested by ${author.tag}
            `)
              .addField('Input', input)
              .addField('Output', error)
              .addField('Additional Info', `**Type** Error`)
        }

        client.delete(channel, embed, 25000);
    }
}