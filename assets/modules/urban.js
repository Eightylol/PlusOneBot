const urban = require('urban'),
			cheerio =require('cheerio'),
			request = require('request')

const urbanFunc = (phrase,cb) => {
  let r = urban(phrase)
  r.first((json) => {
		if (typeof json != "undefined") {
			request(json.permalink,(err, resp, html) => {
				if (!err) {
					let $ = cheerio.load(html)
					let _urbanMeaning = {
						title: $('#content .def-header').eq(0).text().replace(/(\r\n|\n|\r)/gm,""),
						content: $('#content .meaning').eq(0).text().replace(/(\r\n|\n|\r)/gm,""),
						author: $('#content .contributor').eq(0).text(),
						url: json.permalink
					}
					cb(null,_urbanMeaning)
					return
				}
			})
			return
		} else {
			cb({message: "Not found"})
			return
		}
  })
}
module.exports = {
  get : urbanFunc
}
