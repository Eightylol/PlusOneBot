"use strict"

const {Settings, fs, ony, Discord, express, http, https, Promise, mp3Duration, sqlite3} = require(__dirname + '\\init.js')

const	app = express(),
			bot = new Discord.Client()

let db,
		validChannels = Settings.validChannels,
		validCommandArray = Settings.validCommandArray,
		lastMessages = [],
		startTime = Date.now(),
		playInterval

const _embed = require(__dirname + "/assets/modules/messageEmbed.js")

const {A,googleSearch,Clear,L,S,Steam,U,W,I,G} = require(__dirname + '\\modules.js')

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

String.prototype.toHHMMSS = function () {
    let sec_num = parseInt(this, 10),
				days = Math.floor(sec_num / (24 * 60 * 60)),
    		hours   = Math.floor(sec_num / 3600),
    		minutes = Math.floor((sec_num - (hours * 3600)) / 60),
    		seconds = sec_num - (hours * 3600) - (minutes * 60),
				time = ""
		if (days != 0)
			time += days + " days "
		if (hours != "00")
			time += hours + " hours "
		if (minutes != "00")
			time += minutes + " minutes "
		if (seconds != "00")
			time += seconds + " seconds "
    return time
}

const timeStampToHumanReadable = (diff) => {
	var timestamp = new Date(diff)
	var hours = ("0" + (timestamp.getHours()-1)).slice(-2)
	var minutes = ("0" + timestamp.getMinutes()).slice(-2)
	var seconds = ("0" + timestamp.getSeconds()).slice(-2)
	return "The bot has been online for {0} hours, {1} minutes and {2} seconds".format(hours,minutes,seconds)
}

const playFile = (randomFile) => {
	for (var _channel of bot.channels) {
		if (_channel[1].type == "voice" && _channel[1].name == Settings.bot.musicChannel) {
			let channel = bot.channels.get(_channel[1].id)
			channel.join().then((voiceConnection) => {
				voiceConnection.playFile(randomFile, () => {
					console.log("foo")
				})
			})
			break
		}
	}
}


