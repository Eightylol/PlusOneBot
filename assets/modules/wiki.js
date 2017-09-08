const request = require('request')
const cheerio = require('cheerio')
const wikiFunc = (bot,message,phrase,cb) => {
  let url = "https://en.wikipedia.org/wiki/"+encodeURI(phrase);
	request(url, (error, response, html) => {
		if (!error && response.statusCode == 200) {
			try {
				let $ = cheerio.load(html)
				let article = {
					title:$("title").text() || null,
					url:url || null,
					body:$('#mw-content-text > p').eq(0).text() || null,
					last_edited: $('#footer-info-lastmod').text() || null
				}
				cb(null, {
					title: article.title,
					url: article.url,
					description: article.body,
					last_edited: article.last_edited.replace("This page was last modified on ","")
				})
				return
			} catch (e) {
				cb("Not found")
				return
			}
		} else {
			cb("Not found")
			return
		}
	})
}
module.exports = {
  get : wikiFunc
}
