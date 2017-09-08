module.exports = {
	bot : {
		name: "+1 Bot",
		playing:"Alpha",
		musicChannel: "Music",
		avatar: "botAvatar.png",
		token: "[TOKEN]"
	},
	ui : {
		colors: {
			messages : {
				info: "#5bc0de",
				error: "#c9302c",
				warning: "#f0ad4e"
			}
		}
	},
	steam: {
		apikey: '[APIKEY]' // INSERT API KEY HERE
	},
	google: {
		apikey: "[APIKEY]",
		cx: "007343989315666686152:zss4ryhcthw",
		search: {
			num_results: 3
		}
	},
	commandSymbol: "!",
	port:6543,
  validChannels : [
		"resources",
	  "general",
		"bot-testing"
	],
	validCommandArray : [
		"clear",
		"help",
		"play",
		"ping",
	  "linkcheck",
	  "shorten",
	  "urban",
	  "wiki",
		"google",
		"server",
		"imgur",
		"steam",
		"uptime",
		"avatar",
		"playing"
	],
	soundFx : {
		// remember to use backslashes before and after \\FOLDERNAME\\SUBFOLDERNAME\\
		folder: "\\assets\\soundFX\\"
	}

}