const runCommand = (cmd,message) => {
  let commands = cmd.split(" "),
      command = commands[0]

  if (validCommandArray.indexOf(command) != -1) {

    switch(command) {

			case "clear":
				Clear.get(message,commands, (err,result) => {
					if (err != null) {
						message.channel.sendMessage("",{embed: _embed.error("Clear",err.message)}).then(m => {
							message.delete(5000)
							m.delete(5000)
						})
						return
					}
					message.channel.sendMessage("",{embed: _embed.info("Clear",result)}).then(m => {
						m.delete(5000)
					})
				})
			break

			case "help":
				let _m = {
					title: "Help",
					thumbnail: bot.user.avatarURL,
					color: Settings.ui.colors.messages.info,
					fields : []
				}
				_m.fields.push({
					title:"Available commands",
					value: "!" + validCommandArray.join(" **-** !")
				})
				message.channel.sendMessage("", {
					embed : _embed.rich(_m)
				})
			break

			case "play":
				clearInterval(playInterval)
				let subCmd = cmd.replace("play","").trim().length > 0 ? cmd.replace("play","").trim() : null
				if (subCmd != null) {
					if (subCmd == "help") {
						fs.readdir(__dirname + Settings.soundFx.folder, (err,files) => {
							if (err) {
								message.channel.sendMessage("", {
									embed: _embed.error("Error",err)
								})
								console.log(err)
								return
							}
							let playCmds = []
							files.forEach(file => {
								playCmds.push(file.split(".")[0])
							})
							message.channel.sendMessage("", {
								embed: _embed.info("Help","**Usage: **!play **" + playCmds.join("** | **") + "**")
							})
						})
						return
					}
					let filePath = __dirname + Settings.soundFx.folder + subCmd.trim() + ".mp3"
					fs.exists(filePath, (exists) => {
					  if (exists) {
							message.channel.sendMessage("", {
								embed: _embed.info("!play", "Playing " + subCmd)
							})
					  	playFile(filePath)
					  } else {
							message.channel.sendMessage("", {
								embed: _embed.warning("Warning","**`!play " + subCmd + "`** is not a valid command. Type `!play help` for more.")
							})
						}
					})
				} else {
					fs.readdir(__dirname + Settings.soundFx.folder, (err, files) => {
						let randomFile = __dirname + Settings.soundFx.folder + files[Math.floor(Math.random() * ((files.length-1) - 0 + 1)) + 0]
						mp3Duration(randomFile, function (err, duration) {
						  if (err) return console.log(err.message)
							let dur = duration * 1000
							playFile(randomFile)
							playInterval = setInterval(() => {
								playFile(randomFile)
							},dur)
						})
					})
				}
			break

			case "server":
				G.get(commands[1], (err,_s) => {
					if (err) {
						if (err == "empty") {
							message.channel.sendMessage("", {
								embed: _embed.rich({
									color: Settings.ui.colors.messages.warning,
									fields: [
										{title: "Usage", value: "`!server <ip|hostname>[:port]`"},
										{title: "Examples", value: "`!server 93.190.140.106:27015`"}
									]
								})
							})
						}
						return
					}
					let ip = commands[1].split(":")[0],
							port = commands[1].split(":")[1]
					if (_s.hasOwnProperty("info") && _s.info) {
						message.channel.sendMessage("",{
							embed: _embed.rich({
								title: _s.info.HostName + " Server",
								description: "steam://connect/" + ip + ":" + port,
								color: Settings.ui.colors.messages.info,
								author: {
									name: _s.info.ModDesc,
									img: "https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwczovL2kuaW1ndXIuY29tLzhvVXBqZWIucG5nIn0.JjTRS_hfiqexiUVAfzVDHbDXdIs"
								},
								// thumbnail: bot.user.avatarURL,
								img: _s.rules.headerimage,
								fields: [
									{title: "Map", value: _s.info.Map, inline:true},
									{title: "Players", value: _s.info.Players + "/" + _s.info.MaxPlayers, inline:true},
									{title: "Password", value: _s.info.Password ? "Protected" : "Open", inline:true}
								]
							})
						})
					} else {
						console.log(_s)
					}
				})
			break

			case "steam":
				if (commands.length == 1) {
					Steam.get(true,message,"Not supported")
				} else {
					Steam.get(null,message,cmd.replace("steam",""))
				}
      break

			case "avatar":
				A.get(bot,message, cmd.replace("avatar","").trim(), (avatar) => {
					message.channel.sendMessage("", {
						embed: _embed.rich({
							title: message.author.username,
							img: avatar
						})
					})
					message.delete()
				})
			break

			case "playing":
				if (!message.member.hasPermission('MANAGE_MESSAGES')) {
					message.reply("",{embed: _embed.rich({
						title: "DENIED",
						description: "You do not have the required privileges to do this.",
						thumbnail: bot.user.avatarUrl
					})})
					return
				}
				bot.user.setGame(cmd.replace("playing ","")).then(() => {
					message.reply("",{embed: _embed.rich({
						title: "Playing",
						description: "Bot status set to " + cmd.replace("playing ","")
					})})
				})

			break

			case "ping":
        message.channel.sendMessage("",{embed: _embed.info("Ping","Pong")})
      break

			case "uptime":
				let uptime = (process.uptime() + "").toHHMMSS()
        message.channel.sendMessage("",{embed: _embed.info(Settings.bot.name + " uptime",uptime)})
      break

      case "urban":
        U.get(cmd.replace("urban ",""), (err,_urbanMeaning) => {
					if (err) {
						message.channel.sendMessage("",{embed: _embed.error("Error",err.message)})
						return
					}
					message.channel.sendMessage("**Urban Dictionary**",{embed: _embed.rich({
						title: cmd.replace("urban ","").charAt(0).toUpperCase() + cmd.replace("urban ","").slice(1),
						url: _urbanMeaning.url,
						description: _urbanMeaning.content.replace(".",". "),
						color: Settings.ui.colors.messages.info,
						author: {
							name: _urbanMeaning.author,
							img: bot.user.avatarURL
						}
					})})
				})
      break

      case "wiki":
        W.get(bot,message,cmd.replace("wiki ",""), (err, _wikiMeaning) => {
					if (err) {
						message.channel.sendMessage("",{embed: _embed.error("Error",err)})
						return
					}
					message.channel.sendMessage("**Wikipedia**",{embed: _embed.rich({
						title: cmd.replace("wiki ","").charAt(0).toUpperCase() + cmd.replace("wiki ","").slice(1),
						url: _wikiMeaning.url,
						description: _wikiMeaning.description,
						color: Settings.ui.colors.messages.info,
						fields: [
							{title: "Last edited on wiki", value: _wikiMeaning.last_edited}
						]
					})})
				})
      break

			case "google":
				message.channel.startTyping()
        googleSearch.get(cmd.replace("google ",""), (err, _googleResult) => {
					if (err) {
						message.channel.sendMessage("",{embed: _embed.error("Error",err)})
						message.channel.stopTyping()
						return
					}
					message.channel.sendMessage("**Google** " + cmd.replace("google ",""), {embed: _embed.rich({
						color: Settings.ui.colors.messages.info,
						fields: _googleResult
					})})
					message.channel.stopTyping()
				})
      break

			case "imgur":
				message.channel.startTyping()
        I.get(cmd.replace("imgur ",""), (err, _imgurResult) => {
					if (err) {
						console.log(err)
						message.channel.sendMessage("",{embed: _embed.error("Error",err)})
						message.channel.stopTyping()
						return
					}
					message.channel.sendMessage("!imgur " + cmd.replace("imgur ",""), {embed: _embed.rich(_imgurResult)})
					message.channel.stopTyping()
				})
      break

      case "linkcheck":
        if (commands == 1) {
					L.checkLink(null,message, (err,r_link) => {
						if (err) {
							message.channel.sendMessage("Error!")
						} else {
							message.channel.sendMessage(r_link)
						}
					},bot)
        } else {
          if (commands.length != 2) {
            message.channel.sendMessage("Invalid input")
          } else {
            let link = commands[1].trim().toLowerCase()
            L.checkLink(link,message, (err,r_link) => {
              if (err) {
                message.channel.sendMessage("Error!")
              } else {
                message.channel.sendMessage(r_link)
              }
            })
          }
        }
      break

      case "shorten":
        if (commands.length != 2) {
          message.channel.sendMessage(message,"Syntax error")
          return
        }
        S.shorten(ony,commands[1], (err,url) => {
          if (!err) {
            message.channel.sendMessage(url)
          } else {
            message.channel.sendMessage("Shortening error")
          }
        })
      break

    }
  } else {
    message.channel.sendMessage("",{
			embed: _embed.error("Error","`!"+command + "` is not a valid command\nType `!help` for list of commands.")
		})
  }
}

