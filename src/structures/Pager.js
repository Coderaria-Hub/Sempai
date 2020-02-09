module.exports = class Paginator {
	constructor(channel, pages = []) {
		this.pages = pages;
		this.channel = channel;
		this.message = null;
		this.current = 0;
	}

	async start(filter, options = { time: 30000 }) {
		this.message = await this.channel.send(this.pages[this.current]);
		await Promise.all([
			this.message.react("⏮️"),
			this.message.react("⬅️"),
			this.message.react("⏹️"),
			this.message.react("➡️"),
			this.message.react("⏭️"),
			this.message.react("🔢")
		]);
		const collector = this.message.createReactionCollector(filter, options);
		collector
			.on("collect", reaction => {
				this.type(reaction.emoji.name);
			})
			.on("end", () => this.stop());
	}

	set(index) {
		const page = this.pages[index];
		if (page) {
			this.current = index;
			this.message.edit(page).catch(() => {
				this.close();
			});
		}
	}

	stop() {
		if (this.message) this.message.reactions.removeAll();
	}

	close() {
		this.message.delete().catch(() => null);
		this.message = null;
	}

	add(page, skip) {
		this.pages = this.pages.push(page);
		if (skip) this.seek(this.pages.length - 1);
	}

	remove(index) {
		const page = this.pages[page];
		if (page) {
			this.pages.splice(page, 1);
			if (this.current === index) this.seek(0);
		}
	}

	next() {
		this.set(this.current + 1);
	}

	previous() {
		this.set(this.current - 1);
	}

	seek(index) {
		this.set(index);
	}

	type(emoji) {
		switch (emoji) {
			case "➡️":
				this.next();
				break;
			case "⬅️":
				this.previous();
				break;
			case "⏭️":
				this.seek(this.pages.length - 1);
				break;
			case "⏮️":
				this.seek(0);
				break;
			case "⏹️":
				this.close();
				break;
			case "🔢":
				//this.choose();
				break;
		}
		return this;
	}
};
