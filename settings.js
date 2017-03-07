module.exports = {
	bot : {
		name: "+1 Bot",
		playing:"Alpha",
		musicChannel: "Music",
		avatar: "botAvatar.png"
	},
	steam: {
		apikey: '729B074D90A891022A35C2C45D9CA03B' // INSERT API KEY HERE
	},
	commandSymbol: "!",
	port:6543,
  validChannels : [
		"resources",
	  "general",
		"bot-testing"
	],
	validCommandArray : [
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