const CheckTable = () => {
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER,author TEXT, type TEXT, content TEXT, channel TEXT, createdAt INTEGER)", err => {
		if (err != null) {
			console.log(err)
			return
		}
	});
}

bot.on("ready", () => {
	db = new sqlite3.Database('db.sqlite3', CheckTable)
	bot.user.setGame(Settings.bot.playing)
	bot.user.setUsername(Settings.bot.name)
	let avatarPath = __dirname + "\\assets\\img\\" + Settings.bot.avatar
	fs.exists(avatarPath, res => {
		if (!res) {
        console.log("Error setting bot avatar. Does " + Settings.bot.avatar + " live in " + __dirname + "\\assets\\img\\" + " ???")
				return
    }
		bot.user.setAvatar(avatarPath)
	})
})

const InsertIntoDatabase = row => {
	let stmt = db.prepare("INSERT INTO messages VALUES (?,?,?,?,?,?)")
	stmt.run(row.id,row.author,row.type,row.content,row.channel,row.createdAt)
	stmt.finalize()
}

function fetchMessages(cb) {
	db.all("SELECT * FROM messages ORDER BY id DESC", function(err, data) {
		cb(data)
		return
  })
}

const logMessage = message => {
	bot.fetchUser(message.author.id)
	.then(user => {
		let msg = {
			id: message.id,
			author: user.id + "|||" + user.username + "|||" + user.avatar,
			type: message.type,
			content: message.content,
			channel: message.channel.name,
			createdAt: message.createdTimestamp
		}
		InsertIntoDatabase(msg)
	})
}

bot.on('message', message => {
	logMessage(message)
	if (message.author.bot) return
	if (!message.content.startsWith(Settings.commandSymbol)) return
  let channelName = message.channel.name
  if (validChannels.indexOf(channelName) != -1) {
    runCommand(message.content.split(Settings.commandSymbol)[1],message)
  }
})

bot.login(Settings.bot.token)

app.use('/public', express.static(__dirname + '/public'))
app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/views/home.html")
})

app.post('/messages', function(req, res) {
	fetchMessages((messages) => {
		messages.forEach(message => {
			let avatarData = message.author.split("|||") // [0] => userId [1] => userName [2] => [avatarId]
			message.userId = avatarData[0]
			message.username = avatarData[1]
			message.avatar = typeof avatarData[2] != "undefined" ? "https://cdn.discordapp.com/avatars/" + avatarData[0] + "/" + avatarData[2] + ".jpg" : null
		})
		res.setHeader('Content-Type', 'application/json')
		res.send(messages)
	})
})

app.listen(Settings.port, function () {
  console.log(Settings.bot.name + ' running on port '+ Settings.port)
})
