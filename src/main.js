require('./structures/Message');
require('./structures/Guild');

const Sempai = require('./structures/Sempai');
const client = new Sempai({
    messageCacheMaxSize: 100,
    messageCacheLifetime: 300,
    messageSweepInterval: 500,
    disabledEvents: ['TYPING_START'],
    partials: ['MESSAGE', 'REACTION']
});

client.processEvents();
client.processCommands();
client.login().catch(console.error);