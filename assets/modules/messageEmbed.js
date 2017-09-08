const Settings = require(__dirname + "\\..\\..\\settings.js"),
Discord = require('discord.js'),
EmbedFunc = (options) => {
	let embed = new Discord.RichEmbed()
	if (options.hasOwnProperty("title")) {
		embed.setTitle(options.title)
	}
	if (options.hasOwnProperty("author")) {
		embed.setAuthor(options.author.name,options.author.img)
	}
	if (options.hasOwnProperty("color")) {
		embed.setColor(options.color)
	}
	if (options.hasOwnProperty("description")) {
		embed.setDescription(options.description)
	}
	if (options.hasOwnProperty("footer")) {
		embed.setFooter(options.footer)
	}
	if (options.hasOwnProperty("img")) {
		embed.setImage(options.img)
	}
	if (options.hasOwnProperty("thumbnail")) {
		embed.setThumbnail(options.thumbnail)
	}
	if (options.hasOwnProperty("url")) {
		embed.setURL(options.url)
	}

	if (options.hasOwnProperty("fields") && options.fields.length > 0) {
		for (var i = 0; i < options.fields.length; i++) {
			let field = options.fields[i]
			if (field.hasOwnProperty("inline")) {
				embed.addField(field.title,field.value,field.inline)
			} else {
				embed.addField(field.title,field.value)
			}
		}
	}
	if (options.hasOwnProperty("timestamp")) {
		embed.setTimestamp()
	}
	return embed
},
InfoFunc = (title, description) => {
	return EmbedFunc({
		title: title,
		description: description,
		color: Settings.ui.colors.messages.info
	})
},
ErrorFunc = (title,description) => {
	return EmbedFunc({
		title: title,
		description: description,
		color: Settings.ui.colors.messages.error
	})
},
WarningFunc = (title,description) => {
	return EmbedFunc({
		title: title,
		description: description,
		color: Settings.ui.colors.messages.warning
	})
}
module.exports = {
	info: InfoFunc,
	error: ErrorFunc,
	warning: WarningFunc,
  rich: EmbedFunc
}
