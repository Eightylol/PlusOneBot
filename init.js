
module.exports = {
	Settings: require(__dirname + '\\Settings.js'),
  fs : require('fs'),
	ony: require('ony'),
	Discord: require('Discord.js'),
	express: require('express'),
	http: require('follow-redirects').http,
	https: require('follow-redirects').https,
	Promise: require('bluebird'),
	mp3Duration: require('mp3-duration'),
	sqlite3: require('sqlite3').verbose(),
}
