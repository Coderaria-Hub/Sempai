const {
    MessageEmbed
} = require('discord.js');
const {
    COLORS: {
        main,
        correct,
        marriage,
        report,
        punish,
        bug,
        errors
    }
} = require('./Constants');

class Embed extends MessageEmbed {
    constructor(data = {}) {
        super(data);
        this.setTimestamp().setColor(main);
    }

    main(type, msg) {
        this.setTitle(type)
            .setColor(main)
            .setDescription(msg)
            .setTimestamp()
        return this;
    }

    correct(type, msg) {
        this.setTitle(type)
            .setColor(correct)
            .setDescription(msg)
            .setTimestamp()
        return this;
    }

    marry(type, msg) {
        this.setTitle(type)
            .setColor(marriage)
            .setDescription(msg)
            .setTimestamp()
        return this;
    }

    report(type, msg) {
        this.setTitle(type)
            .setColor(report)
            .setDescription(msg)
            .setTimestamp()
        return this;
    }

    punish(type, msg) {
        this.setTitle(type)
            .setColor(punish)
            .setDescription(msg)
            .setTimestamp()
        return this;
    }

    bug(type, msg) {
        this.setTitle(type)
            .setColor(bug)
            .setDescription(msg)
            .setTimestamp()
        return this;
    }

    error(type, msg) {
        this.setTitle(type)
            .setColor(errors)
            .setDescription(msg)
            .setTimestamp()
        return this;
    }
}

module.exports = Embed;