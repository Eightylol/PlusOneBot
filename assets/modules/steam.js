const SteamApi = require('steam-api')
const Settings = require(__dirname + "\\..\\..\\settings.js")
const _embed = require(__dirname + "\\messageEmbed.js")
const app = new SteamApi.App(Settings.steam.apikey)
const toMarkdown = require('to-markdown')
const q = require('q')
let appList;

app.GetAppList().done(function(result){
	appList = result
})

const OutputGameInfo = (message,appId) => {
	app.appDetails(appId).done(function(g){
		let _m = {
			title: g.name,
			img: g.header,
			color: Settings.ui.colors.messages.info,
			fields: []
		}

		if (typeof g.metacritic != "undefined" && g.metacritic.score && g.metacritic.url) {
			let mCritics = {
				title: "Metacritics",
				value: "**Score** " + g.metacritic.score + "\n" + g.metacritic.url
			}
			_m.fields.push(mCritics)
		}

		if (typeof g.price != "undefined" && g.price.currency && g.price.initial && g.price.final) {
			let price = g.price.final+" ".trim()
			price = price.substring(0,price.length-2)+" " +g.price.currency
			_m.fields.push({
				title: "Price",
				value: price
			})
		}

		if (typeof g.categories != "undefined" && g.categories.length > 0) {
			let categories = []
			for (var i = 0; i < g.categories.length; i++) {
				let category = g.categories[i]
				categories.push(category.description)
			}
			_m.fields.push({
				title: "Categories",
				value: categories.join(", ")
			})
		}

		if (typeof g.genres != "undefined" && g.genres.length > 0) {
			let genres = []
			for (var i = 0; i < g.genres.length; i++) {
				let genre = g.genres[i]
				genres.push(genre.description)
			}
			_m.fields.push({
				title: "Genres",
				value: genres.join(", ")
			})
		}

		if (typeof g.platforms != "undefined") {
			_m.fields.push({
				title: "Platforms",
				value: "**Windows:** " + ( g.platforms.windows ? "yes " : "no " ) + "**Mac:** " + ( g.platforms.mac ? "yes " : "no " ) + "**Linux:** " + ( g.platforms.linux ? "yes " : "no " )
			})
		}

		if (typeof g.release != "undefined") {
			_m.fields.push({
				title: "Release",
				value: g.release.date
			})
		}


		// console.log(g)
		message.channel.sendMessage("",{
			embed: _embed.rich(_m)
		})
	});
}

const InitGameInfo = (message,q) => {
	if (appList.length > 0) {
		for (var i = 0; i < appList.length; i++) {
			let game = appList[i];
			if (game.name.toLowerCase().replace(["-"]," ").replace(":"," ").replace("  "," ").indexOf(q.toLowerCase()) != -1) {
				let appId = game.appid
				OutputGameInfo(message,appId);
				return
			}
		}
		message.channel.sendMessage(q + " not found...");
	}
}

const SearchArrToString = (search) => {
	search.shift()
	return search.join(" ")
}

const ParseParams = (message,search) => {
	let q = search[0]
	if (q == "game") {
			search = SearchArrToString(search)
			InitGameInfo(message,search)
			return
	} else if(q == "top") {
		message.channel.sendMessage("",{
			embed: _embed.info("!steam top", "Top not implemented yet.")
		})
	}
}

const steamFunc = (error,message,search) => {
	if (error != null) {
		message.channel.sendMessage("",{
			embed: _embed.error("!steam", search)
		})
		return
	}
	search = search.split(" ")
	if (search[0].trim() == "") {
		search.shift()
	}
	if (search.length > 0) {
		ParseParams(message,search)
	}
}

module.exports = {
  get : steamFunc
}
