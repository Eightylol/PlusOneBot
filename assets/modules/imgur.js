const request = require('request'),
			cheerio = require('cheerio')
let apiPath = "https://api.imgur.com/3/gallery/search/top/all/0?q_type=jpg&q="
var options = {
  url: apiPath,
  headers: {
    'Authorization': 'Client-ID 0b4c755dbadd789'
  }
}

const parsePage = (link,cb) => {
	request(link, (err,resp,body) => {
		if (err) {
			cb(err)
			return
		}
		let $ = cheerio.load(body)
		let data = {}
		let img =
				$('.post-image > img').attr('src') ||
				$('.post-image > a > img').attr('src') ||
				$('.video-container > .video-elements').children('source').eq(0).attr('src') ||
				null
		if (img != null) {
			data.img = "https:"+img
			cb(null,data)
			return
		}
		cb("not_found")
		return
	})
}

const imgurFunc = (q,cb) => {
	let opts = options
	opts.url = "https://api.imgur.com/3/gallery/search/top/all/0?q_type=jpg&q=" + encodeURI(q)
	request(opts, (err,resp,body) => {
		if (err) {
			console.log("ERR",err)
			return
		}
		let json = JSON.parse(body),
				image = json.data[0] || null
		if (image != null) {
			let _imgurObj = {
				title: image.title,
				url: image.link
			}
			if (image.link.endsWith(".jpg")) {
				_imgurObj.img = image.link
				cb(null,_imgurObj)
				return
			} else {
				parsePage(image.link, (er,data) => {
					if (!er) {
						_imgurObj.img = data.img
					}
					cb(null,_imgurObj)
					return
				})
			}
		} else {
			// Error using endpoing
			console.log("Error using endpoint",q)
		}
	})
}

module.exports = {
  get : imgurFunc
}
