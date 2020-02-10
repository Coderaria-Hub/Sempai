module.exports = {
    name: 'ready',
    run({log, user}) {
        log(`${user.tag} successfully logged into Discord...`);
    }
}