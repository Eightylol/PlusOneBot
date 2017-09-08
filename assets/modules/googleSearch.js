const Settings = require(__dirname + "\\..\\..\\settings.js"),
			cheerio = require('cheerio'),
			request = require('request')


const googleFunc = (q,cb) => {
	if (!q || q.trim() == "") return cb("empty")
	let _endpoint = "https://www.googleapis.com/customsearch/v1?key=" + Settings.google.apikey + "&num=" + Settings.google.search.num_results + "&cx=" + Settings.google.cx + "&q=" + encodeURI(q)
	console.log(_endpoint)
	request(_endpoint, (err,resp,body) => {
		if (!err) {
			let _searchResults = JSON.parse(body) || null
			if (_searchResults != null && _searchResults.hasOwnProperty("searchInformation")) {
				let sInfo = _searchResults.searchInformation
				let sNumResults = parseInt(sInfo.totalResults)
				if (sNumResults > 0) {
					let _fields = []
					for(var i in _searchResults.items) {
						_fields.push({
							title: _searchResults.items[i].title,
							value: _searchResults.items[i].snippet + "\n" + _searchResults.items[i].link
						})
					}
					cb(null,_fields)
					return
				} else {
					// No search results
					cb("no_results")
				}
			} else {
				// Error retrieving json. Apikey or CX?
				cb("error_json")
			}

		} else {
			// Error while requesting google customsearch enpoint. Apikey or CX?
			cb("error_endpoint")
		}
	})
}

module.exports = {
  get : googleFunc
}
