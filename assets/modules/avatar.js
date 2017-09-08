const avatarFunc = (bot,message,userName,cb) => {
	if (userName != "") {
		let users = Array.from(bot.users)
		for (var i = 0; i < users.length; i++) {
			let user = users[i][1]
			let _userName = user.username || null;
			if (_userName != null && _userName == userName) {
				let avatarId = user.avatar || null
				if (avatarId != null) {
					let avatarUrl = "https://cdn.discordapp.com/avatars/"+user.id+"/"+avatarId+".jpg"
					cb(avatarUrl)
					return
				} else {
					cb("No avatar... :´-(")
				}
			}
		}
	} else {
		cb(message.author.avatarURL.split("?")[0])
	}
}
module.exports = {
  get : avatarFunc
}
