let modulesPath = __dirname+ "/assets/modules/"
module.exports = {
	A: require(modulesPath + "avatar.js"),
	googleSearch: require(modulesPath + "googleSearch.js"),
	Clear: require(modulesPath + "clear.js"),
	G: require(modulesPath + "gServer.js"),
	I: require(modulesPath + "imgur.js"),
	L: require(modulesPath + "linkcheck.js"),
	S: require(modulesPath + "shorten.js"),
	Steam: require(modulesPath + "steam.js"),
	U: require(modulesPath + "urban.js"),
	W: require(modulesPath + "wiki.js"),
}
