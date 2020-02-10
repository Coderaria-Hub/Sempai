require('./structures/Message');
require('./structures/Guild');

const Sempai = require('./structures/Sempai');
const client = new Sempai({
    messageCacheMaxSize: 50,
    messageCacheLifetime: 300,
    messageSweepInterval: 900,
    disableEveryone: true,
    disabledEvents: ['TYPING_START'],
    partials: ['MESSAGE', 'REACTION']
});

client.processEvents();
client.processCommands();
client.login().catch(console.error);